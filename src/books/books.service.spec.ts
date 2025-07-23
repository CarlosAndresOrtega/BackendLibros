import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { ScraperService } from './scraper.service';

describe('BooksService', () => {
  let service: BooksService;
  let mockBookRepo: any;
  let mockQueryBuilder: any;
  let mockScraperService: any;

  beforeEach(async () => {
    mockQueryBuilder = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
      getRawMany: jest.fn(),
      getRawOne: jest.fn(),
    };

    mockBookRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    };

    mockScraperService = {
      scrapePage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepo,
        },
        {
          provide: ScraperService,
          useValue: mockScraperService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('scrapeBooks', () => {
    it('should scrape books and save them', async () => {
      const bookData = [{ title: 'Test Book', price: '10.99' }];
      mockScraperService.scrapePage.mockResolvedValue(bookData);
      mockBookRepo.create.mockReturnValue(bookData[0]);
      mockBookRepo.save.mockResolvedValue(bookData);

      const result = await service.scrapeBooks(1, 1);

      expect(mockScraperService.scrapePage).toHaveBeenCalledWith(1);
      expect(mockBookRepo.create).toHaveBeenCalledWith(bookData[0]);
      expect(mockBookRepo.save).toHaveBeenCalledWith([bookData[0]]);
      expect(result).toEqual({ pagesScraped: 1, booksSaved: 1 });
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const book = { id: 1, title: 'Test Book', price: '10.99' };
      mockBookRepo.findOneBy.mockResolvedValue(book);

      const result = await service.findOne(1);

      expect(result).toEqual(book);
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBookRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrowError(
        'Book with id 1 not found',
      );
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      mockBookRepo.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockBookRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if book not found', async () => {
      mockBookRepo.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrowError(
        'Book with id 1 not found',
      );
    });
  });

  describe('getCategories', () => {
    it('should return a list of categories', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValue([
        { category: 'Fiction' },
        { category: 'Non-Fiction' },
      ]);
      mockBookRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getCategories();

      expect(result).toEqual(['Fiction', 'Non-Fiction']);
    });
  });

  describe('getPriceRange', () => {
    it('should return min and max price', async () => {
      const prices = { min: 5.99, max: 20.99 };

      mockQueryBuilder.getRawOne.mockResolvedValue(prices);
      mockBookRepo.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getPriceRange();

      expect(result).toEqual(prices);
    });
  });
});
