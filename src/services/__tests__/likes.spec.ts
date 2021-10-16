import { LikesService } from '../likes.service';
import { server } from '../../server';
import { PrismaClient, Like, User, Post, Comment } from '@prisma/client';
import { CreateLikeDto } from '../../dtos/likes/request/create-like.dto';
import bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

const prisma = new PrismaClient();
const password = 'password123';
let likeCommentCreated: Like;
let likePostCreated: Like;
let userCreated1: User;
let userCreated2: User;
let postCreated: Post;
let commentCreated: Comment;
const fakeResourceId = 123;

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user1 = await prisma.user.create({
    data: {
      firstName: 'userCreator ',
      lastName: 'userCreator',
      email: 'creator@ravn.com',
      password: hashedPassword,
    },
  });

  const post = await prisma.post.create({
    data: {
      title: 'post test',
      body: 'post test',
      userId: user1.id,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      title: 'comment test',
      body: 'comment test',
      postId: post.id,
      userId: user1.id,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: hashedPassword,
    },
  });

  const likeComment = await prisma.like.create({
    data: { userId: user1.id, resourceId: comment.id, type: 'COMMENT', isLike: false },
  });

  const likePost = await prisma.like.create({
    data: { userId: user1.id, resourceId: post.id, type: 'POST', isLike: true },
  });

  userCreated1 = user1;
  userCreated2 = user2;
  postCreated = post;
  commentCreated = comment;
  likeCommentCreated = likeComment;
  likePostCreated = likePost;
});

describe('giveLike', () => {
  it('should throw an error with an invalid post (resourceId)', async () => {
    const dto = plainToClass(CreateLikeDto, {
      userId: userCreated2.id,
      type: 'POST',
      resourceId: fakeResourceId,
      isLike: true,
    });
    await dto.isValid();

    await expect(LikesService.giveLike(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error with an invalid comment (resourceId)', async () => {
    const dto = plainToClass(CreateLikeDto, {
      userId: userCreated2.id,
      type: 'COMMENT',
      resourceId: fakeResourceId,
      isLike: true,
    });
    await dto.isValid();

    await expect(LikesService.giveLike(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error if like a post with the correct parameters', async () => {
    const dto = plainToClass(CreateLikeDto, {
      userId: userCreated2.id,
      type: 'POST',
      resourceId: postCreated.id,
      isLike: true,
    });
    await dto.isValid();

    await expect(LikesService.giveLike(dto)).resolves.not.toThrow();
  });
});

describe('removeLike', () => {
  it('should throw an error with an invalid post (resourceId)', async () => {
    const dto = plainToClass(CreateLikeDto, {
      userId: userCreated2.id,
      type: 'POST',
      resourceId: fakeResourceId,
      isLike: true,
    });
    await dto.isValid();

    await expect(LikesService.removeLike(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error with an invalid comment (resourceId)', async () => {
    const dto = plainToClass(CreateLikeDto, {
      userId: userCreated2.id,
      type: 'COMMENT',
      resourceId: fakeResourceId,
      isLike: true,
    });
    await dto.isValid();

    await expect(LikesService.removeLike(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error if eliminate a like previusly created', async () => {
    const dto = plainToClass(CreateLikeDto, {
      userId: likePostCreated.userId,
      type: likePostCreated.type,
      resourceId: likePostCreated.resourceId,
      isLike: likePostCreated.isLike,
    });
    await dto.isValid();

    await expect(LikesService.removeLike(dto)).resolves.not.toThrow();
  });
});

afterAll(async () => {
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
  server.close();
});
