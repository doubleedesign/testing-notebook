---
title: Testing Types
position: 2
---

# Testing Types

Testing type terminology can vary slightly between different types of projects, and there can be some overlap between them. Below are the definitions adopted throughout this site, along with an overview of use cases and some of the tooling commonly used for each type of test.

:::tip
In most projects where you are writing custom code, it is common to use more than one type of test - even for the same feature.

For example, if you are customising pricing calculations for an eCommerce site, you might write unit tests for the logic of the calculation function, and end-to-end tests to ensure that the calculation is correctly applied in the checkout flow without interference from other plugin or theme code.

You might also find the [FAQ](./faq.md) section helpful for determining which type of test to use for a specific scenario.
:::

[[toc]]

## Unit tests

Unit tests are for testing individual functions or methods in isolation. Unit tests are run using a Command Line Interface (CLI) tool, or IDE-integrated plugin (that is effectively using the CLI under the hood, with added features).

Unit tests are typically the simplest to write and the fastest to run, as they focus on small, isolated pieces of code. They do not require a browser and do not generally  test the interaction between different features. (If your unit tests are slow to run or require complex setup, that may be a sign that they're trying to do too much, and should either be split into smaller tests or refactored into a more suitable type of test.)

The scope of unit tests can depend on the language or framework your code is written in. For example, you can emulate quite a lot of browser-like behaviour in unit tests for client-rendered UI components built with JavaScript, but server-rendered ones generated using PHP you can really only test what gets rendered, not interaction or state changes.

:::info Unit vs integration tests
When we get into [mocking and stubbing](./mocking.md), you might wonder where the line is drawn between unit and integration tests because mocking the result of a function from the CMS or a plugin is surely not _isolated_ and is testing an _integration_, right?

Unit tests are focused on testing the logic of a specific function or method, and should mock the results of other functions that impact the logic of the function being tested (and no others), and we should never call the real function from the CMS or plugin because that would mean the test is no longer an isolated unit test. Conversely, in integration tests we might call the real functions from the CMS or other plugins to ensure that our understanding of how they work is correct.
:::

:::info Unit vs component tests for UI
Unit tests are focused on testing the logic of a specific function or method, which _can_ include testing the logic of a function that generates a UI component. The distinction drawn here is that component tests are run in a real browser environment, where you can see and interact with the rendered component, while unit tests are not. You can see a more detailed comparison of unit and component tests in the [Component tests](#component-tests) section below.
:::

Unit tests are used extensively for testing non-UI code, such as back-end logic and data processing. For example, if you are developing a WordPress plugin for anything other than pure UI components, you will likely write unit tests for the logic of your plugin's functions, such as data processing, calculations, transformations, or API interactions.

:::details Use cases for unit tests
You might want to use unit tests when you are:
- Developing a plugin for a CMS, and you want to test the logic of a specific function or method
  e.g., a custom function that calculates a discount based on given criteria
- Adding custom functions that modify a result or output or your CMS or a plugin
  e.g., functions that run on WordPress action hooks, or modify output using filters
- Adding custom functions for data retrieval, processing, or output
  e.g., a custom function that formats the results of a query to a third-party API
- Developing custom template parts for a CMS theme, and you want to test things like the HTML output or the logic 
  that decides some text
- Unit-level accessibility testing 
  e.g., inspecting the HTML returned from a template function for correct HTML structure, ARIA attributes and 
    roles, etc.
:::

:::details Tooling for unit tests
The language (and framework, if applicable) of the code you are testing determines the specific tools available for writing and running unit tests. Examples include:

**For PHP:**
- [PHPUnit](https://phpunit.de/)
- [Pest](https://pestphp.com/)
- [Codeception](https://codeception.com/docs/05-UnitTests)

**For JavaScript:**
- [Jest](https://jestjs.io/)
- [Vitest](https://vitest.dev/)
- [Mocha](https://mochajs.org/)

You will often use these tools in conjunction with libraries for [mocking/stubbing](./mocking.md), assertions, and other testing utilities. Examples include:

**For PHP:**
- [Mockery](http://docs.mockery.io/en/stable/)
- [Patchwork](https://github.com/antecedent/patchwork)
- [BrainMonkey](https://github.com/Brain-WP/BrainMonkey) (WordPress-specific)
- [WP_Mock](https://github.com/10up/wp_mock) (WordPress-specific)

**For JavaScript:**
- [@testing-library](https://testing-library.com)
- [Sinon](https://sinonjs.org/)
- [Chai](https://www.chaijs.com/)

:::

## Component tests

:::note Definition
_Component_ is a broad term in software. Throughout this site, the term **component** is used to refer to a **user interface component**, i.e., a piece of the UI that is rendered on the front-end of your website. Depending on the ecosystem you're in, these might also be referred to as _template parts_, _partials_, _blocks_, _content modules_, or similar.
:::

A **component test** is a type of test that focuses on the behaviour and rendering of a specific user interface component in a web application. It is designed to verify that the component behaves as expected when rendered in a browser and interacted with by a user.

Component testing sits in between unit and integration tests conceptually, and can share use cases and tooling with both. A component test looks at a single component in isolation (like a unit test), but also tests interaction and is run in a browser (like an integration test). Like unit tests, component tests use placeholder/mocked data, rather than real data from a live API or database.

:::info Component vs unit tests
Both unit and component tests look at a single component in isolation and typically use placeholder or mocked data. Some unit testing tools can also test interaction, so you may be wondering where the line is drawn between unit and component tests. 

In this guide, the term **unit test** is reserved specifically for tests _not_ run in a real browser environment that you can see and interact with (not counting emulators like JSDOM). **Component test** is used to describe an isolated component test that is run in a real browser environment, where you can see and interact with the rendered component.
:::

Based on my own experience with [Pest](https://pestphp.com/), [Jest](https://jestjs.io/) + [@testing-library](https://testing-library.com), and admittedly less experience with [Playwright](https://playwright.dev/), [Cypress](https://www.cypress.io/) and [Storybook Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing), the pros and cons of component tests compared to unit tests are:

| Unit tests                                                                    | Component tests                                                                             |
|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| :white_check_mark: Very fast to run                                           | :no_entry: Slower to run                                                                    |
| :white_check_mark: Minimal setup effort                                       | :no_entry: High setup effort                                                                |
| :white_check_mark: [Coverage reporting](./coverage.md) for any language       | :no_entry: [Coverage reporting](./coverage.md) limited to client-side code                  |
| :no_entry: No interaction testing for PHP-rendered components                 | :white_check_mark: Interaction testing regardless of source language                        |
| :no_entry: Hard or not possible to debug UI issues                            | :white_check_mark: Debug real UI in a real browser                                          |
| :no_entry: No visual testing                                                  | :white_check_mark: Visual regression testing possible                                       |
| :no_entry: Different tooling for different types of source code               | :white_check_mark: Can use the same tooling regardless of source code                       |
| :no_entry: Not intended for testing integration of components with each other | :white_check_mark: Can use the same environment and tools for component integration testing |


:::details Use cases for component tests
You might want to use component tests when you are:
- Developing a theme or plugin for a CMS that includes custom user interface components
- Developing or modifying custom front-end components/template parts that you need to test in isolation
- Testing behaviour of a specific UI component, particularly when unit testing is not possible or sufficient
:::

:::details Tooling for component tests
Component testing shares its tooling with UI integration tests, because usually the only difference is the scope of what you're testing. Examples include:
- [Playwright](https://playwright.dev/)
- [Cypress](https://www.cypress.io/)
- [Selenium](https://www.selenium.dev/)
- [Storybook](https://storybook.js.org/docs/writing-tests)
:::

## Visual Regression (VR) tests

Visual regression tests involve checking the visual appearance of a user interface against a baseline to ensure that no unintended changes have occurred. They compare screenshots of the current UI with previously approved versions, highlighting any _visual_ differences. 

This means, for example, that if you change some CSS for spacing from `padding` on child items to `grid-gap` on a parent, the visual regression test will only catch it if the final visual appearance of the component changes. If the spacing is still visually the same, the test will pass, even though the underlying code has changed.

In terms of the [testing pyramid](./pyramid.md), where VR tests fit depends on what you're taking screenshots of. VR testing shares tooling and use cases with all other kinds of browser-based testing (component, integration, and end-to-end). The difference is that VR tests look solely at the visual appearance at a static point in time, and do not test behaviour or interaction.

:::details Use cases for visual regression tests
You might want to use visual regression tests when you are:
- Developing or modifying custom front-end components/blocks/template parts
- When you’ve inherited a site and want to streamline ensuring your template and styling modifications modify what you expect throughout the site, and don’t have any unintended consequences 
- Monitoring client sites - e.g., running a scheduled script to notify you of visual changes that might require your attention
:::

:::details Tooling for visual regression tests
There are several tools available for writing and running visual regression tests, and these are generally independent of the language or framework your code is written in because you are using them to visit a webpage in the browser, not interact with the code. Examples include:
- [Playwright](https://playwright.dev/)
- [Storybook with Chromatic](https://www.chromatic.com/storybook) (note: third-party service)
:::

## Integration tests

Integration tests are designed to test how different parts of a system work together. In the context of front-end web development, this means testing combinations of UI components, or the interaction between parts of the front-end and the relevant back-end APIs or functions.

Front-end integration tests can be run in a browser, or using a headless browser (a browser that runs in the background, without a graphical user interface you can see). For back-end integrations, such as testing integration with a database or an API, integration tests may be run using a Command Line Interface (CLI) tool or an equivalent IDE plugin.

:::info Integration vs end-to-end tests
The line between integration and end-to-end tests can be blurry, as both types of tests can involve multiple components and interactions and often use the same tooling. You might be testing the _integration_ of your code with that of a plugin in your CMS, but the only way you can practically do that is with a dev or staging site, which moves it into the realm of _end-to-end_ testing. 

Consequently, you may see these terms used interchangeably, or referred to by the name of the main tool used to avoid confusion within a team (e.g, "Playwright tests" or "Cypress tests"). 

For front-end development, one distinctive feature could be whether you're fetching and rendering real data from a live API or database (end-to-end test), or using mocked/demo/example data (integration test).

Integration tests typically take up more of the testing pyramid than E2E than as shown in [mine](./pyramid.md), but for CMS-driven sites the practical opportunities for integration testing beyond UI components are very limited - usually we're either testing single pieces in isolation (unit and components tests), or we're testing them in a full website. If you have unit tests, then setting up integration of plugins and parts of the CMS just for testing is usually not worth the effort compared to just doing the same thing as an end-to-end test in a dev/staging site. That said, there may be some situations where you use integration tests instead of unit tests because they strike a balance between speed and real-world data; when using something like WordPress it is rare to use unit and integration without end-to-end (or manual testing the same cases E2E would cover), because of all the other factors that can impact the final result on the full website.
:::

:::details Use cases for integration tests
You might want to use integration tests when you are:
- Developing a plugin or theme for a CMS, and you need to test how your code responds to the result of the functions it calls from the CMS or other plugins
- Developing or modifying custom front-end components/template parts that you need to test in combination with other components to form a layout
:::

:::details Tooling for integration tests
There are several tools available for writing and running integration tests, and for the front-end these are generally independent of the language or framework your code is written in because you are using them to visit a webpage in the browser,  not interact with the code. Examples include:
- [Playwright](https://playwright.dev/)
- [Cypress](https://www.cypress.io/)
- [Selenium](https://www.selenium.dev/)
- [Storybook](https://storybook.js.org/docs/writing-tests)

Back-end/API integration testing often shares tooling with unit tests, so is more likely to be language- and framework-specific. For example, you could use [PHPUnit](https://phpunit.de/) or [Pest](https://pestphp.com/) for PHP and write your tests very similarly to unit tests, except instead of using [mocked/stubbed data](./mocking.md) you would configure it to connect to a real site.
:::

## End-to-end (E2E) tests

End-to-end tests are designed to test the entire application flow, from the user's perspective. They simulate real user interactions with the website,  such as clicking buttons, filling out forms, and navigating between pages. E2E tests are typically run in a real browser or a headless browser, visiting the actual website (or a staging copy!) and  performing actions as a user would.

:::tip
If you are not writing any custom code, end-to-end tests are usually the best go-to for a CMS-driven website. For example, if you have pieced together a WordPress site with a theme and some plugins from various vendors, testing user journeys through your actual website is probably the best use of your testing time and resources.

Unit and integration testing is generally the domain of the developer, so if you do want to test at a lower level you should first check if tests have been included in the codebase.
:::

:::info
E2E tests take up more of [my testing pyramid](./pyramid.md) than they typically do in more general testing advice. This is because in the context of CMS-driven sites, separating out the relevant parts of the CMS and/or plugins to do integration tests is often not practical - doing the same things in an E2E test in a dev/staging site is usually easier and achieves the same goal. 

E2E testing is also the most accessible for non-developers who are using third-party themes and plugins, as well as being practical for developers integrating with third-party plugins.
:::

:::details Use cases for end-to-end tests
- Developing or modifying the behaviour/result of a CMS plugin
  e.g., testing the whole product selection and checkout flow in a WooCommerce site
- Implementing a third-party plugin(s)
  e.g., testing that calculated fields in a form plugin return the correct result
- Monitoring client sites
  e.g., running a scheduled script to check that key functionality is still working
- Accessibility testing
  e.g., overall page structure, colour contrast, keyboard navigation, information screen readers will see
:::

:::details Tooling for end-to-end tests
There are several tools available for writing and running end-to-end tests, and these are generally independent of the language or framework your code is written in because you are using them to visit a live website, not interact with the code. Examples include:
- [Playwright](https://playwright.dev/)
- [Cypress](https://www.cypress.io/)
- [Selenium](https://www.selenium.dev/)
- [Symfony Panther](https://symfony.com/doc/current/components/panther.html)
:::
