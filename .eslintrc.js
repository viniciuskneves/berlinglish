module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    // Extends https://github.com/jest-community/eslint-plugin-jest/blob/main/src/rules/expect-expect.ts#L55 with template expects
    // Template expects are defined here: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Template.html
    "jest/expect-expect": [
      "warn",
      { assertFunctionNames: ["expect", "template.**"] },
    ],
  },
};
