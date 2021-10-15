import { AuthService } from '../auth.service';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '../../dtos/users/request/create-user.dto';
import { SignInUserDto } from '../../dtos/auth/request/sign-in-user.dto';
import { VerifyEmailDto } from '../../dtos/auth/request/verify-email.dto';
import { VerifyResetPasswordDto } from '../../dtos/auth/request/verify-reset-password.dto';
import { plainToClass } from 'class-transformer';
import { server } from '../../server';
import bcrypt from 'bcrypt';
import { createToken } from '../../utils/auth';

let userCreated: User;
let passwordUserCreated: string;
const prisma = new PrismaClient();
const fakeEmail = 'fake_email@ravn.co';
const fakeUuid = 'fake_uuid';
const fakeToken = 'fake_token';
const fakePassword = 'fake_password';
const password = 'password123';
const correctTokenAuth = 'correctTokenAuth';

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: hashedPassword,
      tokenVerifyEmail: 'correctTokenEmail',
      tokenChangePassword: 'correctTokenPassword',
      tokens: {
        create: [
          {
            token: correctTokenAuth,
            tokenExpiresAt: new Date(new Date().getTime() + 3600 * 1000),
          },
        ],
      },
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
      email: userCreated.email,
      password: 'password123',
    });
    await dto.isValid();

    await expect(AuthService.signUp(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with the correct credentials', async () => {
    const dto = plainToClass(CreateUserDto, {
      firstName: 'newtest',
      lastName: 'newtest',
      email: 'newtest@ravn.com',
      password: 'newpassword123',
    });
    await dto.isValid();

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
    await dto.isValid();

    await expect(AuthService.signIn(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error if the user password is wrong', async () => {
    const dto = plainToClass(SignInUserDto, {
      email: userCreated.email,
      password: fakeEmail,
    });
    await dto.isValid();

    await expect(AuthService.signIn(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with a correct credentials', async () => {
    const dto = plainToClass(SignInUserDto, {
      email: userCreated.email,
      password: passwordUserCreated,
    });
    await dto.isValid();

    await expect(AuthService.signIn(dto)).resolves.not.toThrow();
  });
});

describe('verifyEmail', () => {
  it('should throw an error with wrong credentials', async () => {
    const dto = plainToClass(VerifyEmailDto, {
      uuid: fakeUuid,
      token: fakeToken,
    });
    await dto.isValid();

    await expect(AuthService.verifyEmail(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error with a wrong token', async () => {
    const dto = plainToClass(VerifyEmailDto, {
      uuid: userCreated.uuid,
      token: 'fake_token',
    });
    await dto.isValid();

    await expect(AuthService.verifyEmail(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with a correct credentials', async () => {
    const dto = plainToClass(VerifyEmailDto, {
      uuid: userCreated.uuid,
      token: userCreated.tokenVerifyEmail,
    });
    await dto.isValid();

    await expect(AuthService.verifyEmail(dto)).resolves.not.toThrow();
  });
});

describe('verifyPasswordReset', () => {
  it('should throw an error with wrong credentials', async () => {
    const dto = plainToClass(VerifyResetPasswordDto, {
      uuid: fakeUuid,
      token: fakeToken,
      password: fakePassword,
    });
    await dto.isValid();

    await expect(AuthService.verifyPasswordReset(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with the correct credentials', async () => {
    console.log('mydfd', userCreated.tokenChangePassword);
    const dto = plainToClass(VerifyResetPasswordDto, {
      uuid: userCreated.uuid,
      token: userCreated.tokenChangePassword,
      password: 'new_password',
    });
    await dto.isValid();

    await expect(AuthService.verifyPasswordReset(dto)).resolves.not.toThrow();
  });
});

describe('passwordReset', () => {
  it('it should throw an error with a wrong email', async () => {
    await expect(AuthService.passwordReset(fakeEmail)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('it should not throw an error with a correct email', async () => {
    await expect(AuthService.passwordReset(userCreated.email)).resolves.not.toThrow();
  });
});

describe('signOut', () => {
  it('it should not throw an error with a correct bearer token', async () => {
    await expect(AuthService.signOut(`bearer ${correctTokenAuth}`)).resolves.not.toThrow();
  });
});

afterAll(async () => {
  await prisma.token.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
  server.close();
});
