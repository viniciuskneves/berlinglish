![GitHub Actions Badge](https://github.com/viniciuskneves/berlinglish/workflows/CI/badge.svg)

# Berlinglish

Berlin in English Twitter BOT. It fetches news from https://www.berlin.de/en/news/ and Tweets to [@Berlinglish](https://twitter.com/berlinglish).

## Setup

### Requirements

- Node.js: v12
  - Recommendation: [NVM](https://github.com/nvm-sh/nvm)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html): Only for deployment

### Installing dependencies

```bash
npm install
```

### Environment variables

The following environment variables need to be present:

#### Twitter

| API key         | API secret key         | Access token         | Access token secret         |
| --------------- | ---------------------- | -------------------- | --------------------------- |
| TWITTER_API_KEY | TWITTER_API_SECRET_KEY | TWITTER_ACCESS_TOKEN | TWITTER_ACCESS_TOKEN_SECRET |

## Usage

```bash
npm start
```

## Deployment

**Requires all the [Twitter environment variables](#Twitter) to be exported**

```bash
npm run deploy
```

## Contributing

Please, check open issues. There are not guidelines so far 😅

## License

[MIT](LICENSE)
