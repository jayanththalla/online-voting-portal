import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import connectDB from '@/lib/mongodb'
import { Voter } from '@/models/Voter'
import { Candidate } from '@/models/Candidate'

export async function POST(request: Request) {
  try {
    console.log('Starting database setup...')
    
    // Connect to MongoDB
    const conn = await connectDB()
    console.log('Connected to MongoDB')

    if (!mongoose.connection.db) {
      throw new Error('Database connection not established')
    }

    const db = mongoose.connection.db

    // Create collections if they don't exist
    try {
      await db.createCollection('voters')
      console.log('Voters collection created')
    } catch (e) {
      console.log('Voters collection already exists')
    }

    try {
      await db.createCollection('candidates')
      console.log('Candidates collection created')
    } catch (e) {
      console.log('Candidates collection already exists')
    }

    // Add sample candidates
    const sampleCandidates = [
      {
        name: 'John Smith',
        party: 'Progressive Party',
        photo: 'https://api.dicebear.com/7.x/initials/svg?seed=JS',
        description: 'Experienced leader with a focus on economic growth and social justice.',
        voteCount: 0
      },
      {
        name: 'Sarah Johnson',
        party: 'Reform Alliance',
        photo: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
        description: 'Dedicated to environmental protection and sustainable development.',
        voteCount: 0
      },
      {
        name: 'Michael Chen',
        party: 'Unity Coalition',
        photo: 'https://api.dicebear.com/7.x/initials/svg?seed=MC',
        description: 'Committed to education reform and technological innovation.',
        voteCount: 0
      }
    ]

    // Clear existing candidates and add new ones
    await Candidate.deleteMany({})
    await Candidate.insertMany(sampleCandidates)
    console.log('Sample candidates added')

    // Get database stats
    const stats = await db.stats()
    const collections = await db.listCollections().toArray()

    return NextResponse.json({
      message: 'Database setup completed successfully',
      databaseInfo: {
        name: db.databaseName,
        collections: collections.map(col => col.name),
        stats: stats
      },
      sampleCandidates
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Database setup failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 