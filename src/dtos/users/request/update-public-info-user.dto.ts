import { Expose, Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { BaseDto } from '../../base.dto';

@Exclude()
export class UpdatePublicInfoUserDto extends BaseDto {
  @Expose()
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  readonly isPublicEmail: boolean;

  @Expose()
  @IsNotEmpty()
  @IsOptional()
  @IsBoolean()
  readonly isPublicName: boolean;
}
