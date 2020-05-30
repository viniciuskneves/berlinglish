const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { fetchImageUrl } = require('./berlinNewsClient.ts');

jest.mock('axios');

test('article with one image', async () => {
  const singleImageHtml = fs.readFileSync(
    path.resolve(__dirname, 'singleArticlePage.html'),
    'utf-8',
  );

  axios.mockImplementationOnce(() =>
    Promise.resolve({ data: singleImageHtml }),
  );

  const singleImageArticle =
    'https://www.berlin.de/en/news/coronavirus/6122241-6098215-coronavirus-restrictions-longer-stay-in-.en.html';
  const imageUrls = await fetchImageUrl(singleImageArticle);

  expect(imageUrls).toEqual([
    'https://www.berlin.de/binaries/asset/image_assets/5728148/source/1585295926/624x468/',
  ]);
});

/* test('article with multiple images', async () => {
  const multipleImageArticle =
    'https://www.berlin.de/en/news/6178121-5559700-tegel-airport-likely-to-be-temporarily-c.en.html';
  const imageUrls = await fetchImageUrl(multipleImageArticle);
  expect(imageUrls).toEqual([
    'https://www.berlin.de/binaries/asset/image_assets/6178119/source/1589965637/624x468/',
    'https://www.berlin.de/binaries/asset/image_assets/6124873/source/1589965639/624x468/',
    'https://www.berlin.de/binaries/asset/image_assets/6173153/source/1589965641/624x468/',
    'https://www.berlin.de/binaries/asset/image_assets/6155433/source/1589965642/624x468/',
  ]);
}); */
