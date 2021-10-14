import { User } from '@prisma/client';
import createError from 'http-errors';
import { CreateUserDto } from '../dtos/users/request/create-user.dto';
import { SignInUserDto } from '../dtos/users/request/sign-in-user.dto';
import { VerifyEmailDto } from '../dtos/users/request/verify-email.dto';
import { VerifyResetPasswordDto } from '../dtos/users/request/verify-reset-password.dto';
import { prisma } from '../server';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/auth';
import { sendEmail } from '../utils/email';
import AuthData from 'src/interfaces/authData.interface';
import { URL_BASE } from '../config';
import Email from '../interfaces/email.interface';
import crypto from 'crypto';
import { UsersService } from '../services/users.service';

export class AuthService {
  static async passwordReset(email: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user) throw createError(404, 'Not Found User');

    const tokenResetPassword = crypto.randomBytes(12).toString('hex');
    const emailData: Email = {
      email: user.email,
      subject: 'Reset Password',
      body: `Send this request via POST: ${URL_BASE}/password-reset/${user.uuid}/${tokenResetPassword} 
      with the password in the body example: {password:newpassword}`,
    };

    sendEmail(emailData);

    await prisma.user.update({
      where: { id: user.id },
      data: { tokenChangePassword: tokenResetPassword },
    });
  }

  static async verifyEmail(input: VerifyEmailDto): Promise<void> {
    const user = await UsersService.findOne(input.uuid);

    if (!user) throw createError(401, 'Wrong credentials provided');

    if (user.tokenVerifyEmail === input.token) {
      await prisma.user.update({
        where: { uuid: input.uuid },
        data: { isEmailVerified: true, emailVerifiedAt: new Date() },
      });
    } else {
      throw createError(401, 'Wrong credentials provided');
    }
  }

  static async verifyPasswordReset(input: VerifyResetPasswordDto): Promise<void> {
    const user = await UsersService.findOne(input.uuid);

    if (!user) throw createError(401, 'Wrong credentials provided');

    if (user.tokenChangePassword === input.token) {
      const hashedPassword = await bcrypt.hash(input.password, 10);
      await prisma.user.update({
        where: { uuid: input.uuid },
        data: { password: hashedPassword },
      });
    } else {
      throw createError(401, 'Wrong credentials provided');
    }
  }

  static async signUp(input: CreateUserDto): Promise<User> {
    if (await prisma.user.count({ where: { email: input.email } })) {
      throw new createError.UnprocessableEntity('email already taken');
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const tokenVerifyEmail = crypto.randomBytes(12).toString('hex');
    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
        tokenVerifyEmail: tokenVerifyEmail,
      },
    });

    const emailData: Email = {
      email: user.email,
      subject: 'Confirm Email',
      body: `Send this request via PATCH: ${URL_BASE}/verify-email/${user.uuid}/${tokenVerifyEmail}`,
    };
    sendEmail(emailData);

    return user;
  }

  static async signIn(input: SignInUserDto): Promise<AuthData> {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) throw createError(401, 'Wrong credentials provided');
    const isPasswordMatching = bcrypt.compare(input.password, user.password);

    if (!isPasswordMatching) throw createError(401, 'Wrong credentials provided');
    const token = await createToken(user.id);

    return { user, token };
  }

  static async signOut(bearerHeader: string): Promise<void> {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];

    await prisma.token.delete({
      where: {
        token: bearerToken,
      },
    });
  }
}
