import { AuthService } from '../auth.service';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '../../dtos/users/request/create-user.dto';
import { SignInUserDto } from '../../dtos/auth/request/sign-in-user.dto';
import { VerifyEmailDto } from '../../dtos/auth/request/verify-email.dto';
import { plainToClass } from 'class-transformer';
import { server } from '../../server';
import bcrypt from 'bcrypt';

let userCreated: User;
let passwordUserCreated: string;
const prisma = new PrismaClient();

beforeAll(async () => {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: hashedPassword,
      tokenVerifyEmail: 'correctTokenEmail',
    },
  });
  passwordUserCreated = password;
  userCreated = user;
});

describe('signUp', () => {
  it('should throw an error if the fields are invalid', async () => {
    const dto = plainToClass(CreateUserDto, {
      firstName: 'test',
      lastName: 'test',
      email: '',
      password: '123',
    });

    expect(dto.isValid()).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if the email is already taken', async () => {
    const dto = plainToClass(CreateUserDto, {
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: 'password123',
    });
    dto.isValid();

    await expect(AuthService.signUp(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with the correct credentials', async () => {
    const dto = plainToClass(CreateUserDto, {
      firstName: 'newtest',
      lastName: 'newtest',
      email: 'newtest@ravn.com',
      password: 'newpassword123',
    });
    dto.isValid();

    await expect(AuthService.signUp(dto)).resolves.not.toThrow();
  });
});

describe('signIn', () => {
  it('should throw an error if the fields are invalid', async () => {
    const dto = plainToClass(SignInUserDto, {
      email: '',
      password: '123',
    });

    expect(dto.isValid()).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if the user email does not exist', async () => {
    const dto = plainToClass(SignInUserDto, {
      email: 'test2@ravn.com',
      password: 'password123',
    });
    dto.isValid();

    await expect(AuthService.signIn(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if the user password is wrong', async () => {
    const dto = plainToClass(SignInUserDto, {
      email: userCreated.email,
      password: 'fakepassword',
    });
    dto.isValid();

    await expect(AuthService.signIn(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with a correct credentials', async () => {
    const dto = plainToClass(SignInUserDto, {
      email: userCreated.email,
      password: passwordUserCreated,
    });
    dto.isValid();

    await expect(AuthService.signIn(dto)).resolves.not.toThrow();
  });
});

describe('verifyEmail', () => {
  it('should throw an error with wrong credentials', async () => {
    const dto = plainToClass(VerifyEmailDto, {
      uuid: 'fake_uuid',
      token: 'fake_token',
    });
    dto.isValid();

    await expect(AuthService.verifyEmail(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error with a wrong token', async () => {
    const dto = plainToClass(VerifyEmailDto, {
      uuid: userCreated.uuid,
      token: 'fake_token',
    });
    dto.isValid();

    await expect(AuthService.verifyEmail(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with a correct credentials', async () => {
    const dto = plainToClass(VerifyEmailDto, {
      uuid: userCreated.uuid,
      token: userCreated.tokenVerifyEmail,
    });
    dto.isValid();

    await expect(AuthService.verifyEmail(dto)).resolves.not.toThrow();
  });
});

afterAll(async () => {
  await prisma.token.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
  server.close();
});
