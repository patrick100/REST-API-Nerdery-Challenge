import { ReportsService } from '../reports.service';
import { server } from '../../server';
import { PrismaClient, User, Post, Comment } from '@prisma/client';
import { CreateReportDto } from '../../dtos/reports/request/create-report.dto';
import bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

const prisma = new PrismaClient();
const password = 'password123';
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

  userCreated1 = user1;
  userCreated2 = user2;
  postCreated = post;
  commentCreated = comment;
});

describe('reportPost', () => {
  it('should throw an error with an invalid post (resourceId)', async () => {
    const dto = plainToClass(CreateReportDto, {
      userId: userCreated2.id,
      type: 'POST',
      resourceId: fakeResourceId,
      title: 'it is a malicious post',
      description: 'This post does not show any kind of evidence',
    });
    await dto.isValid();

    await expect(ReportsService.reportPost(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should throw an error with an invalid comment (resourceId)', async () => {
    const dto = plainToClass(CreateReportDto, {
      userId: userCreated2.id,
      type: 'COMMENT',
      resourceId: fakeResourceId,
      title: 'This comment instinct hate',
      description: 'Admin you should kick them out',
    });
    await dto.isValid();

    await expect(ReportsService.reportComment(dto)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error if report a post with the correct parameters', async () => {
    const dto = plainToClass(CreateReportDto, {
      userId: userCreated2.id,
      type: 'POST',
      resourceId: postCreated.id,
      title: 'This comment instinct hate',
      description: 'Admin you should kick them out',
    });
    await dto.isValid();

    await expect(ReportsService.reportComment(dto)).resolves.not.toThrow();
  });

  it('should not throw an error if report a comment with the correct parameters', async () => {
    const dto = plainToClass(CreateReportDto, {
      userId: userCreated2.id,
      type: 'COMMENT',
      resourceId: commentCreated.id,
      title: 'This comment instinct hate',
      description: 'Admin you should kick them out',
    });
    await dto.isValid();

    await expect(ReportsService.reportComment(dto)).resolves.not.toThrow();
  });
});

afterAll(async () => {
  await prisma.report.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
  server.close();
});
