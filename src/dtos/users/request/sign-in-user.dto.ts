import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';
import { BaseDto } from '../../base.dto';

@Exclude()
export class SignInUserDto extends BaseDto {
  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  @Length(6, 20)
  readonly password: string;
}
