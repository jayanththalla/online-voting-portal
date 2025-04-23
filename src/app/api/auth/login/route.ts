import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Voter } from '@/models/Voter'
import { generateToken } from '@/utils/auth'
import { voterLoginSchema } from '@/utils/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = voterLoginSchema.parse(body)

    await connectDB()

    // Find voter by voterId
    const voter = await Voter.findOne({ voterId: validatedData.voterId })
    if (!voter) {
      return NextResponse.json(
        { error: 'Invalid voter ID' },
        { status: 401 }
      )
    }

    // Check if voter has already voted
    if (voter.hasVoted) {
      return NextResponse.json(
        { error: 'You have already voted' },
        { status: 400 }
      )
    }

    // Generate JWT token
    const token = generateToken({ voterId: voter.voterId })

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
} 