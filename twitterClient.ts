const Twitter = require('twitter');

const client = new Twitter({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET_KEY,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const placeId = '3078869807f9dd36'; // Berlin's place ID

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

module.exports = {
  postTweet,
  postImage,
  homeTimeline,
};
