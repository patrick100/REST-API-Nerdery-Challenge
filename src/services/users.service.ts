import { Prisma, User } from '@prisma/client';
import { UpdatePublicInfoUserDto } from '../dtos/users/request/update-public-info-user.dto';
import { prisma } from '../server';

export class UsersService {
  static async findOne(uuid: string): Promise<User> {
    return prisma.user.findUnique({ where: { uuid } });
  }

  static async me(userId: number): Promise<User> {
    return prisma.user.findUnique({ where: { id: userId } });
  }

  static async updatePublicInfo(userId: number, input: UpdatePublicInfoUserDto): Promise<User> {
    try {
      const user = await prisma.user.update({
        data: input,
        where: {
          id: userId,
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}
