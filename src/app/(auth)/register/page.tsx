'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWebcam } from '@/hooks/useWebcam'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { voterRegistrationSchema } from '@/utils/validation'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Camera, RefreshCw, Upload, ChevronRight, ChevronLeft, User, Mail, Phone, FileText, CheckCircle2, Copy, Loader2, Eye, EyeOff, Shield, Info, X } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import Webcam from 'react-webcam'

type RegistrationForm = z.infer<typeof voterRegistrationSchema>

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Contact Details', icon: Mail },
  { id: 3, title: 'ID Verification', icon: FileText },
  { id: 4, title: 'Photo Capture', icon: Camera }
]

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { webcamRef, imgSrc, capture, retake, videoConstraints, isClient, WebcamComponent } = useWebcam()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationForm>({
    name: '',
    email: '',
    phoneNumber: '',
    registrationPhoto: '',
    idDocument: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [registeredVoterId, setRegisteredVoterId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showIdPreview, setShowIdPreview] = useState(false)
  const [registrationTime, setRegistrationTime] = useState<string>('')
  const [jwtToken, setJwtToken] = useState<string>('')
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({})
  const [isCopied, setIsCopied] = useState(false)

  // Validate current step before proceeding
  const validateCurrentStep = () => {
    const currentFields = getFieldsForStep(currentStep);
    const currentData = { ...formData };
    
    // Create a partial schema for the current step
    const partialSchema = z.object(
      Object.fromEntries(
        currentFields.map(field => [field, voterRegistrationSchema.shape[field as keyof RegistrationForm]])
      )
    );
    
    const result = partialSchema.safeParse(currentData);
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path) {
          formattedErrors[err.path[0]] = err.message;
        }
      });
      setValidationErrors(formattedErrors);
      
      // Show toast with error message
      toast({
        title: "Validation Failed",
        description: "Please check the form for errors",
        variant: "destructive",
      });
      
      return false;
    }
    
    return true;
  };

  // Get fields for the current step
  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['name'];
      case 2:
        return ['email', 'phoneNumber'];
      case 3:
        return ['idDocument'];
      case 4:
        return ['registrationPhoto'];
      default:
        return [];
    }
  };

  // Validate a single field
  const validateField = (field: keyof RegistrationForm, value: string) => {
    const fieldSchema = voterRegistrationSchema.shape[field];
    const result = fieldSchema.safeParse(value);
    
    if (!result.success) {
      return result.error.errors[0].message;
    }
    
    return '';
  };

  // Handle field change with validation
  const handleFieldChange = (field: keyof RegistrationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setFieldTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field
    const error = validateField(field, value);
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Current step:', currentStep);
    console.log('Form data before submission:', formData);
    console.log('Button state - isLoading:', isLoading, 'isSubmitting:', isSubmitting);

    setError('');
    setValidationErrors({});
    setIsLoading(true);
    setIsSubmitting(true);
    
    try {
      // Log form data for debugging
      console.log('Validating form data...');
      const validationResult = voterRegistrationSchema.safeParse(formData);

      if (!validationResult.success) {
        console.log('Validation failed:', validationResult.error.errors);
        const formattedErrors: Record<string, string> = {};
        validationResult.error.errors.forEach(err => {
          if (err.path) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setValidationErrors(formattedErrors);
        toast({
          title: "Validation Failed",
          description: "Please check the form for errors",
          variant: "destructive",
        });
        console.log('Validation errors:', formattedErrors);
        setIsLoading(false);
        setIsSubmitting(false);
        return;
      }

      const validatedData = validationResult.data;
      console.log('Validation successful. Sending data to server...');

      console.log('Making API request to /api/auth/register');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      console.log('Registration successful');
      toast({
        title: "Registration Successful",
        description: "Your voter registration has been completed.",
      });

      setRegisteredVoterId(data.voterId);
      setJwtToken(data.token);
      setRegistrationTime(new Date().toLocaleString());
      setShowSuccessModal(true);
      
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleCapture = () => {
    const photo = capture();
    if (photo) {
      console.log('Photo captured:', photo);
      setFormData(prev => {
        const newData = { ...prev, registrationPhoto: photo };
        console.log('Updated form data:', newData);
        return newData;
      });
      if (validationErrors.registrationPhoto) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.registrationPhoto;
          return newErrors;
        });
      }
    } else {
      console.log('Failed to capture photo');
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        // Validate file type
        const mimeType = result.split(';')[0].split(':')[1]
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
        
        if (!validTypes.includes(mimeType)) {
          toast({
            title: "Invalid file type",
            description: "Please upload a JPEG, PNG, or PDF file",
            variant: "destructive",
          })
          return
        }

        setFormData(prev => ({ ...prev, idDocument: result }))
        if (validationErrors.idDocument) {
          setValidationErrors(prev => {
            const newErrors = { ...prev }
            delete newErrors.idDocument
            return newErrors
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const copyVoterId = async () => {
    try {
      // Try using the modern clipboard API
      await navigator.clipboard.writeText(registeredVoterId);
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Voter ID copied to clipboard",
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy using clipboard API:', err);
      
      // Fallback: Create a temporary input element
      const tempInput = document.createElement('input');
      tempInput.value = registeredVoterId;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      setIsCopied(true);
      toast({
        title: "Copied!",
        description: "Voter ID copied to clipboard",
      });
      // Reset the copied state after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    }
  }

  const handleContinue = () => {
    if (jwtToken) {
      router.push(`/vote?token=${encodeURIComponent(jwtToken)}`);
    } else {
      toast({
        title: "Error",
        description: "No authentication token available. Please try registering again.",
        variant: "destructive",
      });
    }
  }

  const nextStep = () => {
    // Validate current step before proceeding
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(prev => prev + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                onBlur={() => setFieldTouched(prev => ({ ...prev, name: true }))}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
                className={validationErrors.name ? "border-destructive" : ""}
              />
              {fieldTouched.name && validationErrors.name && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.name}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Please enter your full name (first and last name)
              </p>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                onBlur={() => setFieldTouched(prev => ({ ...prev, email: true }))}
                placeholder="Enter your email address"
                required
                disabled={isLoading}
                className={validationErrors.email ? "border-destructive" : ""}
              />
              {fieldTouched.email && validationErrors.email && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                onBlur={() => setFieldTouched(prev => ({ ...prev, phoneNumber: true }))}
                placeholder="Enter your phone number (e.g., +1234567890)"
                required
                disabled={isLoading}
                className={validationErrors.phoneNumber ? "border-destructive" : ""}
              />
              {fieldTouched.phoneNumber && validationErrors.phoneNumber && (
                <p className="text-sm text-destructive flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.phoneNumber}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Include country code (e.g., +1 for US)
              </p>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="idDocument">Upload ID Document</Label>
              <div className="mt-2">
                {formData.idDocument ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 mr-3 text-primary" />
                        <div>
                          <p className="font-medium">ID Document Uploaded</p>
                          <p className="text-xs text-muted-foreground">
                            {formData.idDocument.startsWith('data:application/pdf') 
                              ? 'PDF Document' 
                              : 'Image Document'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setFormData(prev => ({ ...prev, idDocument: '' }))}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                    
                    {formData.idDocument.startsWith('data:image/') && (
                      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
                        <img
                          src={formData.idDocument}
                          alt="ID Document preview"
                          className="object-cover w-full h-full"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => setShowIdPreview(!showIdPreview)}
                        >
                          {showIdPreview ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: JPG, PNG, PDF (max. 5MB)
                        </p>
                      </div>
                      <input
                        id="idDocument"
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                )}
              </div>
              {fieldTouched.idDocument && validationErrors.idDocument && (
                <p className="text-sm text-destructive flex items-center mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.idDocument}
                </p>
              )}
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Take Photo</Label>
              <div className="relative">
                {!imgSrc ? (
                  <>
                    {isClient && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                        <Webcam
                          audio={false}
                          screenshotFormat="image/jpeg"
                          videoConstraints={videoConstraints}
                          className="h-full w-full object-cover"
                          ref={webcamRef}
                        />
                      </div>
                    )}
                    <Button
                      type="button"
                      onClick={() => {
                        console.log('Capture button clicked');
                        handleCapture();
                        console.log('After capture - imgSrc:', imgSrc);
                        console.log('After capture - formData:', formData);
                      }}
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
              {fieldTouched.registrationPhoto && validationErrors.registrationPhoto && (
                <p className="text-sm text-destructive flex items-center mt-2">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {validationErrors.registrationPhoto}
                </p>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderIdPreview = () => {
    if (!formData.idDocument) return null;
    
    const mimeType = formData.idDocument.split(';')[0].split(':')[1];
    
    if (mimeType === 'application/pdf') {
      return (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            PDF document uploaded successfully
          </p>
        </div>
      );
    }
    
    return (
      <div className="mt-4 relative">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-lg border">
          <img
            src={formData.idDocument}
            alt="ID Document preview"
            className="object-cover"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={() => setShowIdPreview(!showIdPreview)}
        >
          {showIdPreview ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <AnimatePresence mode="wait">
        {showSuccessModal ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Registration Successful!</CardTitle>
                <CardDescription className="text-center">
                  Your voter registration has been completed successfully.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Your Voter ID:</p>
                  <div className="flex items-center justify-between bg-background rounded-md p-3">
                    <code className="text-lg font-mono">{registeredVoterId}</code>
                    <Button
                      variant={isCopied ? "default" : "outline"}
                      size="sm"
                      onClick={copyVoterId}
                      className="ml-2 flex items-center gap-1"
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 mr-2" />
                    <span>Registration Time: {registrationTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Info className="w-4 h-4 mr-2" />
                    <span>Verification Status: Pending</span>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important Information</AlertTitle>
                  <AlertDescription className="space-y-2">
                    <p>Please save your Voter ID securely. You'll need it to:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Log in to your voter account</li>
                      <li>Cast your vote during elections</li>
                      <li>Track your voting status</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-medium">Next Steps:</h4>
                  <ol className="list-decimal pl-4 space-y-1 text-sm text-muted-foreground">
                    <li>Check your email for verification instructions</li>
                    <li>Complete identity verification if required</li>
                    <li>Update your profile with additional information</li>
                  </ol>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button onClick={handleContinue} className="w-full">
                  Continue to Voting Page
                </Button>
                <Button variant="outline" onClick={() => router.push('/')} className="w-full">
                  Return to Home
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl"
          >
            <Card className="border-none shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Voter Registration</CardTitle>
                <CardDescription className="text-center">
                  Register to participate in the online voting system
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

                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    {steps.map((step) => (
                      <div
                        key={step.id}
                        className={`flex flex-col items-center ${
                          currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                            currentStep >= step.id ? 'bg-primary text-white' : 'bg-muted'
                          }`}
                        >
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs text-center">{step.title}</span>
                      </div>
                    ))}
                  </div>
                  <Progress value={(currentStep / steps.length) * 100} className="h-2" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderStepContent()}

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1 || isLoading}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    
                    {currentStep === steps.length ? (
                      <Button 
                        type="submit" 
                        disabled={isLoading || !formData.registrationPhoto || !formData.idDocument}
                        className="min-w-[150px]"
                        onClick={(e) => {
                          console.log('Submit button clicked');
                          console.log('Form data at submission:', formData);
                          console.log('Photo exists:', !!formData.registrationPhoto);
                          console.log('ID exists:', !!formData.idDocument);
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registering...
                          </>
                        ) : (
                          'Complete Registration'
                        )}
                      </Button>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={nextStep} 
                        disabled={isLoading}
                        className="min-w-[100px]"
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center justify-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already registered? <a href="/login" className="text-primary hover:underline">Login here</a>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 