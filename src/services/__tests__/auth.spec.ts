import { AuthService } from '../auth.service';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '../../dtos/users/request/create-user.dto';
import { plainToClass } from 'class-transformer';
import { server } from '../../server';

let userCreated: User;
const prisma = new PrismaClient();

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: 'password123',
    },
  });

  userCreated = user;
});

describe('SignUp', () => {
  it('should throw an error if the email is already taken', async () => {
    const userData = {
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: 'password123',
    };

    const dto = plainToClass(CreateUserDto, userData);
    await expect(AuthService.signUp(dto)).rejects.toThrowErrorMatchingSnapshot();
  });
});

afterAll(async () => {
  await prisma.user.delete({ where: { email: 'test@ravn.com' } });
  await prisma.$disconnect();
  server.close();
});
