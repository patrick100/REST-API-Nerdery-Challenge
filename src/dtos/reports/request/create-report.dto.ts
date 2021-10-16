import { TableType } from '.prisma/client';
import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../base.dto';

@Exclude()
export class CreateReportDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly resourceId: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  readonly userId: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly type: TableType;
}
