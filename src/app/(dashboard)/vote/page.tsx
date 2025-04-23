'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useWebcam } from '@/hooks/useWebcam'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { voteSubmissionSchema } from '@/utils/validation'
import type { z } from 'zod'
import { motion } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Camera, RefreshCw, CheckCircle, Info } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type VoteForm = z.infer<typeof voteSubmissionSchema>

interface Candidate {
  _id: string
  name: string
  party: string
  photo: string
  description: string
}

// Party colors mapping
const partyColors: Record<string, { bg: string; text: string }> = {
  'Indian National Congress': { bg: 'bg-blue-50', text: 'text-blue-700' },
  'Bharatiya Janata Party': { bg: 'bg-orange-50', text: 'text-orange-700' },
  'Aam Aadmi Party': { bg: 'bg-green-50', text: 'text-green-700' },
  'Telugu Desam Party': { bg: 'bg-yellow-50', text: 'text-yellow-700' },
  'Communist Party of India': { bg: 'bg-red-50', text: 'text-red-700' },
  'Nationalist Congress Party': { bg: 'bg-purple-50', text: 'text-purple-700' },
}

export default function VotePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { toast } = useToast()
  const { webcamRef, imgSrc, capture, retake, videoConstraints, isClient, WebcamComponent } = useWebcam()
  
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string>('')
  const [formData, setFormData] = useState<VoteForm>({
    candidateId: '',
    votingPhoto: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedCandidateDetails, setSelectedCandidateDetails] = useState<Candidate | null>(null)

  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }

    // Fetch candidates
    const fetchCandidates = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/candidates', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to fetch candidates')
        }
        
        const data = await response.json()
        setCandidates(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load candidates')
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : 'Failed to load candidates',
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCandidates()
  }, [token, router, toast])

  useEffect(() => {
    if (selectedCandidate) {
      const candidate = candidates.find(c => c._id === selectedCandidate)
      setSelectedCandidateDetails(candidate || null)
    } else {
      setSelectedCandidateDetails(null)
    }
  }, [selectedCandidate, candidates])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    setError('')
    setValidationErrors({})
    setIsLoading(true)

    try {
      // Validate form data
      const validationResult = voteSubmissionSchema.safeParse(formData)
      if (!validationResult.success) {
        const formattedErrors: Record<string, string> = {}
        validationResult.error.errors.forEach(err => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message
          }
        })
        setValidationErrors(formattedErrors)
        throw new Error('Please fill in all required fields')
      }

      // Submit vote
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit vote')
      }

      setShowSuccess(true)
      toast({
        title: "Success",
        description: "Your vote has been recorded successfully",
      })

      // Redirect to home page after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote')
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to submit vote',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCapture = () => {
    const photo = capture()
    if (photo) {
      setFormData(prev => ({ ...prev, votingPhoto: photo }))
      if (validationErrors.votingPhoto) {
        setValidationErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.votingPhoto
          return newErrors
        })
      }
    }
  }

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidate(candidateId)
    setFormData(prev => ({ ...prev, candidateId }))
    if (validationErrors.candidateId) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.candidateId
        return newErrors
      })
    }
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Vote Recorded Successfully!</CardTitle>
              <CardDescription className="text-center">
                Thank you for participating in the election.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                You will be redirected to the home page shortly...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Indian General Elections 2024</CardTitle>
            <CardDescription>
              Select your candidate and take a photo to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label>Select a Candidate</Label>
                <RadioGroup
                  value={selectedCandidate}
                  onValueChange={handleCandidateSelect}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {candidates.map((candidate) => {
                    const partyColor = partyColors[candidate.party] || { bg: 'bg-gray-50', text: 'text-gray-700' }
                    return (
                      <div key={candidate._id}>
                        <RadioGroupItem
                          value={candidate._id}
                          id={candidate._id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={candidate._id}
                          className={`flex flex-col items-center justify-between rounded-md border-2 border-muted ${partyColor.bg} p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer`}
                        >
                          <Avatar className="h-24 w-24 mb-2 border-2 border-white shadow-md">
                            <AvatarImage src={candidate.photo} alt={candidate.name} />
                            <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="text-center">
                            <p className={`font-semibold ${partyColor.text}`}>{candidate.name}</p>
                            <p className="text-sm font-medium">{candidate.party}</p>
                          </div>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
                {validationErrors.candidateId && (
                  <p className="text-sm text-destructive">{validationErrors.candidateId}</p>
                )}
              </div>

              {selectedCandidateDetails && (
                <Card className="border-dashed">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Candidate Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedCandidateDetails.photo} alt={selectedCandidateDetails.name} />
                        <AvatarFallback>{selectedCandidateDetails.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedCandidateDetails.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedCandidateDetails.party}</p>
                        <p className="text-sm mt-2">{selectedCandidateDetails.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <Label>Take a Photo for Verification</Label>
                <div className="relative">
                  {!imgSrc ? (
                    <>
                      {isClient && WebcamComponent && (
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                          <WebcamComponent
                            audio={false}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            ref={webcamRef}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <Button
                        type="button"
                        onClick={handleCapture}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                        disabled={isLoading}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Capture Photo
                      </Button>
                    </>
                  ) : (
                    <div className="relative">
                      <img
                        src={imgSrc}
                        alt="Captured photo"
                        className="w-full rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={retake}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                        variant="secondary"
                        disabled={isLoading}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retake Photo
                      </Button>
                    </div>
                  )}
                </div>
                {validationErrors.votingPhoto && (
                  <p className="text-sm text-destructive">{validationErrors.votingPhoto}</p>
                )}
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Your vote is confidential and will be recorded securely. The photo is only used for verification purposes.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !selectedCandidate || !imgSrc}
              >
                {isLoading ? 'Submitting Vote...' : 'Submit Vote'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 