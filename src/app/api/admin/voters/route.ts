import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Voter } from '@/models/Voter'
import { verifyToken } from '@/utils/auth'

export async function GET(request: Request) {
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
    if (!decoded || (decoded as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    await connectDB()
    const voters = await Voter.find({}, { __v: 0 })
      .sort({ createdAt: -1 }) // Sort by newest first

    return NextResponse.json(voters)
  } catch (error) {
    console.error('Error fetching voters:', error)
    return NextResponse.json(
      { error: 'Failed to fetch voters' },
      { status: 500 }
    )
  }
} 