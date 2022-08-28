import axios from "axios";
import { Cheerio, CheerioAPI, Element, load } from "cheerio";

type Article = { title: string; link: string };

const BASE_URL = "https://www.berlin.de";

export async function fetchArticles(): Promise<CheerioAPI> {
  const URL = `${BASE_URL}/en/news/`;

  console.log("Fetching articles from ", URL);

  const response = await axios.get<string>(URL);

  return load(response.data);
}

export async function fetchArticle(article: Article): Promise<CheerioAPI> {
  console.log("Fetching article ", article.link);

  const response = await axios.get<string>(article.link);

  return load(response.data);
}

export function parseArticles($: CheerioAPI): Article[] {
  console.log("Parsing articles");

  const articles = $("#hnews")
    .parent()
    .find("article")
    .not(".special")
    .map((_index, el) => {
      const heading: Cheerio<Element> = $(el).find(".heading");

      return {
        title: heading.text(),
        link: `${BASE_URL}${heading.find("a").attr("href")}`,
      };
    })
    .toArray();

  console.log("Parsed articles", articles);

  return articles;
}

export function parseArticleImages($: CheerioAPI): string[] {
  console.log("Parsing article");

  const images = $(
    ".main-content .page-mainimage,.main-content .swiper-wrapper"
  ).find("img");
  const URLs = images
    .map((_index, el) => {
      const dataSrc = $(el).attr("data-src"); // Lazy loaded images
      const src = $(el).attr("src") as string; // Type casting as we assume every image has a src
      const path = dataSrc || src;

      return `${BASE_URL}${path}`;
    })
    .toArray();

  return URLs;
}
