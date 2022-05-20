import { Stack, StackProps } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class BerlinglishStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaFunction = new NodejsFunction(
      this,
      "BerlinglishLambdaFunction",
      {
        functionName: "Berlinglish",
        entry: "./lambda/index.ts",
        // bundling: {
        //   format: OutputFormat.ESM,
        // },
        environment: {
          TWITTER_APP_KEY: process.env.TWITTER_APP_KEY!,
          TWITTER_APP_SECRET: process.env.TWITTER_APP_SECRET!,
          TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN!,
          TWITTER_ACCESS_SECRET: process.env.TWITTER_ACCESS_SECRET!,
        },
      }
    );

    new Rule(this, "BerlinglishCron", {
      ruleName: "Berlinglish",
      schedule: Schedule.cron({
        minute: "0",
        hour: "7,9,13,15", // Trying 4x a day. It runs UTC so currently CEST is UTC+2 --> 9,11,15,17
      }),
      targets: [new LambdaFunction(lambdaFunction)],
    });
  }
}
