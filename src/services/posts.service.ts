import { Prisma, Post } from '@prisma/client';
import { CreatePostDto } from '../dtos/posts/request/create-post.dto';
import { prisma } from '../server';

export class PostsService {
  static async find(): Promise<Post[]> {
    return prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  }

  static create(input: object): void {
    console.log(input);
  }

  static async findOne(uuid: string): Promise<Post> {
    return prisma.post.findUnique({ where: { uuid } });
  }

  static async findUserPosts(uuid: string): Promise<Post[]> {
    const currentUser = await prisma.user.findUnique({ where: { uuid } });

    return prisma.post.findMany({
      where: {
        user: {
          id: currentUser.id,
        },
      },
    });
  }

  static async delete(uuid: string): Promise<Post> {
    // console.log(uuid);

    return prisma.post.delete({ where: { uuid } });
  }
}
