import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CommentDto {
  @Expose()
  uuid: string;

  @Expose()
  userId: string;

  @Expose()
  comment: string;

  @Expose()
  likes: number;

  @Expose()
  dislikes: number;

  @Expose()
  @Transform(value => value.toString())
  readonly createdAt: Date;
}
