import { UpdateCommentDto } from './../../dtos/comments/request/update-comment.dto';
import { CommentsService } from './../comments.service';
import { CreateCommentDto } from './../../dtos/comments/request/create-comment.dto';
import { PrismaClient, User, Post } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { server } from '../../server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const password = 'password123';
let userCreated1: User;
let userCreated2: User;
let postCreated: Post;

beforeAll(async () => {
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  const hashedPassword = await bcrypt.hash(password, 10);
  userCreated1 = await prisma.user.create({
    data: {
      firstName: 'userCreator ',
      lastName: 'userCreator',
      email: 'creator@ravn.com',
      password: hashedPassword,
    },
  });

  postCreated = await prisma.post.create({
    data: {
      title: 'post test',
      body: 'post test',
      userId: userCreated1.id,
    },
  });

  userCreated2 = await prisma.user.create({
    data: {
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: hashedPassword,
    },
  });
});

describe('create', () => {
  it('should create a comment', async () => {
    const newcomment = {
      title: 'test',
      body: 'test',
      postId: postCreated.id,
      userId: userCreated2.id,
    };

    const comment = await CommentsService.create(
      userCreated1.id,
      postCreated.id,
      plainToClass(CreateCommentDto, newcomment)
    );
    expect(comment).toBeDefined();
    expect(comment.title).toBe(newcomment.title);
    expect(comment.body).toBe(newcomment.body);
  });
});

describe('find', () => {
  it('should find all comments', async () => {
    const comments = await CommentsService.find(postCreated.id);

    expect(comments).toBeDefined();
    expect(comments.length).toBe(1);
  });
});

describe('update', () => {
  it('should update a comment', async () => {
    const newcomment = {
      title: 'test',
      body: 'test',
      postId: postCreated.id,
      userId: userCreated2.id,
    };

    const comment = await CommentsService.create(
      userCreated1.id,
      postCreated.id,
      plainToClass(CreateCommentDto, newcomment)
    );

    const updatecomment = {
      title: 'test2',
      body: 'test2',
      postId: postCreated.id,
      userId: userCreated2.id,
    };

    const updatedcomment = await CommentsService.update(
      userCreated1.id,
      comment.id,
      plainToClass(UpdateCommentDto, updatecomment)
    );

    expect(updatedcomment).toBeDefined();
    expect(updatedcomment.title).toBe(updatecomment.title);
    expect(updatedcomment.body).toBe(updatecomment.body);
  });

  it('should not update a comment if user is not the owner', async () => {
    const newcomment = {
      title: 'test',
      body: 'test',
      postId: postCreated.id,
      userId: userCreated2.id,
    };

    const comment = await CommentsService.create(
      userCreated1.id,
      postCreated.id,
      plainToClass(CreateCommentDto, newcomment)
    );

    const updatecomment = {
      title: 'test2',
      body: 'test2',
      postId: postCreated.id,
      userId: userCreated2.id,
    };

    try {
      await CommentsService.update(
        userCreated2.id,
        comment.id,
        plainToClass(UpdateCommentDto, updatecomment)
      );
    } catch (error: any) {
      expect(error.message).toBe('You are not the owner of this comment');
    }
  });
});

describe('delete', () => {
  it('should delete a comment', async () => {
    const newcomment = {
      title: 'test',
      body: 'test',
      postId: postCreated.id,
      userId: userCreated2.id,
    };

    const comment = await CommentsService.create(
      userCreated1.id,
      postCreated.id,
      plainToClass(CreateCommentDto, newcomment)
    );

    const deletedcomment = await CommentsService.delete(userCreated1.id, comment.id);

    expect(deletedcomment).toBeDefined();
    expect(deletedcomment.title).toBe(newcomment.title);
    expect(deletedcomment.body).toBe(newcomment.body);
  });

  it('should not delete a comment if user is not the owner', async () => {
    const newcomment = {
      title: 'test',
      body: 'test',
      postId: postCreated.id,
      userId: userCreated2.id,
    };

    const comment = await CommentsService.create(
      userCreated1.id,
      postCreated.id,
      plainToClass(CreateCommentDto, newcomment)
    );

    try {
      await CommentsService.delete(userCreated2.id, comment.id);
    } catch (error: any) {
      expect(error.message).toBe('You are not the owner of this comment');
    }
  });
});

afterAll(async () => {
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
  server.close();
});
