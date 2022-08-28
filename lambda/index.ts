import axios from "axios";
import {
  EUploadMimeType,
  TweetV1TimelineResult,
  TwitterApi,
} from "twitter-api-v2";
import {
  fetchArticle,
  fetchArticles,
  parseArticleImages,
  parseArticles,
} from "./BerlinDE";

const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

function fetchHomeTimeline() {
  console.log("Fetching home timeline");
  return client.v1.userTimelineByUsername("berlinglish");
}

function textFromTweets(tweets: TweetV1TimelineResult) {
  return tweets.map((tweet) => {
    return tweet.full_text?.split("\n")[0];
  });
}

async function uploadImage(url: string): Promise<string> {
  const { data } = await axios.get<ArrayBuffer>(url, {
    responseType: "arraybuffer",
  });
  const mediaId = await client.v1.uploadMedia(Buffer.from(data), {
    mimeType: EUploadMimeType.Jpeg,
  });

  return mediaId;
}

export async function handler() {
  const [homeTimeline, articlesPageHTML] = await Promise.all([
    fetchHomeTimeline(),
    fetchArticles(),
  ]);
  const tweets = textFromTweets(homeTimeline.tweets);
  const articles = parseArticles(articlesPageHTML);
  const newArticles = articles.filter((article) => {
    return !tweets.includes(article.title);
  });
  // We get the oldest from all new articles so we don't spam
  const oldestNewArticle = newArticles.pop();

  if (!oldestNewArticle) {
    console.log("No new article to tweet!");

    return;
  }

  console.log("New article", oldestNewArticle);

  const articleHTML = await fetchArticle(oldestNewArticle);
  const articleImagesURLs = await parseArticleImages(articleHTML);
  const mediaIds = await Promise.all(articleImagesURLs.map(uploadImage));

  const status = [
    oldestNewArticle.title,
    `Read more: ${oldestNewArticle.link}`,
  ].join("\n");

  console.log(status);

  const newTweet = await client.v1.tweet(status, {
    media_ids: mediaIds,
    place_id: "3078869807f9dd36",
  });

  console.log("New tweet", newTweet, { place_id: "3078869807f9dd36" });
}
