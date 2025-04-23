import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_DOCUMENT_TYPES = [...ACCEPTED_IMAGE_TYPES, 'application/pdf'];

export const voterRegistrationSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces')
    .refine((val) => val.trim().includes(' '), 'Please enter your full name'),
  
  email: z.string()
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters')
    .email('Invalid email address')
    .refine((val) => val.includes('.'), 'Please enter a valid email domain')
    .refine((val) => !val.endsWith('.'), 'Email cannot end with a dot')
    .transform(val => val.toLowerCase()),
  
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{9,14}$/, 'Phone number must be between 10 and 15 digits')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .refine((val) => !val.includes(' '), 'Phone number cannot contain spaces'),
  
  registrationPhoto: z.string()
    .min(1, 'Registration photo is required')
    .refine(
      (val) => val.startsWith('data:image/'),
      'Photo must be a valid image'
    )
    .refine(
      (val) => {
        const base64Size = (val.length * 3) / 4;
        return base64Size < MAX_FILE_SIZE;
      },
      'Photo size must be less than 5MB'
    )
    .refine(
      (val) => {
        const mimeType = val.split(';')[0].split(':')[1];
        return ACCEPTED_IMAGE_TYPES.includes(mimeType);
      },
      'Photo must be in JPEG, JPG, PNG, or WebP format'
    ),
  
  idDocument: z.string()
    .min(1, 'ID document is required')
    .refine(
      (val) => val.startsWith('data:') && 
        (val.startsWith('data:image/') || val.startsWith('data:application/pdf')),
      'Document must be an image or PDF'
    )
    .refine(
      (val) => {
        const base64Size = (val.length * 3) / 4;
        return base64Size < MAX_FILE_SIZE;
      },
      'Document size must be less than 5MB'
    )
    .refine(
      (val) => {
        const mimeType = val.split(';')[0].split(':')[1];
        return ACCEPTED_DOCUMENT_TYPES.includes(mimeType);
      },
      'Document must be in JPEG, JPG, PNG, WebP, or PDF format'
    ),
});

export const voterLoginSchema = z.object({
  voterId: z.string().min(1, 'Voter ID is required'),
});

export const voteSubmissionSchema = z.object({
  candidateId: z.string().min(1, 'Candidate ID is required'),
  votingPhoto: z.string().min(1, 'Voting photo is required'),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const candidateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  party: z.string().min(1, 'Party is required'),
  photo: z.string().min(1, 'Photo is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
}); 