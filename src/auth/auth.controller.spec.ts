import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const mockUser = { id: 1, username: 'test' };
      const mockToken = { access_token: 'jwt-token' };

      authService.validateUser.mockResolvedValue(mockUser);
      authService.login.mockResolvedValue(mockToken);

      const result = await controller.login({ username: 'test', password: '1234' });

      expect(authService.validateUser).toHaveBeenCalledWith('test', '1234');
      expect(authService.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockToken);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        controller.login({ username: 'wrong', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
