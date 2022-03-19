import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dtos/create.post.dto';
import { UpdatePostDto } from './dtos/update.post.dto';
import { DeletePostDto } from './dtos/delete.post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { IParams } from '../../interfaces/params.interface';
import { IRelations } from '../../interfaces/relations.interface';
import { ApiException } from '../../errors/api.exception';
import { ApiStatus } from '../../errors/misc/api.codes.enum';
import { JSDOM } from 'jsdom';
import { marked } from 'marked';
import createDOMPurify from 'dompurify';

const window = new JSDOM('').window as unknown;
const DOMPurify = createDOMPurify(window as Window);

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async findAll(take: number, skip: number) {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .offset(skip)
      .limit(take)
      .select(['post.*', 'author.id', 'author.login'])
      .execute();
    // getManyAndCount возвращает только каунт, не понимаю в чем дело :/
    const count = await this.postRepository
      .createQueryBuilder('post')
      .getCount();

    return {
      posts,
      totalCount: count,
    };
  }

  async createPost(data: CreatePostDto, user: User) {
    const htmlContent = DOMPurify.sanitize(marked(data.markdown));

    return await this.postRepository.save({
      htmlContent,
      markdown: data.markdown,
      author: user,
    });
  }

  async updatePost(data: UpdatePostDto, user: User) {
    const post = await this.findOneWithParams(
      {
        where: { id: data.id },
      },
      { relations: ['author'] },
    );

    const htmlContent = DOMPurify.sanitize(marked(data.markdown));

    if (post.author.id !== user.id) {
      throw new ApiException(`You are not a post owner`, ApiStatus.FORBIDDEN);
    }

    return await this.postRepository
      .merge(post, { ...data, htmlContent })
      .save();
  }

  async deletePost(data: DeletePostDto, user: User) {
    const post = await this.findOne(data.id);

    if (post.author_id !== user.id) {
      console.log(post, user.id);
      throw new ApiException(`You are not a post owner`, ApiStatus.FORBIDDEN);
    }

    const deletedPost = await this.postRepository.remove(post);
    return {
      message: 'Post was deleted successfully!',
      post: deletedPost,
    };
  }

  async findOneWithParams(params: IParams, relations?: IRelations) {
    const post = await this.postRepository.findOne({ ...params, ...relations });

    if (!post) {
      throw new ApiException(`Post was not found`, ApiStatus.NOT_FOUND);
    }

    return post;
  }

  async findOne(id: number) {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .select(['post.*', 'author.id', 'author.login'])
      .where(`post.id=${id}`)
      .execute();

    if (!post) {
      throw new ApiException(
        `Post with id ${id} was not found`,
        ApiStatus.NOT_FOUND,
      );
    }

    return post[0];

    // В этих костылях виноват кверибилдер!!!!
  }
}
