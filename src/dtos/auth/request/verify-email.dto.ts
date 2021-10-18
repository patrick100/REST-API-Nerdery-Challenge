import { Expose, Exclude } from 'class-transformer';
import { IsString } from 'class-validator';
import { BaseDto } from '../../base.dto';

@Exclude()
export class VerifyEmailDto extends BaseDto {
  @Expose()
  @IsString()
  readonly uuid: string;

  @Expose()
  @IsString()
  readonly token: string;
}
