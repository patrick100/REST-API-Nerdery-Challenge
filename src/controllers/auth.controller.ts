import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { CreateUserDto } from '../dtos/users/request/create-user.dto';
import { SignInUserDto } from '../dtos/users/request/sign-in-user.dto';
import { UserDto } from '../dtos/users/response/user.dto';
import { AuthService } from '../services/auth.service';

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
