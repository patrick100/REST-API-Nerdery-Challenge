import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class PostDto {
  @Expose()
  id: number;

  @Expose()
  userId: number;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  likes: number;

  @Expose()
  dislikes: number;

  @Expose()
  isDraft: boolean;

  @Expose()
  @Transform(({ value }) => value?.toString())
  readonly createdAt: Date;
}
