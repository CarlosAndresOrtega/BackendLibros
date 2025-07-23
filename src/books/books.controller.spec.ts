import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: {
            findAll: jest.fn().mockResolvedValue({
              pagination: {
                pageSize: 10,
                totalItems: 1,
                totalPages: 1,
                currentPage: 1,
              },
              items: [{ id: 1, title: 'Test Book' }],
            }),
            findOne: jest.fn(),
            remove: jest.fn(),
            scrapeBooks: jest.fn(),
            getCategories: jest.fn(),
            getPriceRange: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all books', async () => {
    const result = await controller.findAll(1, 10);
    expect(result.pagination.totalItems).toBe(1);
    expect(result.items).toHaveLength(1);
  });

  it('should trigger scrapeBooks', async () => {
    await controller.scrapeBooks(1, 1);
    expect(service.scrapeBooks).toHaveBeenCalledWith(1, 1);
  });
});
