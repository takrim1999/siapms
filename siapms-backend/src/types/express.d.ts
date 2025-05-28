import { IUser } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;  // Make it optional since it might not be present in all routes
    }
  }
} 