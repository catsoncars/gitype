import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import type { SubmitSessionDto as SubmitSessionDtoShape } from '@gitype/shared';
import { ErrorLocationDto } from './error-location.dto';
import { KeyStatDto } from './key-stat.dto';

export class SubmitSessionDto implements SubmitSessionDtoShape {
  @IsString()
  snippetId!: string;

  @IsString()
  language!: string;

  @IsDateString()
  startedAt!: string;

  @IsDateString()
  completedAt!: string;

  @IsInt()
  @Min(0)
  durationMs!: number;

  @IsNumber()
  @Min(0)
  wpm!: number;

  @IsNumber()
  @Min(0)
  rawWpm!: number;

  @IsNumber()
  @Min(0)
  cpm!: number;

  @IsNumber()
  @Min(0)
  accuracy!: number;

  @IsNumber()
  @Min(0)
  consistency!: number;

  @IsInt()
  @Min(0)
  totalChars!: number;

  @IsInt()
  @Min(0)
  correctChars!: number;

  @IsInt()
  @Min(0)
  incorrectChars!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ErrorLocationDto)
  errorLocations!: ErrorLocationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyStatDto)
  keyStats!: KeyStatDto[];
}
