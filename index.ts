// FIXME: For now Typescript check will be ignored
// @ts-nocheck

const axios = require('axios');
const twitterClient = require('./twitterClient.ts');
const berlinNewsClient = require('./berlinNewsClient.ts');

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
  const id = await twitterClient.postImage(image);
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

exports.handler = async function handler() {
  const [articles, tweets] = await Promise.all([
    berlinNewsClient.fetchFirst3Articles(),
    twitterClient.homeTimeline(),
  ]);
  const newArticles = articles.filter(
    (article) => !tweets.includes(article.title),
  );

  const articlesWithImage = await Promise.all(
    newArticles.map(async (article) => {
      article.imageUrls = await berlinNewsClient.fetchImageUrl(article.link);
      return article;
    }),
  );

  console.log('New articles: ', articlesWithImage);

  for (const article of articlesWithImage) {
    const status = [article.title, `Read more: ${article.link}`].join('\n');
    const media_ids = await fetchImageIds(article.imageUrls);
    const response = await twitterClient.postTweet({ status, media_ids });

    console.log('Tweet response: ', response);
  }
};

exports.handler();
