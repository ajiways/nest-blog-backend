import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class GetPostByIdDto {
  @ApiProperty({ type: Number, description: 'Id of post that you need' })
  @IsNumber({}, { message: 'Post id must be a number' })
  @Type(() => Number)
  @Min(1, { message: 'Id must be greater than 1' })
  id: number;
}
