import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ type: String, description: 'Post content' })
  @IsString({ message: 'Post content must be a string' })
  @MinLength(10, {
    message: 'Post content must be longer than 10 characters',
  })
  markdown: string;
}
