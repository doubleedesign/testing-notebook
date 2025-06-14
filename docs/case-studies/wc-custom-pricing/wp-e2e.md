---
title: "Part 3: E2E Testing"
heading: "E2E testing on the front-end of a WordPress site"
order: 3
status: drafting
source_lang: [PHP]
test_type: [E2E]
test_tools: [Playwright]
sidebarDepth: 0
---

[[toc]]

## Prerequisites

If you aren't already using JavaScript dependencies or build tools in the project ypu want to test, you will need to ensure that you have:
- [Node.js](https://nodejs.org/en/download/) installed on your machine and available on the command line
- A `package.json` file in the root of your project (you can create one by running `npm init -y` in the terminal). 

To prepare for end-to-end testing using Playwright, you will also need at least one browser installed on your machine in the location that Playwright expects to find it. In this case study I have used Firefox, which you can install for Playwright by running the following command in the terminal:

```bash
npx playwright install firefox
```

**Note:** You still need to do this even if you already have Firefox installed on your machine, as it needs to be a version that Playwright can work with.

## Setup

If you are following the case study and using the `demo-custom-pricing` plugin, the dependencies are already specified in `package.json` - you just need to install them locally:

```bash
npm install
```

Otherwise, in the root of your project, install Playwright and its dependencies:

```bash
npm install --save-dev @playwright/test
```

:::details If you are using TypeScript in your test files

If you will use TypeScript when writing your test files, you will also need to install TypeScript and the Node.js type definitions as dev dependencies:

```bash
npm install --save-dev typescript @types/node
```

and set up a basic `tsconfig.json file. You can find an example of this in the [demo-custom-pricing plugin in the case study repository](https://github.com/doubleedesign/demo-dance/tree/master/wp-content/plugins/demo-custom-pricing).
:::

You will also need a Playwright config file, such as the `playwright.config.js` file that can be found in the [plugin in the case study repository](https://github.com/doubleedesign/demo-dance/blob/master/wp-content/plugins/demo-custom-pricing/playwright.config.ts). 

A key part of the config is setting the test directory, match pattern, and base URL of your dev/staging site:

```typescript
export default defineConfig({
    testDir: resolve(__dirname, '__tests__', 'e2e'),
    testMatch: '*.spec.ts',
    use: {
        baseURL: 'https://demo-dance.test'
    },
    // ...other config options
});
```

## Writing tests

:::note
More content to come
:::