import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('../users/users.service');
jest.mock('@nestjs/jwt');
jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  describe('validateUser', () => {
    it('should return user data without password if credentials are valid', async () => {
      const mockUser = { id: 1, username: 'test', password: 'hashed' };

      usersService.findByUsername = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test', 'plain');

      expect(usersService.findByUsername).toHaveBeenCalledWith('test');
      expect(bcrypt.compare).toHaveBeenCalledWith('plain', 'hashed');
      expect(result).toEqual({ id: 1, username: 'test' }); // sin password
    });

    it('should return null if credentials are invalid', async () => {
      usersService.findByUsername = jest.fn().mockResolvedValue(null);

      const result = await authService.validateUser('wrong', 'wrong');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access_token', async () => {
      const mockUser = { id: 1, username: 'test' };
      jwtService.sign = jest.fn().mockReturnValue('mock-token');

      const result = await authService.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
      expect(result).toEqual({ access_token: 'mock-token' });
    });
  });
});
