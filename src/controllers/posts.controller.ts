import { convertToJson, responseApi, responseApiArray } from './../utils/serializer';
import { PostsService } from './../services/posts.service';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { PostDto } from '../dtos/posts/response/post.dto';
import RequestWithUserId from 'src/interfaces/request-with-user-id.interface';
import { CreatePostDto } from './../dtos/posts/request/create-post.dto';
import { UpdatePostDto } from './../dtos/posts/request/update-post.dto';

export async function find(req: Request, res: Response): Promise<void> {
  const posts = await PostsService.find();
  const jsonResponse = convertToJson(plainToClass(PostDto, posts));

  res.status(200).json(responseApiArray(jsonResponse));
}

export async function create(request: Request, res: Response): Promise<void> {
  const req = request as RequestWithUserId;
  const dto = plainToClass(CreatePostDto, req.body);
  await dto.isValid();

  const post = await PostsService.create(req.userId, dto);

  res.status(201).json(plainToClass(PostDto, post));
}

export async function findOne(req: Request, res: Response): Promise<void> {
  const post = await PostsService.findOne(+req.params.id);
  const jsonResponse = convertToJson(plainToClass(PostDto, post));

  res.status(200).json(responseApi(jsonResponse));
}

export async function findMyPosts(request: Request, res: Response): Promise<void> {
  const req = request as RequestWithUserId;
  const posts = await PostsService.findUserPosts(req.userId);
  const jsonResponse = convertToJson(plainToClass(PostDto, posts));

  res.status(200).json(responseApiArray(jsonResponse));
}

export async function findUserPosts(req: Request, res: Response): Promise<void> {
  const posts = await PostsService.findUserPosts(+req.params.accountId);
  const jsonResponse = convertToJson(plainToClass(PostDto, posts));

  res.status(200).json(responseApiArray(jsonResponse));
}

export async function update(request: Request, res: Response): Promise<void> {
  const req = request as RequestWithUserId;
  const dto = plainToClass(UpdatePostDto, req.body);
  await dto.isValid();

  const post = await PostsService.update(req.userId, +request.params.id, request.body);
  const jsonResponse = convertToJson(plainToClass(PostDto, post));

  res.status(200).json(responseApi(jsonResponse));
}

export async function deleteMyPost(request: Request, res: Response): Promise<void> {
  const req = request as RequestWithUserId;
  const deletedPost = await PostsService.delete(req.userId, +req.params.id);
  const jsonResponse = convertToJson(plainToClass(PostDto, deletedPost));

  res.status(200).json(responseApi(jsonResponse));
}

export async function deletePostByMod(req: Request, res: Response): Promise<void> {
  const deletedPost = await PostsService.deleteByMod(+req.params.id);

  res.status(200).json(plainToClass(PostDto, deletedPost));
}
