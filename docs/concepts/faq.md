---
title: Frequently Asked Questions
order: 3
---

# Frequently Asked Questions

:::details Why should I write unit tests when I can test the whole site with E2E tests?
It's true that you _could_ test your functionality with only E2E tests, skipping lower-level tests entirely. However,
there are clear benefits to writing unit and other lower-level tests:
- **Faster feedback**: Unit tests run much faster than E2E tests, so they are practical to run frequently during 
  development. Running E2E tests for every change is impractical and has questionable benefit over manually testing 
  the same steps.
- **Isolation**: Unit tests allow you to test individual functions, making it easier to identify the cause of a bug and where to fix it. This can be particularly useful for CMS plugins and themes that enhance or modify CMS or plugin functionality - you can narrow down whether your custom function is working correctly or if the source of the problem lies elsewhere.
:::

:::details Why should I mock dependent functions in unit tests instead of using the real ones?
Mocking dependent functions in unit tests is crucial for several reasons:
- **Speed and efficiency of setup and maintenance:** If you call real functions, you need real data. This usually  
  means either connecting to the real site or a staging site, which means one of two things:
  - You are at the mercy of ever-changing data on the real site, which can cause misleading test results, or
  - You need to set up a staging site (or at least a test database, if your tests are for non-UI functions) with 
    realistic data covering all your test cases, which is  time-consuming and requires maintenance.
- **Speed of tests:** Mocking allows tests to run as fast as possible because they don't have to execute the actual code of the dependencies. This is especially important for functions that involve network requests, database access, or other time-consuming operations.
- **Isolation:** Mocking allows you to isolate the function being tested from its dependencies, ensuring that _your 
  function_ does what it is supposed to do in given scenarios without interference from anything else. This makes it easier to narrow down the source of any unexpected results or behaviour.

Examples of use cases for unit tests with mocked functions include:
- A function that returns a different price to a customer based on their user role: Mocking the result of the function that returns the current user's role isolates the pricing logic from the user role logic, so if a customer reports that they are seeing the wrong price, you know that the problem is not in your pricing function - it may be in the user role logic or in something else that also modifies prices.
- A function that runs on an action hook provided by another plugin in WordPress: Mocking the action hook allows you to test your function without needing to set up the entire plugin and its dependencies, and helps you ensure that your function does what it's supposed to on its own - so if you find that your function is not working as expected, you can narrow down the problem more easily and with more confidence (e.g., action hook priority, changes within the plugin that you need to update your function to account for).

:::

:::details I'm not a developer - I design sites with a page builder and use existing plugins. How can I use automated testing?
[End-to-end tests](./testing-types.md#end-to-end-e2e-tests) are the most accessible and practical type of tests for non-developers and those testing implementations of CMS themes and plugins. You will need to write some code for the tests themselves, but as long as you know some basics like [selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors) and some basic JavaScript syntax, you can get started with E2E tests using tools such as [Playwright](https://playwright.dev/) or [Cypress](https://www.cypress.io/). An IDE such as [JetBrains Aqua](https://www.jetbrains.com/aqua/) can help you write and run tests without needing to set up a complex development environment, and make it easier to navigate the results of your tests.
:::

:::details How should I name my test files where should I put them?
There are multiple common conventions for where to put test files and what to name them, with some being more common than others for certain tools or languages, or in certain projects or communities. These include:
- In a `tests` or `spec` directory at the root of the project (or `__tests__`)
- In separate `tests` or `spec` directories in different parts of the project 
- Co-located with the files they test - one test file per source file

Some testing tools will look for tests in specific locations and/or with specific naming conventions out of the box, so if not or you want to use a different convention, you may need to configure the tool to find your tests. Testing frameworks like Pest, PhpUnit, Jest, Playwright, etc. all have a configuration file and/or command-line options that allow you to specify how to locate your tests.

The most important thing is to be consistent within your project and/or your team, so that you and others can easily find the tests when needed.
:::