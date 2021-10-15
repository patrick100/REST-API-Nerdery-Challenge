import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users/request/create-user.dto';
import { SignInUserDto } from '../dtos/auth/request/sign-in-user.dto';
import { VerifyEmailDto } from '../dtos/auth/request/verify-email.dto';
import { VerifyResetPasswordDto } from '../dtos/auth/request/verify-reset-password.dto';
import { UserDto } from '../dtos/users/response/user.dto';
import { AuthService } from '../services/auth.service';

export async function signOut(req: Request, res: Response): Promise<void> {
  await AuthService.signOut(req.headers['authorization']!);

  res.status(204).send();
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  const dto = plainToClass(VerifyEmailDto, { uuid: req.params.uuid, token: req.params.token });
  await dto.isValid();

  await AuthService.verifyEmail(dto);

  res.status(204).send();
}

export async function passwordReset(req: Request, res: Response): Promise<void> {
  await AuthService.passwordReset(req.body.email);

  res.status(204).send();
}

export async function verifyPasswordReset(req: Request, res: Response): Promise<void> {
  const dto = plainToClass(VerifyResetPasswordDto, {
    uuid: req.params.uuid,
    token: req.params.token,
    password: req.body.password,
  });
  await dto.isValid();

  await AuthService.verifyPasswordReset(dto);

  res.status(204).send();
}

export async function signUp(req: Request, res: Response): Promise<void> {
  const dto = plainToClass(CreateUserDto, req.body);
  await dto.isValid();

  const user = await AuthService.signUp(dto);

  res.status(201).json({ data: plainToClass(UserDto, user) });
}

export async function signIn(req: Request, res: Response): Promise<void> {
  const dto = plainToClass(SignInUserDto, req.body);
  await dto.isValid();

  const authData = await AuthService.signIn(dto);
  const response = {
    data: {
      user: plainToClass(UserDto, authData.user),
      token: authData.token,
    },
  };

  res.status(200).json(response);
}
