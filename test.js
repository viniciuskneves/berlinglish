const test = require('ava');

const { fetchImageUrl } = require('./index.ts');

test('article with one image', async (t) => {
  const singleImageArticle =
    'https://www.berlin.de/en/news/coronavirus/6122241-6098215-coronavirus-restrictions-longer-stay-in-.en.html';
  const imageUrls = await fetchImageUrl(singleImageArticle);
  t.deepEqual(imageUrls, [
    'https://www.berlin.de/binaries/asset/image_assets/5728148/source/1585295926/624x468/',
  ]);
});

test('article with multiple images', async (t) => {
  const multipleImageArticle =
    'https://www.berlin.de/en/news/6178121-5559700-tegel-airport-likely-to-be-temporarily-c.en.html';
  const imageUrls = await fetchImageUrl(multipleImageArticle);
  t.deepEqual(imageUrls, [
    'https://www.berlin.de/binaries/asset/image_assets/6178119/source/1589965637/624x468/',
    'https://www.berlin.de/binaries/asset/image_assets/6124873/source/1589965639/624x468/',
    'https://www.berlin.de/binaries/asset/image_assets/6173153/source/1589965641/624x468/',
    'https://www.berlin.de/binaries/asset/image_assets/6155433/source/1589965642/624x468/',
  ]);
});

test('bar', async (t) => {
  const bar = Promise.resolve('bar');
  t.is(await bar, 'bar');
});
