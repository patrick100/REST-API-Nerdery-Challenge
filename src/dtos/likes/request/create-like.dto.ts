import { TableType } from '.prisma/client';
import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsBoolean, IsNumber, IsString } from 'class-validator';
import { BaseDto } from '../../base.dto';

@Exclude()
export class CreateLikeDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  readonly isLike: boolean;

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
