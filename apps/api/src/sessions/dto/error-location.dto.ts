import { IsInt, IsString, Length, Min } from 'class-validator';
import type { ErrorLocation } from '@gitype/shared';

export class ErrorLocationDto implements ErrorLocation {
  @IsInt()
  @Min(0)
  index!: number;

  @IsString()
  @Length(1, 1)
  expected!: string;

  @IsString()
  @Length(1, 1)
  typed!: string;
}
