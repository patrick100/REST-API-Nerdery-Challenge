//import { SignUp } from '../auth.service';
import { PrismaClient, User } from '@prisma/client';
import { DATABASE_TEST_URL } from '../../config';

test('Testing time!', () => {
  console.log('welcome');
});

let userCreated: User;

beforeAll(async () => {
  const prisma = new PrismaClient();

  const user = await prisma.user.create({
    data: {
      firstName: 'test',
      lastName: 'test',
      email: 'test@ravn.com',
      password: 'password123',
    },
  });

  userCreated = user;
});

describe('SignUp', () => {
  it('should throw an error if the email is already taken', async () => {
    /* const userData: CreateUserDto = {
      name: 'John Smith',
      email: 'john@smith.com',
      password: 'strongPassword123',
    }; */
    //const authenticationService = new AuthenticationService();
    //authenticationService.user.findOne = jest.fn().mockReturnValue(Promise.resolve(userData));
    //await expect(authenticationService.register(userData)).rejects.toMatchObject(
    //  new UserWithThatEmailAlreadyExistsException(userData.email)
    //);
  });
});
