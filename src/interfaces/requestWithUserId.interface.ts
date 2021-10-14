import { Request } from 'express';

interface RequestWithUserId extends Request {
  userId: number;
}

export default RequestWithUserId;
