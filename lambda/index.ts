import { TweetV1TimelineResult, TwitterApi } from "twitter-api-v2";
import { fetchArticles, parseArticles } from "./BerlinDE";

const client = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

function textFromTweets(tweets: TweetV1TimelineResult) {
  return tweets.map((tweet) => {
    return tweet.full_text?.split("\n")[0];
  });
}

export async function handler() {
  const [homeTimeline, articlesPageHTML] = await Promise.all([
    client.v1.userTimelineByUsername("berlinglish"),
    fetchArticles(),
  ]);
  const tweets = textFromTweets(homeTimeline.tweets);
  console.log(tweets[0]);
  const articles = parseArticles(articlesPageHTML);
  const newArticles = articles.filter((article) => {
    return !tweets.includes(article.title);
  });
  // We get the oldes from all new articles so we don't spam
  const oldestNewArticle = newArticles.pop();

  if (!oldestNewArticle) {
    console.log("No new article to tweet!");

    return;
  }

  console.log("New article", oldestNewArticle);

  const status = [
    oldestNewArticle.title,
    `Read more: ${oldestNewArticle.link}`,
  ].join("\n");

  console.log(status);

  // const newTweet = await client.v1.tweet(status, {});

  // console.log("New tweet", newTweet, { place_id: "3078869807f9dd36" });
}

handler();
