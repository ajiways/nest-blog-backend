import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class UpdatePostDto {
  @ApiProperty({
    type: Number,
    description: 'Id of post that needs to be updated',
  })
  @IsNumber({}, { message: 'Post id must be a string' })
  @Min(1, { message: 'Id must be greater than 1' })
  id: number;

  @ApiProperty({ type: String, description: 'Updated post content' })
  @IsString({ message: 'Post content must be a string' })
  @MinLength(10, {
    message: 'Post content must be longer than 10 characters',
  })
  markdown: string;
}
