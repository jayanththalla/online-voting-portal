import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Voter } from '@/models/Voter'
import { Vote } from '@/models/Vote'
import { Candidate } from '@/models/Candidate'
import { verifyToken } from '@/utils/auth'
import { voteSubmissionSchema } from '@/utils/validation'

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)
    if (!decoded || !decoded.voterId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = voteSubmissionSchema.parse(body)

    await connectDB()

    // Check if voter exists and hasn't voted
    const voter = await Voter.findOne({ voterId: decoded.voterId })
    if (!voter) {
      return NextResponse.json(
        { error: 'Voter not found' },
        { status: 404 }
      )
    }

    if (voter.hasVoted) {
      return NextResponse.json(
        { error: 'You have already voted' },
        { status: 400 }
      )
    }

    // Check if candidate exists
    const candidate = await Candidate.findById(validatedData.candidateId)
    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    // Create vote record
    await Vote.create({
      voterId: voter.voterId,
      candidateId: validatedData.candidateId,
      votingPhoto: validatedData.votingPhoto,
    })

    // Update voter and candidate
    await Voter.updateOne(
      { voterId: decoded.voterId },
      { hasVoted: true }
    )

    await Candidate.updateOne(
      { _id: validatedData.candidateId },
      { $inc: { voteCount: 1 } }
    )

    return NextResponse.json({ message: 'Vote recorded successfully' })
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
} 