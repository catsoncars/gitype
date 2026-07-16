import { IsInt, IsString, Length, Min } from 'class-validator';
import type { KeyStat } from '@gitype/shared';

export class KeyStatDto implements KeyStat {
  @IsString()
  @Length(1, 1)
  key!: string;

  @IsInt()
  @Min(0)
  hits!: number;

  @IsInt()
  @Min(0)
  misses!: number;
}
