import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';

const BASE_URL = 'https://www.berlin.de';
const NEWS_PATH = '/en/news/';

export async function fetchArticles(): Promise<Array<BerlinDEArticle>> {
  const response: AxiosResponse<string> = await axios(
    `${BASE_URL}${NEWS_PATH}`,
  );
  const $: CheerioStatic = cheerio.load(response.data);
  // .special might include some "random" articles
  const articles: Array<BerlinDEArticle> = $('#hnews')
    .parent()
    .find('article')
    .not('.special')
    .map(function (_index, el) {
      const heading: Cheerio = $(el).find('.heading');

      return {
        title: heading.text(),
        link: `${BASE_URL}${heading.find('a').attr('href')}`,
      };
    })
    .toArray();

  console.log('Fetched articles: ', articles);

  return articles;
}

export function example(num1: number, num2: number): number {
  return num1 + num2;
}
