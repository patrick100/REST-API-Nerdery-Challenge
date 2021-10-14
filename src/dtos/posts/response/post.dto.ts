import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class PostDto {
  @Expose()
  uuid: string;

  @Expose()
  title: string;

  @Expose()
  body: string;

  @Expose()
  likes: number;

  @Expose()
  dislikes: number;

  @Expose()
  @Transform(value => value.toString())
  readonly createdAt: Date;
}