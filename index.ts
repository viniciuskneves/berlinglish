// FIXME: For now Typescript check will be ignored
// @ts-nocheck

const axios = require('axios');
const cheerio = require('cheerio');
const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const placeId = '3078869807f9dd36'; // Berlin's place ID

const SOURCES = [
  {
    server_name: 'berlin',
    url: 'https://www.berlin.de',
    news_path: '/en/news/',
  },
  {
    server_name: 'berliner',
    url: 'https://www.berliner-zeitung.de',
    news_path: '/en/',
  },
];

async function fetchArticles(serverName, baseUrl, newsPath) {
  const response = await axios(`${baseUrl}${newsPath}`);
  const $ = cheerio.load(response.data);
  // .special might include some "random" articles

  let articles;
  if (serverName === 'berliner') {
    articles = $('.o-weekend')
      .find('.m-teaser.m-teaser--medium')
      .map(function () {
        const heading = $(this).find('.m-teaser__title.js-m-teaser__title');
        const topic = $(this)
          .find('.m-teaser__title.js-m-teaser__title')
          .find('span')
          .text();
        const url = $(this).find('.m-teaser.m-teaser--medium a');
        return {
          title: `${topic} => ${heading
            .text()
            .trim()
            .replace(topic, '')
            .replace(/\n/g, '')}`,
          link: `${baseUrl}${url.attr('href')}`,
        };
      })
      .toArray();
  } else if (serverName === 'berlin') {
    articles = $('#hnews')
      .parent()
      .find('article')
      .not('.special')
      .map(function () {
        const heading = $(this).find('.heading');
        return {
          title: heading.text(),
          link: `${baseUrl}${heading.find('a').attr('href')}`,
        };
      })
      .toArray();
  }

  console.log('Fetched articles: ', articles);

  return articles;
}

async function fetchFirst3Articles(serverName, baseURL, newsPath) {
  const articles = await fetchArticles(serverName, baseURL, newsPath);

  console.log('Selected 3 articles: ', articles);

  return articles.slice(0, 3);
}

async function postTweet({ status, media_ids }) {
  const response = await client.post('statuses/update', {
    status,
    media_ids,
    place_id: placeId,
  });
}

async function postImage(image) {
  try {
    const { media_id_string } = await client.post('media/upload', {
      media: image,
    });
    console.log('Received image ID: ', media_id_string);

    return media_id_string;
  } catch (e) {
    console.error(e);
  }
}

async function fetchImage(url) {
  try {
    const { data } = await axios.get(url, { responseType: 'arraybuffer' });

    console.log('Downloaded image: ', data);
    return data;
  } catch (e) {
    console.error(e);
  }
}

async function fetchImageId(url) {
  const image = await fetchImage(url);
  const id = await postImage(image);
  return id;
}

async function fetchImageIds(urls) {
  try {
    const ids = await Promise.all(urls.map(fetchImageId));
    return ids.join();
  } catch (e) {
    console.error(e);
  }
}

async function fetchImageUrl(serverName, url) {
  try {
    const response = await axios(url);
    const $ = cheerio.load(response.data);
    let imageElement, imageURls;
    if (serverName === 'berliner') {
      imageElement = $(
        '.figure.c-image[data-component-name="Image"]:first-child',
      ).find('img');

      imageURls = imageElement
        .map(
          (index, imageTag) =>
            `${$(imageTag).attr('src') || $(imageTag).attr('data-src')}`,
        )
        .toArray()
        .slice(0, 4);
    } else if (serverName === 'berlin') {
      imageElement = $(
        '.main-content .page-mainimage,.main-content .swiper-wrapper',
      ).find('img');
      imageURls = imageElement
        .map(
          (index, imageTag) =>
            `${SOURCES[0].url}${
              $(imageTag).attr('data-src') || $(imageTag).attr('src')
            }`,
        )
        .toArray()
        .slice(0, 4);
    }

    return imageURls;
  } catch (e) {
    console.error(e);
  }
}

async function homeTimeline() {
  try {
    const response = await client.get('statuses/user_timeline', {});
    const responseTitles = response.map((tweet) => tweet.text.split('\n')[0]);

    console.log('Last tweets titles: ', responseTitles);

    return responseTitles;
  } catch (e) {
    console.error(e);
  }
}

async function EngineStart(serverName, baseURl, newsPath) {
  const [articles, tweets] = await Promise.all([
    fetchFirst3Articles(serverName, baseURl, newsPath),
    homeTimeline(),
  ]);
  const newArticles = articles.filter(
    (article) => !tweets.includes(article.title),
  );

  const articlesWithImage = await Promise.all(
    newArticles.map(async (article) => {
      article.imageUrls = await fetchImageUrl(serverName, article.link);
      return article;
    }),
  );

  console.log('New articles: ', articlesWithImage);
  for (const article of articlesWithImage) {
    const status = [article.title, `Read more: ${article.link}`].join('\n');
    const media_ids = await fetchImageIds(article.imageUrls);
    const response = await postTweet({ status, media_ids });

    console.log('Tweet response: ', response);
  }
}

exports.handler = async function handler() {
  for (const source of SOURCES) {
    EngineStart(source.server_name, source.url, source.news_path);
  }
};
