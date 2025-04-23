import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached: MongooseCache = (global.mongoose as MongooseCache) || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

// Connection options for better reliability
const connectionOptions = {
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 10000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
} as const;

// Error handling for connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

export async function connectDB() {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, connectionOptions);
    }

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Reset the cached connection on error
    cached.conn = null;
    cached.promise = null;
    throw error;
  }
}

// Function to handle reconnection
export async function reconnectDB() {
  try {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    return await connectDB();
  } catch (error) {
    console.error('Error reconnecting to MongoDB:', error);
    throw error;
  }
}

export default connectDB; 