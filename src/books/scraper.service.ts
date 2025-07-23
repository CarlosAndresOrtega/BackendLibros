import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Book } from './entities/book.entity';

@Injectable()
export class ScraperService {
  /**
   * Scrapea una página de libros y devuelve los datos
   */
  async scrapePage(page: number): Promise<Partial<Book>[]> {
    const baseUrl = `https://books.toscrape.com/catalogue/page-${page}.html`;
    const { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);

    const bookLinks = $('.product_pod h3 a')
      .map(
        (_, el) =>
          new URL($(el).attr('href')!, 'https://books.toscrape.com/catalogue/')
            .href,
      )
      .get();

    return Promise.all(bookLinks.map((url) => this.scrapeBookDetails(url)));
  }

  /**
   * Scrapea el detalle de un libro individual
   */
  private async scrapeBookDetails(url: string): Promise<Partial<Book>> {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('.product_main h1').text().trim();
    const price = $('.product_main .price_color')
      .text()
      .replace(/[^\d.]/g, '') // Solo números y punto
      .replace(/(\..*?)\./g, '$1') // Quita puntos extra
      .trim();

    const ratingText =
      $('.star-rating').attr('class')?.replace('star-rating', '').trim() ||
      'Zero';
    const rating = this.convertRatingToNumber(ratingText);

    const stockMatch = $('.availability')
      .text()
      .match(/\((\d+)\)/);
    const stock = stockMatch ? parseInt(stockMatch[1], 10) : 0;

    const category = $('.breadcrumb li:nth-child(3) a').text().trim();
    const description = $('#product_description').next('p').text().trim();
    const upc = $('.table.table-striped tr').eq(0).find('td').text().trim();
    const productType = $('.table.table-striped tr')
      .eq(1)
      .find('td')
      .text()
      .trim();
    const reviewCount = parseInt(
      $('.table.table-striped tr').eq(6).find('td').text().trim(),
      10,
    );

    return {
      title,
      price,
      rating,
      stock,
      category,
      description,
      upc,
      productType,
      reviewCount,
    };
  }

  /**
   * Convierte un rating textual (One, Two, ...) a número
   */
  private convertRatingToNumber(ratingText: string): number {
    const ratings: Record<string, number> = {
      Zero: 0,
      One: 1,
      Two: 2,
      Three: 3,
      Four: 4,
      Five: 5,
    };
    return ratings[ratingText] ?? 0;
  }
}
