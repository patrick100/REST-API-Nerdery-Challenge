import { PostsService } from './../services/posts.service';
import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { PostDto } from '../dtos/posts/response/post.dto';

export async function find(req: Request, res: Response): Promise<void> {
  const posts = await PostsService.find();

  res.status(200).json(plainToClass(PostDto, posts));
}

export async function create(req: Request, res: Response): Promise<void> {
  // res.status(201).json(req.body);
  console.log(req.body);
  // PostsService.create(req.body);

  // res.status(201).json(plainToClass(PostDto, post));
}

export async function findOne(req: Request, res: Response): Promise<void> {
  const post = await PostsService.findOne(req.params.uuid);
  res.status(200).json(plainToClass(PostDto, post));
}

export async function findUserPosts(req: Request, res: Response): Promise<void> {
  const posts = await PostsService.findUserPosts(req.params.accountUuid);

  res.status(200).json(plainToClass(PostDto, posts));
}

export async function findMyPosts(req: Request, res: Response): Promise<void> {
  console.log('my posts');
  const uuid = req.headers.authorization?.split(' ')[1];

  if (uuid) {
    const posts = await PostsService.findUserPosts(uuid);
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  console.log('update post!');
  // console.log(req);
  // const post = await PostsService.update(req.params.uuid, req.body);
  // res.status(200).json(plainToClass(PostDto, post));
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  const uuid = req.params.uuid;

  const deletedPost = await PostsService.delete(uuid);

  res.status(200).json(plainToClass(PostDto, deletedPost));
}
