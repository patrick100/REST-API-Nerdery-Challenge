import { Prisma, User } from '@prisma/client';
import createError from 'http-errors';
import { CreateUserDto } from '../dtos/users/request/create-user.dto';
import { SignInUserDto } from '../dtos/users/request/sign-in-user.dto';
import { prisma } from '../server';
import sgMail from '@sendgrid/mail';
import bcrypt from 'bcrypt';
import { createToken } from '../utils/auth';
import { sendEmail } from '../utils/email';
import AuthData from 'src/interfaces/authData.interface';
import { URL_BASE } from '../config';
import Email from '../interfaces/email.interface';
import crypto from 'crypto';

export class AuthService {
  static async signUp(input: CreateUserDto): Promise<User> {
    if (await prisma.user.count({ where: { email: input.email } })) {
      throw new createError.UnprocessableEntity('email already taken');
    }
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await prisma.user.create({
      data: {
        ...input,
        password: hashedPassword,
      },
    });

    const token = crypto.randomBytes(12).toString('hex');
    const emailData: Email = {
      email: user.email,
      subject: 'Confirm Email',
      body: `Send this request via POST: ${URL_BASE}/verify-email/${user.uuid}/${token}`,
    };

    console.log('SENDGRID_API_KEY: ', process.env.SENDGRID_API_KEY);

    try {
      await sendEmail(emailData);
    } catch (error) {
      console.error(error);
    }

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
}
