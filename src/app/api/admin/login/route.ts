import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminLoginSchema } from '@/utils/validation';

// In a real application, these would be stored securely in a database
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123', // Plain text password for demo purposes
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input using Zod schema
    const validationResult = adminLoginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { username, password } = validationResult.data;

    // Validate credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Generate JWT token
      const token = jwt.sign(
        { username, role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      return NextResponse.json({ 
        token,
        user: { username, role: 'admin' }
      });
    }

    // Return error for invalid credentials
    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 