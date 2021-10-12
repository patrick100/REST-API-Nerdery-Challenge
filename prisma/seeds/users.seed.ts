import { Prisma } from '@prisma/client';
import { prisma } from '../seed';

const users: Prisma.UserCreateInput[] = [
  {
    email: 'patricklazo@ravn.co',
    firstName: 'Patrick',
    lastName: 'Lazo',
    password: '12345',
  },
  {
    email: 'kevincotrina@ravn.co',
    firstName: 'Kevin',
    lastName: 'Cotrina',
    password: '12345',
  },
];

const usersSeed = async () => {
  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
};

export default usersSeed;
