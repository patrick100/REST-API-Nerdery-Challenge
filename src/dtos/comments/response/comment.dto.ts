import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CommentDto {
  @Expose()
  id: number;

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
  @Transform(({ value }) => value.toString())
  readonly createdAt: Date;
}
