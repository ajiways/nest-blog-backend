import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUser } from '../../decorators/get-user.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { ValidationPipe } from '../../pipes/validation.pipe';
import { User } from '../user/user.entity';
import { CreatePostDto } from './dtos/create.post.dto';
import { DeletePostDto } from './dtos/delete.post.dto';
import { GetPostByIdDto } from './dtos/get.post.dto';
import { GetPostsDto } from './dtos/get.posts.dto';
import { UpdatePostDto } from './dtos/update.post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOkResponse({ description: 'Returns all existing posts' })
  @UsePipes(ValidationPipe)
  async getAllPosts(@Query() data: GetPostsDto) {
    return await this.postService.findAll(data.take, data.skip);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns single post that was find by id' })
  @ApiNotFoundResponse({ description: 'Post with provided id was not found' })
  @UsePipes(ValidationPipe)
  async getPostById(@Param() data: GetPostByIdDto) {
    return await this.postService.findOne(data.id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiBody({ type: CreatePostDto })
  @ApiCreatedResponse({ description: 'Post was successfully created' })
  @ApiUnauthorizedResponse({
    description: 'Post was not created, you need to log in first',
  })
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async createPost(@Body() data: CreatePostDto, @GetUser() user: User) {
    return await this.postService.createPost(data, user);
  }

  @Put()
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePostDto })
  @ApiOkResponse({ description: 'Post was successfully updated' })
  @ApiBadRequestResponse({
    description:
      'Some error occured, maybe there is no post with id that provided?',
  })
  @ApiUnauthorizedResponse({
    description: 'You needs to be authorized to editing posts',
  })
  @ApiForbiddenResponse({
    description: "You can't edit post, because it's not yours",
  })
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async updatePost(@Body() data: UpdatePostDto, @GetUser() user: User) {
    return await this.postService.updatePost(data, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiBody({ type: DeletePostDto })
  @ApiOkResponse({ description: 'Post was successfully deleted' })
  @ApiBadRequestResponse({
    description:
      'Some error occured, maybe there is no post with id that provided?',
  })
  @ApiUnauthorizedResponse({
    description: 'You must be authorized to deleting posts',
  })
  @ApiForbiddenResponse({ description: "You can't delete post that not yours" })
  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  async deletePost(@Param() data: DeletePostDto, @GetUser() user: User) {
    return await this.postService.deletePost(data, user);
  }
}
