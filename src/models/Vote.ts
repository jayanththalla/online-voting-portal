import mongoose from 'mongoose';
import { IVote } from '@/types';

const voteSchema = new mongoose.Schema<IVote>({
  voterId: { type: String, required: true, unique: true },
  candidateId: { type: String, required: true },
  votingPhoto: { type: String, required: true },
}, {
  timestamps: true
});

export const Vote = mongoose.models.Vote || mongoose.model<IVote>('Vote', voteSchema); 