import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  readonly id: number;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly isPublicEmail: boolean;

  @Expose()
  readonly isPublicName: boolean;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;
}
