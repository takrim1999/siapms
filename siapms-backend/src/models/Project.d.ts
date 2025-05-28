import { Document } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  title: string;
  description: string;
  author: IUser;
  coverPhoto?: string;
  screenshots?: string[];
  githubLink?: string;
  liveLink?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
} 