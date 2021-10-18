import { JWT_SECRET } from '../config';
import { prisma } from '../server';
import jwt from 'jsonwebtoken';

export const createToken = async (userId: number): Promise<string> => {
  const expiresTime = 60 * 60;
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: expiresTime,
  });

  await prisma.token.create({
    data: {
      token: token,
      userId: userId,
      tokenExpiresAt: new Date(new Date().getTime() + expiresTime * 1000),
    },
  });

  return token;
};
