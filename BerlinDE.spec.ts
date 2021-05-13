import * as BerlinDE from './BerlinDE';
import cheerio from 'cheerio';

describe('parseArticles', () => {
  const HTML = `
    <div>
      <h1 id="hnews">News</h1>
      <div class="block teaser">
        <div class="paragraph">The latest news, top headlines, up-to-date information and developments from Berlin. The news
          are brought to you by the Deutsche Presse-Agentur (dpa) and the BerlinOnline Stadtportal GmbH.</div>
      </div>
      <div class="block autoteaser">
        <article class="block teaser">
          <div class="image">
            <a href="/en/news/coronavirus/6221479-6098215-three-corona-test-sites-will-be-closed.en.html" target="_top"
              class="" data-campaign="cm.articles.6221479"><img
                src="/binaries/asset/image_assets/6101583/ratio_4_3/1593614477/300x225/"
                alt="Coronavirus - Abklärungsstelle bei Vivantes Prenzlauer Berg (1)" loading="lazy"></a>
            <div class="source">© dpa</div>
          </div>
          <h3 class="heading"><a href="/en/news/coronavirus/6221479-6098215-three-corona-test-sites-will-be-closed.en.html"
              target="_top" class="" data-campaign="cm.articles.6221479">Three corona test sites will be closed</a></h3>
          <p>
            In Berlin, three corona test stations have been closed since Wednesday. The facilities in Prenzlauer Berg,
            Tempelhof-Schöneberg, and Lichtenberg are affected.
            <a href="/en/news/coronavirus/6221479-6098215-three-corona-test-sites-will-be-closed.en.html" target="_top"
              class="readmore" title="Three corona test sites will be closed" data-campaign="cm.articles.6221479">more</a>
          </p>
        </article>
        <article class="block teaser">
          <div class="image"><a href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html"
              target="_top" class="" data-campaign="cm.articles.6219440"><img
                src="/binaries/asset/image_assets/6219438/ratio_4_3/1593586449/300x225/" alt="Michael Müller (SPD)"
                loading="lazy"></a>
            <div class="source">© dpa</div>
          </div>
          <h3 class="heading"><a
              href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html" target="_top"
              class="" data-campaign="cm.articles.6219440">Berlin: Free corona tests for all are possible</a></h3>
          <p>
            Berlin&#039;s governing mayor Michael Müller stated, that free corona tests for everyone are possible - at least
            in the medium term.
            <a href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html" target="_top"
              class="readmore" title="Berlin: Free corona tests for all are possible"
              data-campaign="cm.articles.6219440">more</a></p>
        </article>
      </div>
    </div>
  `;
  const specialHTML = `
    <div>
      <h1 id="hnews">News</h1>
      <div class="block teaser">
        <div class="paragraph">The latest news, top headlines, up-to-date information and developments from Berlin. The news
          are brought to you by the Deutsche Presse-Agentur (dpa) and the BerlinOnline Stadtportal GmbH.</div>
      </div>
      <div class="block autoteaser">
        <article class="block teaser">
          <div class="image">
            <a href="/en/news/coronavirus/6221479-6098215-three-corona-test-sites-will-be-closed.en.html" target="_top"
              class="" data-campaign="cm.articles.6221479"><img
                src="/binaries/asset/image_assets/6101583/ratio_4_3/1593614477/300x225/"
                alt="Coronavirus - Abklärungsstelle bei Vivantes Prenzlauer Berg (1)" loading="lazy"></a>
            <div class="source">© dpa</div>
          </div>
          <h3 class="heading"><a href="/en/news/coronavirus/6221479-6098215-three-corona-test-sites-will-be-closed.en.html"
              target="_top" class="" data-campaign="cm.articles.6221479">Three corona test sites will be closed</a></h3>
          <p>
            In Berlin, three corona test stations have been closed since Wednesday. The facilities in Prenzlauer Berg,
            Tempelhof-Schöneberg, and Lichtenberg are affected.
            <a href="/en/news/coronavirus/6221479-6098215-three-corona-test-sites-will-be-closed.en.html" target="_top"
              class="readmore" title="Three corona test sites will be closed" data-campaign="cm.articles.6221479">more</a>
          </p>
        </article>
        <article class="block teaser">
          <div class="image"><a href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html"
              target="_top" class="" data-campaign="cm.articles.6219440"><img
                src="/binaries/asset/image_assets/6219438/ratio_4_3/1593586449/300x225/" alt="Michael Müller (SPD)"
                loading="lazy"></a>
            <div class="source">© dpa</div>
          </div>
          <h3 class="heading"><a
              href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html" target="_top"
              class="" data-campaign="cm.articles.6219440">Berlin: Free corona tests for all are possible</a></h3>
          <p>
            Berlin&#039;s governing mayor Michael Müller stated, that free corona tests for everyone are possible - at least
            in the medium term.
            <a href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html" target="_top"
              class="readmore" title="Berlin: Free corona tests for all are possible"
              data-campaign="cm.articles.6219440">more</a></p>
        </article>
        <article class="block teaser special">
          <div class="image"><a href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html"
              target="_top" class="" data-campaign="cm.articles.6219440"><img
                src="/binaries/asset/image_assets/6219438/ratio_4_3/1593586449/300x225/" alt="Michael Müller (SPD)"
                loading="lazy"></a>
            <div class="source">© dpa</div>
          </div>
          <h3 class="heading"><a
              href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html" target="_top"
              class="" data-campaign="cm.articles.6219440">Berlin: Free corona tests for all are possible</a></h3>
          <p>
            Berlin&#039;s governing mayor Michael Müller stated, that free corona tests for everyone are possible - at least
            in the medium term.
            <a href="/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html" target="_top"
              class="readmore" title="Berlin: Free corona tests for all are possible"
              data-campaign="cm.articles.6219440">more</a></p>
        </article>
      </div>
    </div>
  `;

  it('gets article title and link', () => {
    const $ = cheerio.load(HTML);
    const expected = [
      {
        title: 'Three corona test sites will be closed',
        link: 'https://www.berlin.de/en/news/coronavirus/6221479-6098215-three-corona-test-sites-will-be-closed.en.html',
      },
      {
        title: 'Berlin: Free corona tests for all are possible',
        link: 'https://www.berlin.de/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html',
      },
    ];
    const parseArticles = BerlinDE.parseArticles($);

    expect(parseArticles).toEqual(expected);
  });

  it('ignores .special articles', () => {
    const $ = cheerio.load(specialHTML);
    const expected = [
      {
        title: 'Three corona test sites will be closed',
        link: 'https://www.berlin.de/en/news/coronavirus/6221479-6098215-three-corona-test-sites-will-be-closed.en.html',
      },
      {
        title: 'Berlin: Free corona tests for all are possible',
        link: 'https://www.berlin.de/en/news/coronavirus/6219440-6098215-mueller-stellt-coronatests-fuer-alle-in-.en.html',
      },
    ];
    const parseArticles = BerlinDE.parseArticles($);

    expect(parseArticles).toEqual(expected);
  });
});
