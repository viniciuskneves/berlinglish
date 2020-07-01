// FIXME: For now Typescript check will be ignored
// @ts-nocheck

import cheerio from 'cheerio';
import { fetchArticles, parseArticles } from './BerlinDE';

const axios = require('axios');
const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const placeId = '3078869807f9dd36'; // Berlin's place ID

const BASE_URL = 'https://www.berlin.de';

async function postTweet({ status, media_ids }) {
  const response = await client.post('statuses/update', {
    status,
    media_ids,
    place_id: placeId,
  });

  return response;
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

exports.handler = async function handler() {
  const [articlesDocument, tweets] = await Promise.all([
    fetchArticles(),
    homeTimeline(),
  ]);
  const articles = parseArticles(articlesDocument);
  const newArticles = articles.filter(
    (article) => !tweets.includes(article.title),
  );

  const articlesWithImage = await Promise.all(
    newArticles.map(async (article) => {
      article.imageUrls = await fetchImageUrl(article.link);
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
};
