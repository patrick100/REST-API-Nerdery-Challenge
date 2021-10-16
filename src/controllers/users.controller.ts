import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { UpdatePublicInfoUserDto } from '../dtos/users/request/update-public-info-user.dto';
import { UserDto } from '../dtos/users/response/user.dto';
import { UsersService } from '../services/users.service';
import RequestWithUserId from '../interfaces/requestWithUserId.interface';

export async function findOne(req: Request, res: Response): Promise<void> {
  const user = await UsersService.findOne(req.params.uuid);

  res.status(200).json(plainToClass(UserDto, user));
}

export async function me(expressRequest: Request, res: Response): Promise<void> {
  const request = expressRequest as RequestWithUserId;
  const user = await UsersService.me(request.userId);

  res.status(200).json(plainToClass(UserDto, user));
}

export async function updatePublicInfo(expressRequest: Request, res: Response): Promise<void> {
  const dto = plainToClass(UpdatePublicInfoUserDto, expressRequest.body);
  await dto.isValid();

  const request = expressRequest as RequestWithUserId;
  const user = await UsersService.updatePublicInfo(request.userId, dto);

  res.status(200).json(plainToClass(UserDto, user));
}
