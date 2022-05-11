import { Stack, StackProps } from "aws-cdk-lib";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class BerlinglishStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new NodejsFunction(this, "BerlinglishLambdaFunction", {
      entry: "./lambda/index.ts",
      bundling: {
        format: OutputFormat.ESM,
      },
    });
  }
}
