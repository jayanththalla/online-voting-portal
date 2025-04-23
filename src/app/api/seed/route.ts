import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Candidate } from '@/models/Candidate'

export async function POST(request: Request) {
  try {
    await connectDB()

    // Sample candidates data
    const sampleCandidates = [
      {
        name: 'John Smith',
        party: 'Progressive Party',
        photo: 'https://api.dicebear.com/7.x/initials/svg?seed=JS',
        description: 'Experienced leader with a focus on economic growth and social justice.',
      },
      {
        name: 'Sarah Johnson',
        party: 'Reform Alliance',
        photo: 'https://api.dicebear.com/7.x/initials/svg?seed=SJ',
        description: 'Dedicated to environmental protection and sustainable development.',
      },
      {
        name: 'Michael Chen',
        party: 'Unity Coalition',
        photo: 'https://api.dicebear.com/7.x/initials/svg?seed=MC',
        description: 'Committed to education reform and technological innovation.',
      }
    ]

    // Clear existing candidates
    await Candidate.deleteMany({})

    // Insert sample candidates
    await Candidate.insertMany(sampleCandidates)

    return NextResponse.json({ 
      message: 'Sample candidates added successfully',
      candidates: sampleCandidates
    })
  } catch (error) {
    console.error('Error seeding candidates:', error)
    return NextResponse.json(
      { error: 'Failed to seed candidates' },
      { status: 500 }
    )
  }
} 