import { UpdateCommentDto } from './../dtos/comments/request/update-comment.dto';
import { CreateCommentDto } from './../dtos/comments/request/create-comment.dto';
import RequestWithUserId from 'src/interfaces/request-with-user-id.interface';
import { convertToJson, responseApi, responseApiArray } from './../utils/serializer';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { CommentDto } from '../dtos/comments/response/comment.dto';
import { CommentsService } from './../services/comments.service';

export async function find(req: Request, res: Response): Promise<void> {
  const comments = await CommentsService.find(+req.params.postId);
  const jsonResponse = convertToJson(plainToClass(CommentDto, comments));

  res.status(200).json(responseApiArray(jsonResponse));
}

export async function create(request: Request, res: Response): Promise<void> {
  const req = request as RequestWithUserId;
  const dto = plainToClass(CreateCommentDto, req.body);
  await dto.isValid();

  const comment = await CommentsService.create(+req.userId, +req.params.postId, dto);
  const jsonResponse = convertToJson(plainToClass(CommentDto, comment));

  res.status(200).json(responseApi(jsonResponse));
}

export async function update(request: Request, res: Response): Promise<void> {
  const req = request as RequestWithUserId;
  const dto = plainToClass(UpdateCommentDto, req.body);
  await dto.isValid();

  const comment = await CommentsService.update(+req.userId, +req.params.id, dto);
  const jsonResponse = convertToJson(plainToClass(UpdateCommentDto, comment));

  res.status(200).json(responseApi(jsonResponse));
}

export async function deleteComment(request: Request, res: Response): Promise<void> {
  const req = request as RequestWithUserId;
  const deletedComment = await CommentsService.delete(+req.userId, +req.params.id);
  const jsonResponse = convertToJson(plainToClass(CommentDto, deletedComment));

  res.status(200).json(responseApi(jsonResponse));
}

export async function deleteCommentByMod(req: Request, res: Response): Promise<void> {
  const deletedComment = await CommentsService.deleteByMod(+req.params.id);
  const jsonResponse = convertToJson(plainToClass(CommentDto, deletedComment));

  res.status(200).json(responseApi(jsonResponse));
}
