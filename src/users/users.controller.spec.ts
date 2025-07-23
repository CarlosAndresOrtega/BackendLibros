import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should hash password and save user', async () => {
      const userData = { username: 'test', password: '1234' };
      const hashedPassword = 'hashed1234';

      jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'hashed1234');

      repo.create.mockReturnValue({
        ...userData,
        password: 'hashed1234',
        id: 1, // añade un id porque la entity lo espera
      });

      repo.save.mockResolvedValue({
        id: 1,
        ...userData,
        password: hashedPassword,
      });

      const result = await service.create(userData.username, userData.password);

      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
      expect(repo.create).toHaveBeenCalledWith({
        username: userData.username,
        password: hashedPassword,
      });
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: 1,
        username: 'test',
        password: hashedPassword,
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, username: 'john', password: 'hashed1234' },
        { id: 2, username: 'jane', password: 'hashed5678' },
      ];
      repo.find.mockResolvedValue([
        { id: 1, username: 'john', password: 'hashed1234' },
        { id: 2, username: 'jane', password: 'hashed5678' },
      ]);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const user = { id: 1, username: 'john', password: 'hashed1234' };
      repo.findOne.mockResolvedValue({
        id: 1,
        username: 'john',
        password: 'hashed1234',
      });

      const result = await service.findOne(1);

      expect(result).toEqual(user);
    });

    it('should return undefined if user not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.findOne(1);

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const user = {
        id: 1,
        username: 'testuser',
        password: 'hashedPassword123', 
      };
      repo.findOne.mockResolvedValue(user);
      const hashedPassword = 'hashedNew';
      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue('hashedNew');

      const updatedUser = { ...user, username: 'u2', password: hashedPassword };
      repo.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, 'u2', 'newPass');

      expect(bcrypt.hash).toHaveBeenCalledWith('newPass', 10);
      expect(result).toEqual(updatedUser);
    });

    it('should throw error if user not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update(999, 'u2', 'pass')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('remove', () => {
    it('should call delete on repo', async () => {
      await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedpassword' };
      repo.findOne.mockResolvedValue(user);

      const result = await service.findByUsername('test');

      expect(result).toEqual(user);
    });

    it('should return undefined if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      const result = await service.findByUsername('notfound');

      expect(result).toBeUndefined();
    });
  });
});
