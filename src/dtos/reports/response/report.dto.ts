import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ReportDto {
  @Expose()
  readonly uuid: string;

  @Expose()
  readonly title: string;

  @Expose()
  readonly description: string;

  @Expose()
  readonly type: string;

  @Expose()
  readonly resourceId: number;

  @Expose()
  @Transform(({ value }) => value?.toISOString())
  readonly createdAt: Date;
}
