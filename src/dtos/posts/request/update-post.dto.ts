import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BaseDto } from '../../base.dto';

@Exclude()
export class UpdatePostDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly id: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  readonly title: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly body: string;

  @Expose()
  @IsOptional()
  readonly likes: number;

  @Expose()
  @IsOptional()
  readonly dislikes: number;

  @Expose()
  @IsOptional()
  readonly isDraft: boolean;
}
