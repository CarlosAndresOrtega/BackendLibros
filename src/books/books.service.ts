import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { ScraperService } from './scraper.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
    private scraperService: ScraperService, // 👈 Servicio separado para scraping
  ) {}

  /**
   * Scrapea libros desde la web y los guarda en la base de datos
   */
  async scrapeBooks(
    startPage = 1,
    totalPages = 1,
  ): Promise<{ pagesScraped: number; booksSaved: number }> {
    let booksSaved = 0;

    for (let page = startPage; page < startPage + totalPages; page++) {
      console.log(`🔎 Scrapeando página ${page}...`);

      // 🕷️ Usa ScraperService para traer los datos
      const booksData = await this.scraperService.scrapePage(page);

      if (booksData.length === 0) {
        console.log(
          `⚠️ Página ${page} no contenía libros. Deteniendo scraping.`,
        );
        break;
      }

      // Crear entidades y guardar
      const books = booksData.map((data) => this.booksRepository.create(data));
      await this.booksRepository.save(books);

      booksSaved += books.length;
    }

    console.log(`✅ Scraping completo: ${booksSaved} libros guardados.`);
    return {
      pagesScraped: totalPages,
      booksSaved,
    };
  }

  /**
   * Lista todos los libros con filtros, paginación y ordenamiento
   */
  async findAll(params: {
    page: number;
    size: number;
    sort?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
  }) {
    const { page, size, sort, category, priceMin, priceMax } = params;

    const query = this.booksRepository.createQueryBuilder('book');

    if (category) {
      query.andWhere('book.category = :category', { category });
    }

    if (priceMin !== undefined) {
      query.andWhere(
        `CAST(regexp_replace(book.price, '[^0-9.]', '', 'g') AS FLOAT) >= :priceMin`,
        { priceMin },
      );
    }

    if (priceMax !== undefined) {
      query.andWhere(
        `CAST(regexp_replace(book.price, '[^0-9.]', '', 'g') AS FLOAT) <= :priceMax`,
        { priceMax },
      );
    }

    if (sort) {
      const [field, order] = sort.split(':');
      query.orderBy(
        `book.${field}`,
        order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      );
    }

    query.skip((page - 1) * size).take(size);

    const [items, totalItems] = await query.getManyAndCount();

    return {
      pagination: {
        pageSize: size,
        totalItems,
        totalPages: Math.ceil(totalItems / size),
        currentPage: page,
      },
      items,
    };
  }

  /**
   * Busca un libro por ID
   */
  async findOne(id: number): Promise<Book> {
    const book = await this.booksRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    return book;
  }

  /**
   * Borra un libro por ID
   */
  async remove(id: number): Promise<void> {
    const result = await this.booksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
  }

  /**
   * Lista todas las categorías de libros
   */
  async getCategories(): Promise<string[]> {
    const categories = await this.booksRepository
      .createQueryBuilder('book')
      .select('DISTINCT(book.category)', 'category')
      .where('book.category IS NOT NULL')
      .getRawMany();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return categories.map((c) => c.category).filter(Boolean);
  }

  /**
   * Obtiene el rango de precios de los libros
   */
  async getPriceRange(): Promise<{ min: number; max: number }> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const prices = await this.booksRepository
      .createQueryBuilder('book')
      .select([
        `MIN(CAST(REGEXP_REPLACE(book.price, '[^0-9.]', '', 'g') AS FLOAT)) AS "min"`,
        `MAX(CAST(REGEXP_REPLACE(book.price, '[^0-9.]', '', 'g') AS FLOAT)) AS "max"`,
      ])
      .getRawOne();

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      min: prices.min || 0,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      max: prices.max || 0,
    };
  }
}
