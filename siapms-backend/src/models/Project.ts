import mongoose, { Document } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  title: string;
  description: string;
  coverPhoto?: string;
  screenshots: string[];
  githubLink?: string;
  liveLink?: string;
  isPublic: boolean;
  author: IUser;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverPhoto: {
    type: String,
    required: false
  },
  screenshots: [{
    type: String
  }],
  githubLink: {
    type: String,
    trim: true
  },
  liveLink: {
    type: String,
    trim: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project; 