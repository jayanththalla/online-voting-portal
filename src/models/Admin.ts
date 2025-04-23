import mongoose from 'mongoose';
import { IAdmin } from '@/types';

const adminSchema = new mongoose.Schema<IAdmin>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true
});

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema); 