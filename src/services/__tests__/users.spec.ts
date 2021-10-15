import { UsersService } from '../users.service';
import { server } from '../../server';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { UpdatePublicInfoUserDto } from '../../dtos/users/request/update-public-info-user.dto';
import { plainToClass } from 'class-transformer';

const prisma = new PrismaClient();
const password = 'password123';
let userCreated: User;
const fakeUserId = 2;
const fakeUuid = 'fake_uuid';

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      id: 1,
      uuid: '33e6042c-b9c5-4cfa-90c5-f688641f104e',
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: hashedPassword,
    },
  });
  userCreated = user;
});

describe('findOne', () => {
  it('should throw an error with a wrong uuid', async () => {
    await expect(UsersService.findOne(fakeUuid)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with a correct uuid', async () => {
    await expect(UsersService.findOne(userCreated.uuid)).resolves.not.toThrow();
  });
});

describe('me', () => {
  it('should throw an error with a wrong userId', async () => {
    await expect(UsersService.me(fakeUserId)).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with a correct userId', async () => {
    await expect(UsersService.me(userCreated.id)).resolves.not.toThrow();
  });
});

describe('updatePublicInfo', () => {
  it('should throw an error with a wrong userId', async () => {
    const dto = plainToClass(UpdatePublicInfoUserDto, {
      isPublicEmail: true,
      isPublicName: false,
    });
    await dto.isValid();

    await expect(
      UsersService.updatePublicInfo(fakeUserId, dto)
    ).rejects.toThrowErrorMatchingSnapshot();
  });

  it('should not throw an error with a correct userId', async () => {
    const dto = plainToClass(UpdatePublicInfoUserDto, {
      isPublicEmail: true,
      isPublicName: false,
    });
    await dto.isValid();

    await expect(UsersService.updatePublicInfo(userCreated.id, dto)).resolves.not.toThrow();
  });
});

afterAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
  server.close();
});
