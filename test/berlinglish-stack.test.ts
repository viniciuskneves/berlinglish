import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { BerlinglishStack } from "../lib/berlinglish-stack";

test.skip("BerlinglishStack", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new BerlinglishStack(app, "MyTestStack");
  // THEN
  const template = Template.fromStack(stack);
  expect(template).toMatchSnapshot();
});
