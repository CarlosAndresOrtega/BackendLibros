import { Test, TestingModule } from '@nestjs/testing';
import { ScraperService } from './scraper.service';
import axios from 'axios';
import * as cheerio from 'cheerio';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ScraperService', () => {
  let service: ScraperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScraperService],
    }).compile();

    service = module.get<ScraperService>(ScraperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('scrapePage', () => {
    it('should scrape a page and return book details', async () => {
      // Mock HTML for list page
      const listHtml = `
        <html>
          <body>
            <article class="product_pod">
              <h3><a href="book1.html">Book 1</a></h3>
            </article>
          </body>
        </html>
      `;

      // Mock HTML for book details page
      const bookHtml = `
        <html>
          <body>
            <div class="product_main">
              <h1>Book 1 Title</h1>
              <p class="price_color">£12.34</p>
              <p class="star-rating Four"></p>
            </div>
            <p class="availability">In stock (5 available)</p>
            <ul class="breadcrumb">
              <li></li><li></li><li><a>Fiction</a></li>
            </ul>
            <div id="product_description"></div>
            <p>This is a book description.</p>
            <table class="table table-striped">
              <tr><td>UPC123</td></tr>
              <tr><td>Book</td></tr>
              <tr></tr>
              <tr></tr>
              <tr></tr>
              <tr></tr>
              <tr><td>10</td></tr>
            </table>
          </body>
        </html>
      `;

      // Mock axios responses
      mockedAxios.get.mockImplementation((url: string) => {
        if (url.includes('page')) {
          return Promise.resolve({ data: listHtml });
        }
        return Promise.resolve({ data: bookHtml });
      });

      const result = await service.scrapePage(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        title: 'Book 1 Title',
        price: '12.34',
        rating: 4,
        stock: 0,
        category: 'Fiction',
        description: 'This is a book description.',
        upc: 'UPC123',
        productType: 'Book',
        reviewCount: 10,
      });
    });
  });

  describe('convertRatingToNumber', () => {
    it('should convert rating text to numbers', () => {
      expect(service['convertRatingToNumber']('One')).toBe(1);
      expect(service['convertRatingToNumber']('Five')).toBe(5);
      expect(service['convertRatingToNumber']('Unknown')).toBe(0);
    });
  });
});
