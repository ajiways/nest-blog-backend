import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class GetPostsDto {
  @ApiProperty({ description: 'Count of posts that you need' })
  @IsNumber({}, { message: 'Take count must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Min should me greather than 0' })
  @Max(100, { message: "You can't take more than 100 posts at one request" })
  take: number;

  @ApiProperty({ description: 'Offset to skip' })
  @IsNumber({}, { message: 'Skip count must be a number' })
  @Type(() => Number)
  @Min(0, { message: 'Skip should me greather than 0' })
  skip: number;
}
