import { PrismaClient, User } from '@prisma/client';
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

let user: User;
const initialUser = {
  id: 1,
  uuid: '33e6042c-b9c5-4cfa-90c5-f688641f104e',
  firstName: 'test',
  lastName: 'test',
  email: 'test@ravn.com',
};

beforeAll(async () => {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  const hashedPassword = await bcrypt.hash('password', 10);
  user = await prisma.user.create({
    data: {
      ...initialUser,
      password: hashedPassword,
    },
  });
});

beforeEach(async () => {
  await prisma.post.deleteMany({});
});

describe('create', () => {
  const newPost = {
    title: 'test',
    body: 'test',
  };

  it('should create a new post', async () => {
    const result = await PostsService.create(user.id, plainToClass(CreatePostDto, newPost));

    expect(result).toBeDefined();
    expect(result.title).toBe(newPost.title);
    expect(result.body).toBe(newPost.body);
  });

  it('should not have empty properties', async () => {
    const result = await PostsService.create(user.id, plainToClass(CreatePostDto, newPost));

    expect(result.title).not.toBe('');
    expect(result.body).not.toBe('');
  });
});

describe('find', () => {
  let post: PostDto;

  beforeAll(async () => {
    post = await PostsService.create(
      user.id,
      plainToClass(CreatePostDto, {
        title: 'test',
        body: 'test',
      })
    );
  });

  it('should find a post by id', async () => {
    const result = await PostsService.findOne(post.id);

    expect(result).toBeDefined();
    expect(result.title).toBe(post.title);
    expect(result.body).toBe(post.body);
  });
});

// describe('update', () => {
//   it('should update a post', async () => {
//     const post = await PostsService.create(
//       user.id,
//       plainToClass(CreatePostDto, {
//         title: 'test',
//         body: 'test',
//       })
//     );

//     const result = await PostsService.update(
//       user.id,
//       post.id,
//       plainToClass(UpdatePostDto, {
//         title: 'test2',
//         body: 'test2',
//       })
//     );

//     // expect(post).toBeDefined();
//     expect(result.id).toBe(post.id.);

//     // expect(result).toBeDefined();
//     // expect(result.title).toBe('test2');
//     // expect(result.body).toBe('test2');
//   });
// });

afterAll(async () => {
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
  server.close();
});
