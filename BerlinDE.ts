import axios from 'axios';
import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';

const BASE_URL = 'https://www.berlin.de';
const NEWS_PATH = '/en/news/';

export async function fetchArticles() {
  const URL = `${BASE_URL}${NEWS_PATH}`;

  console.log('Fetching articles from ', URL);

  const response = await axios.get<string>(`${BASE_URL}${NEWS_PATH}`);
  return cheerio.load(response.data);
}

export function parseArticles($: CheerioAPI) {
  console.log('Parsing articles');

  // .special might include some "random" articles
  const articles = $('#hnews')
    .parent()
    .find('article')
    .not('.special')
    .map(function (_index, el) {
      const heading: Cheerio<Element> = $(el).find('.heading');

      return {
        title: heading.text(),
        link: `${BASE_URL}${heading.find('a').attr('href')}`,
      };
    })
    .toArray();

  console.log('Parsed articles: ', articles);

  return articles;
}
