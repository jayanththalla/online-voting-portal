import mongoose from 'mongoose';
import type { ICandidate } from '../types/index.js';

const candidateSchema = new mongoose.Schema<ICandidate>({
  name: { type: String, required: true },
  party: { type: String, required: true },
  photo: { type: String, required: true },
  description: { type: String, required: true },
  voteCount: { type: Number, default: 0 },
}, {
  timestamps: true
});

export const Candidate = mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', candidateSchema); 