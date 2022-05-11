# AWS CDK v2 Typescript template

This template is an opinionated template on top of AWS CDK v2 default Typescript template.

It adds:
- Linting through ESLint with Prettier and Typescript;
- Git hooks through Husky (before commit and before push);
- CI/CD through GitHub Actions;
- Node 14 as default through `.nvmrc` and `tsconfig.json`;
- Dependabot to update dependencies (NPM and Actions);

**Rename files, especially the stack file, in order to bring a better naming to your project.**

## Available commands

- `npm test`: runs Jest
- `cdk:synth`: shorthand to `cdk synth`
- `cdk:deploy`: shorthand to `cdk deploy --all`
- `lint`: runs ESLint with some configuration
- `lint:fix`: same as `lint` but `--fix` is applied
