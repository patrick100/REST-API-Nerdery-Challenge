import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { CommentDto } from '../dtos/comments/response/comment.dto';
import { CommentsService } from './../services/comments.service';

export async function find(req: Request, res: Response): Promise<void> {
  console.log('find controller');
  let comments;
  try {
    comments = await CommentsService.find(req.params.postuuid);
  } catch (error) {
    console.log(error);
  }

  res.status(200).json(plainToClass(CommentDto, comments));
}

export async function create(req: Request, res: Response): Promise<void> {
  console.log('new comment');
}

export async function update(req: Request, res: Response): Promise<void> {
  console.log('update comment');
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
  console.log('delete comment');
}
