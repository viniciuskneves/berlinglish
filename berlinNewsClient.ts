const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'https://www.berlin.de';
const NEWS_PATH = '/en/news/';

async function fetchArticles() {
  const response = await axios(`${BASE_URL}${NEWS_PATH}`);
  const $ = cheerio.load(response.data);
  // .special might include some "random" articles
  const articles = $('#hnews')
    .parent()
    .find('article')
    .not('.special')
    .map(function () {
      const heading = $(this).find('.heading');
      return {
        title: heading.text(),
        link: `${BASE_URL}${heading.find('a').attr('href')}`,
      };
    })
    .toArray();

  console.log('Fetched articles: ', articles);

  return articles;
}

async function fetchFirst3Articles() {
  const articles = await fetchArticles();

  console.log('Selected 3 articles: ', articles);

  return articles.slice(0, 3);
}

async function fetchImageUrl(url) {
  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    const imageElement = $(
      '.main-content .page-mainimage,.main-content .swiper-wrapper',
    ).find('img');

    const imageURls = imageElement
      .map(
        (index, imageTag) =>
          `${BASE_URL}${
            $(imageTag).attr('data-src') || $(imageTag).attr('src')
          }`,
      )
      .toArray()
      .slice(0, 4);

    return imageURls;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  fetchFirst3Articles,
  fetchImageUrl,
};
