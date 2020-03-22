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

const BASE_URL = 'https://www.berlin.de';
const NEWS_PATH = '/en/news/';

async function fetchArticles() {
  const response = await axios(`${BASE_URL}${NEWS_PATH}`);
  const $ = cheerio.load(response.data);
  // .special might include some "random" articles
  const articles = $('#hnews').parent().find('article').not('.special').map(function() {
    const heading = $(this).find('.heading');
    return {
      title: heading.text(),
      link: `${BASE_URL}${heading.find('a').attr('href')}`,
    };
  }).toArray();

  console.log('Fetched articles: ', articles);

  return articles;
}

async function fetchFirst5Articles() {
  const articles = await fetchArticles();

  console.log('Selected 5 articles: ', articles);

  return articles.slice(0,5);
}

async function postTweet(status) {
  const response = await client.post('statuses/update', {
    status,
    place_id: placeId,
  });

  return response;
}

async function homeTimeline() {
  try {
    const response = await client.get('statuses/user_timeline', {});
    const responseTitles = response.map((tweet) => tweet.text.split('\n')[0]);

    console.log('Last tweets titles: ', responseTitles);
    
    return responseTitles;
  } catch(e) {
    console.error(e);
  }
}

exports.handler = async function handler() {
  const [articles, tweets] = await Promise.all([fetchFirst5Articles(), homeTimeline()]);
  const newArticles = articles.filter(article => !tweets.includes(article.title));

  console.log('New articles: ', newArticles);

  for (const article of newArticles) {
    const response = await postTweet([
      article.title,
      `Read more: ${article.link}`,
    ].join('\n'));

    console.log('Tweet response: ', response);
  }
};
