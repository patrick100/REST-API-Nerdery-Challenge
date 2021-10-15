import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { BaseDto } from '../../base.dto';

@Exclude()
export class CreatePostDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly body: string;

  @Expose()
  @IsOptional()
  readonly isDraft: boolean;
}
