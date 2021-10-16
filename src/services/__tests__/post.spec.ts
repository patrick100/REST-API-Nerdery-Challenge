import { PrismaClient, User, Post } from '@prisma/client';
import { plainToClass } from 'class-transformer';
import { server } from '../../server';
import { UsersService } from '../users.service';
import { PostsService } from './../../services/posts.service';
import { PostDto } from '../../dtos/posts/response/post.dto';
import { CreatePostDto } from '../../dtos/posts/request/create-post.dto';
import { UpdatePostDto } from '../../dtos/posts/request/update-post.dto';
import { CreateUserDto } from '../../dtos/users/request/create-user.dto';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const password = 'password123';
let userCreated1: User;
let userCreated2: User;
let postCreated: Post;

beforeAll(async () => {
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

  console.log(postCreated);

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
  const newPost = {
    title: 'test',
    body: 'test',
  };

  it('should create a new post', async () => {
    const result = await PostsService.create(userCreated1.id, plainToClass(CreatePostDto, newPost));

    expect(result).toBeDefined();
    expect(result.title).toBe(newPost.title);
    expect(result.body).toBe(newPost.body);
  });

  it('should not have empty properties', async () => {
    const result = await PostsService.create(userCreated1.id, plainToClass(CreatePostDto, newPost));

    expect(result.title).not.toBe('');
    expect(result.body).not.toBe('');
  });
});

describe('find', () => {
  it('should find a post by id', async () => {
    const post = await PostsService.create(
      userCreated1.id,
      plainToClass(CreatePostDto, {
        title: 'test',
        body: 'test',
      })
    );
    const result = await PostsService.findOne(post.id);

    expect(result).toBeDefined();
    expect(result.title).toBe(post.title);
    expect(result.body).toBe(post.body);
  });
});

describe('update', () => {
  it('should update a post', async () => {
    const result = await PostsService.update(
      userCreated1.id,
      postCreated.id,
      plainToClass(UpdatePostDto, {
        title: 'test update',
        body: 'test update',
      })
    );

    expect(result.title).toMatch('test update');
    expect(result.body).toBe('test update');
  });

  it('should not have empty properties', async () => {
    const result = await PostsService.update(
      userCreated1.id,
      postCreated.id,
      plainToClass(UpdatePostDto, {
        title: 'test update',
        body: 'test update',
      })
    );

    expect(result.title).not.toBe('');
    expect(result.body).not.toBe('');
  });
});

afterAll(async () => {
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
  server.close();
});
