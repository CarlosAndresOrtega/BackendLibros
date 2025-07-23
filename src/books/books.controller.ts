import {
  Controller,
  Get,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get('/scrape-books')
  async scrapeBooks(
    @Query('page') page?: number,
    @Query('totalPages') totalPages?: number,
  ) {
    const pageNumber = page && page > 0 ? +page : 1;
    const total = totalPages && totalPages > 0 ? +totalPages : 1;

    return this.booksService.scrapeBooks(pageNumber, total);
  }
  @Get('filters')
  async getFilters() {
    const categories = await this.booksService.getCategories();
    const priceRange = await this.booksService.getPriceRange();
    return {
      filters: [
        {
          name: 'Categorías',
          queryParam: 'category',
          values: categories.map((cat, index) => ({
            id: index + 1,
            name: cat,
          })),
        },
        {
          name: 'Precio',
          queryParam: 'price',
          min: priceRange.min,
          max: priceRange.max,
        },
      ],
    };
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('size') size = 10,
    @Query('sort') sort?: string,
    @Query('category') category?: string,
    @Query('priceMin') priceMin?: number,
    @Query('priceMax') priceMax?: number,
  ) {
    const result = await this.booksService.findAll({
      page: +page,
      size: +size,
      sort,
      category,
      priceMin: priceMin ? +priceMin : undefined,
      priceMax: priceMax ? +priceMax : undefined,
    });
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.booksService.remove(id);
  }
}
