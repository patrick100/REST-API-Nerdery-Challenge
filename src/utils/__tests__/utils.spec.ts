import { server } from '../../server';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import Email from '../../interfaces/email.interface';
import { createToken } from '../auth';
import { sendEmail } from '../email';

const prisma = new PrismaClient();
const password = 'password123';
let userCreated1: User;
let userCreated2: User;

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user1 = await prisma.user.create({
    data: {
      id: 1,
      firstName: 'test1',
      lastName: 'test1',
      email: 'test1@ravn.com',
      password: hashedPassword,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      id: 2,
      firstName: 'test2',
      lastName: 'test2',
      email: 'test2@ravn.com',
      password: hashedPassword,
    },
  });
  userCreated1 = user1;
  userCreated2 = user2;
});

beforeEach(async () => {
  await prisma.token.deleteMany({});
});

describe('createToken', () => {
  it('should return a different token if it is called in a second later', async () => {
    const token1 = await createToken(userCreated1.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const token2 = await createToken(userCreated1.id);

    expect(token1).not.toEqual(token2);
  });

  it('should return a different token if it is called with other usedId', async () => {
    const token1 = await createToken(userCreated1.id);
    const token2 = await createToken(userCreated2.id);

    expect(token1).not.toEqual(token2);
  });

  it('should throw an error with an invalid usedId', async () => {
    const invalidUserId = 100;
    await expect(createToken(invalidUserId)).rejects.toThrowErrorMatchingSnapshot();
  });
});

afterAll(async () => {
  await prisma.token.deleteMany({});
  await prisma.user.deleteMany({});
  server.close();
});
