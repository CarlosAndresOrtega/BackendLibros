import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const mockUser = { id: 1, username: 'test' };
      service.create.mockResolvedValue(mockUser as any);

      const result = await controller.create({ username: 'test', password: 'pass' });

      expect(service.create).toHaveBeenCalledWith('test', 'pass');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, username: 'u1' }];
      service.findAll.mockResolvedValue(users as any);

      const result = await controller.findAll();

      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return user by id', async () => {
      const user = { id: 1, username: 'u1' };
      service.findOne.mockResolvedValue(user as any);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should call service.update and return result', async () => {
      const updatedUser = { id: 1, username: 'u2' };
      service.update.mockResolvedValue(updatedUser as any);

      const result = await controller.update('1', { username: 'u2', password: 'new' });

      expect(service.update).toHaveBeenCalledWith(1, 'u2', 'new');
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      service.remove.mockResolvedValue();

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
