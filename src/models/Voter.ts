import mongoose from 'mongoose';
import { IVoter } from '@/types';

const voterSchema = new mongoose.Schema<IVoter>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  voterId: { type: String, required: true, unique: true },
  registrationPhoto: { type: String, required: true },
  idDocument: { type: String, required: true },
  hasVoted: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Voter = mongoose.models.Voter || mongoose.model<IVoter>('Voter', voterSchema); 