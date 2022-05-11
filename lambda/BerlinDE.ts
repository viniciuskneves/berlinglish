import axios from "axios";
import { Cheerio, CheerioAPI, Element, load } from "cheerio";

const BASE_URL = "https://www.berlin.de";

export async function fetchArticles(): Promise<CheerioAPI> {
  const URL = `${BASE_URL}/en/news/`;

  console.log("Fetching articles from ", URL);

  const response = await axios.get<string>(URL);

  return load(response.data);
}

export function parseArticles(
  $: CheerioAPI
): { title: string; link: string }[] {
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
