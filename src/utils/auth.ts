import { JWT_SECRET, JWT_EXPIRES } from '../config';
import { prisma } from '../server';
import jwt from 'jsonwebtoken';

export const createToken = async (userId: number): Promise<string> => {
  const token = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });

  await prisma.token.create({
    data: {
      token: token,
      userId: userId,
      tokenExpiresAt: new Date(new Date().getTime() + parseInt(JWT_EXPIRES) * 1000),
    },
  });

  return token;
};
