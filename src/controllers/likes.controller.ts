import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { LikesService } from '../services/likes.service';
import { CreateLikeDto } from '../dtos/likes/request/create-like.dto';
import RequestWithUserId from '../interfaces/request-with-user-id.interface';

export async function giveLikePost(expressRequest: Request, res: Response): Promise<void> {
  const req = expressRequest as RequestWithUserId;
  const dto = plainToClass(CreateLikeDto, {
    isLike: req.body.isLike,
    resourceId: +req.params.postId,
    userId: req.userId,
    type: 'POST',
  });
  await dto.isValid();
  await LikesService.giveLike(dto);

  res.status(204).send();
}

export async function giveLikeComment(expressRequest: Request, res: Response): Promise<void> {
  const req = expressRequest as RequestWithUserId;
  const dto = plainToClass(CreateLikeDto, {
    isLike: req.body.isLike,
    resourceId: +req.params.commentId,
    userId: req.userId,
    type: 'COMMENT',
  });
  await dto.isValid();
  await LikesService.giveLike(dto);

  res.status(204).send();
}

export async function removeLikePost(expressRequest: Request, res: Response): Promise<void> {
  const req = expressRequest as RequestWithUserId;
  const dto = plainToClass(CreateLikeDto, {
    isLike: req.body.isLike,
    resourceId: +req.params.postId,
    userId: req.userId,
    type: 'POST',
  });
  await dto.isValid();
  await LikesService.removeLike(dto);

  res.status(204).send();
}

export async function removeLikeComment(expressRequest: Request, res: Response): Promise<void> {
  const req = expressRequest as RequestWithUserId;
  const dto = plainToClass(CreateLikeDto, {
    isLike: req.body.isLike,
    resourceId: +req.params.commentId,
    userId: req.userId,
    type: 'COMMENT',
  });
  await dto.isValid();
  await LikesService.removeLike(dto);

  res.status(204).send();
}
