import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Voter } from '@/models/Voter'
import { Candidate } from '@/models/Candidate'

export async function GET(request: Request) {
  try {
    await connectDB()

    // Fetch all voters (excluding sensitive data)
    const voters = await Voter.find({}, {
      _id: 1,
      name: 1,
      email: 1,
      voterId: 1,
      hasVoted: 1,
      createdAt: 1
    })

    // Fetch all candidates
    const candidates = await Candidate.find({})

    return NextResponse.json({
      voters: voters,
      candidates: candidates,
      databaseInfo: {
        name: 'voting-app',
        collections: ['voters', 'candidates'],
        host: 'MongoDB Atlas',
        cluster: 'cluster0'
      }
    })
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch database data' },
      { status: 500 }
    )
  }
} 