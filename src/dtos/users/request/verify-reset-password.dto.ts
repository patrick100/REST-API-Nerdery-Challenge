import { Expose, Exclude } from 'class-transformer';
import { IsString, Length } from 'class-validator';
import { BaseDto } from '../../base.dto';

@Exclude()
export class VerifyResetPasswordDto extends BaseDto {
  @Expose()
  @IsString()
  readonly uuid: string;

  @Expose()
  @IsString()
  readonly token: string;

  @Expose()
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
