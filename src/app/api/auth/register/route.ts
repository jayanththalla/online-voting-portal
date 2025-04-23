import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { Voter } from '@/models/Voter'
import { generateVoterId, generateToken } from '@/utils/auth'
import { voterRegistrationSchema } from '@/utils/validation'

export async function POST(request: Request) {
  try {
    console.log('Registration API called')
    const body = await request.json()
    console.log('Request body:', body)
    
    const validatedData = voterRegistrationSchema.parse(body)
    console.log('Validated data:', validatedData)

    console.log('Connecting to MongoDB...')
    await connectDB()
    console.log('Connected to MongoDB')

    // Check if email already exists
    console.log('Checking if email exists:', validatedData.email)
    const existingVoter = await Voter.findOne({ email: validatedData.email })
    if (existingVoter) {
      console.log('Email already exists')
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Generate unique voter ID
    console.log('Generating voter ID')
    const voterId = generateVoterId(validatedData.name, validatedData.email)
    console.log('Generated voter ID:', voterId)

    // Create new voter
    console.log('Creating new voter')
    const voter = await Voter.create({
      ...validatedData,
      voterId,
      hasVoted: false,
    })
    console.log('Voter created:', voter)

    // Generate JWT token
    console.log('Generating JWT token')
    const token = generateToken({ voterId: voter.voterId })
    console.log('JWT token generated')

    return NextResponse.json({ token, voterId: voter.voterId })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
} 