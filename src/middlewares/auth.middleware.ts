import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import RequestWithUserId from '../interfaces/request-with-user-id.interface';
import { JWT_SECRET } from '../config';
import createError from 'http-errors';
import DataStoredInToken from '../interfaces/data-stored-in-token.interface';
import { prisma } from '../server';

export const verifyToken = async (
  expressRequest: Request,
  response: Response,
  next: NextFunction
) => {
  const request = expressRequest as RequestWithUserId;
  const bearerHeader = request.headers['authorization']!;

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    try {
      const decoded = jwt.verify(bearerToken, JWT_SECRET) as DataStoredInToken;
      const tokenDatabase = await prisma.token.findUnique({ where: { token: bearerToken } });

      if (!tokenDatabase) {
        next(createError(401, 'Wrong authentication token'));
      }
      if (tokenDatabase.userId !== decoded.id) {
        next(createError(401, 'Wrong authentication token'));
      }

      request.userId = decoded.id;
      next();
    } catch (error) {
      console.error(error);
      next(createError(401, 'Wrong authentication token'));
    }
  } else {
    next(createError(401, 'Authentication token missing'));
  }
};

export const verifyModerator = async (
  expressRequest: Request,
  response: Response,
  next: NextFunction
) => {
  const request = expressRequest as RequestWithUserId;
  const user = await prisma.user.findUnique({ where: { id: request.userId } });
  if (user.isModerator) {
    next();
  } else {
    next(createError(403, 'You are not authorized'));
  }
};
