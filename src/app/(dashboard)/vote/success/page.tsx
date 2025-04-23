'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function VoteSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Vote Recorded Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for participating in the election. Your vote has been recorded and verified.
        </p>
        <Link href="/">
          <Button>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  )
} 