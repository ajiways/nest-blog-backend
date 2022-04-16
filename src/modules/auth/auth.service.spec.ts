import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthException } from '../../errors/auth.exceptions';
import { IParams } from '../../interfaces/params.interface';
import { Token } from '../token/token.entity';
import { TokenService } from '../token/token.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

interface IUser {
  id: number;
  login: string;
  password: string;
  posts: string[];
}

interface IToken {
  id: number;
  user: IUser;
  refreshToken: string;
}

describe('AuthService', () => {
  let service: AuthService;
  let mockUserDB: IUser[];
  let mockTokenDB: IToken[];

  const mockUsersRepository = {
    findOne(params: IParams) {
      if (params.where.login) {
        return Promise.resolve(
          mockUserDB.find((u) => u.login === params.where.login),
        );
      }
      if (params.where.id) {
        return Promise.resolve(
          mockUserDB.find((u) => u.id === params.where.id),
        );
      }
    },
    save(data: IUser) {
      mockUserDB.push(data);
      return Promise.resolve(data);
    },
  };

  const mockTokenRepository = {
    findOne(params: IParams) {
      return Promise.resolve(
        mockTokenDB.find((t) => t.user.id === params.where.user),
      );
    },
    save(data: { user: IUser; refreshToken: string }) {
      mockTokenDB.push({
        id: Date.now(),
        refreshToken: data.refreshToken,
        user: data.user,
      });
      return data;
    },
  };

  beforeEach(async () => {
    mockUserDB = [
      { id: 1, login: 'Test', password: 'Test', posts: [] },
      { id: 2, login: 'Test1', password: 'Test1', posts: [] },
      { id: 3, login: 'Test2', password: 'Test2', posts: [] },
      {
        id: 4,
        login: 'kswbtw',
        password:
          '$2a$07$HhgPVEj7SpAw4IszqmO7FOpTnbCtA.4IXSaqFlo6Jw1ZgNWQGJ6Ui',
        posts: [],
      },
    ];
    mockTokenDB = [
      {
        id: 1,
        refreshToken: 'bla-bla-bla',
        user: { id: 2, login: 'Test1', password: 'Test1', posts: [] },
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUsersRepository },
        TokenService,
        { provide: getRepositoryToken(Token), useValue: mockTokenRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should return error because password is wrong', async () => {
    expect(
      await service
        .login({ login: 'Test', password: 'wrong' }, 'Mozilla')
        .catch((e) => e),
    ).toStrictEqual(new AuthException('Wrong login or password'));
  });
  it('should return new user', async () => {
    expect(
      await service.registration({
        login: 'NewUser',
        confirm: '123123',
        password: '123123',
      }),
    ).toStrictEqual({
      message: 'Successfully registrated!',
      user: {
        login: 'NewUser',
        password: expect.any(String),
      },
    });
  });
  it('should return error because user already exsits', async () => {
    expect(
      await service
        .registration({
          login: 'Test',
          confirm: '123123',
          password: '123123',
        })
        .catch((e) => e),
    ).toStrictEqual(
      new AuthException('User with login: "Test" already exists'),
    );
  });
  it('should return error because passwords mismatches', async () => {
    expect(
      await service
        .registration({
          login: 'Test',
          confirm: '12341234',
          password: '123123',
        })
        .catch((e) => e),
    ).toStrictEqual(new AuthException('Passwords mismatches'));
  });
  it('should return error because passwords mismatches', async () => {
    expect(
      await service
        .registration({
          login: 'Test',
          confirm: '12341234',
          password: '123123',
        })
        .catch((e) => e),
    ).toStrictEqual(new AuthException('Passwords mismatches'));
  });
  it("should return error because user doesn't exist", async () => {
    expect(
      await service
        .login({ login: 'bababoi', password: 'sus' }, 'Mozilla')
        .catch((e) => e),
    ).toStrictEqual(new AuthException('Wrong login or password'));
  });
  it('should return pair of tokens and user', async () => {
    expect(
      await service
        .login({ login: 'kswbtw', password: 'Test' }, 'Mozilla')
        .catch((e) => e),
    ).toStrictEqual({
      message: 'Successfully logged in!',
      user: { id: 4, login: 'kswbtw', password: expect.any(String), posts: [] },
      tokens: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      },
    });
  });
});
