---
title: Mocking and stubbing
order: 6
---

# Mocking and stubbing

Mocking and stubbing are techniques used in unit and component testing to create a simulated version of an object or function, and/or have a function return a specific result. This allows you to isolate the code being tested from its dependencies, enabling you to focus on the behavior of the code itself.

Mocking and stubbing is part of the **arrange** step in the [Arrange-Act-Assert (AAA) test pattern](./patterns.md), where you set up the conditions for your test. It is a way of setting up your scenario, for example "If this other function returns this value..."

[[toc]]

## Terminology

:::note Definitions
I tend to use the terms "mock" and "mocking" as an umbrella term for all types of test doubles, and you may see "mocking and stubbing" used as a general term in other testing guides as well as other terms like "monkey patching" and "spies". There are some subtle differences in the technical definitions of these terms:

- **Stubs**: Replacements used to provide predefined responses to function/method calls.
- **Mocks**: More sophisticated test doubles that can also verify interactions, such as how many times a function/method was called and the arguments used.
- **Spies**: A type of mock that records information about how a function/method was called, but does not redefine any behavior of the function/method.
- **Monkey patching**: A type of stubbing that replaces the function/method at runtime.
- **Dependency injection**: A technique where dependencies are passed into a function or class, allowing you to replace them with some kind of test double.
:::

:::important
One of the main reasons we use mocking, stubbing, and related "test doubles" is that it is _not_ the responsibility of your unit or component test to cover the implementation details of all the external functions called within the function(s) or classes that you are testing. Those other functions should have their _own_ tests to ensure that they work as intended.

In some cases, you will combine unit testing with integration or end-to-end testing to ensure that the entire system works together as expected, which will help you confirm that your mock implementation for unit tests is correct.
:::

Below is some general information about how to set up and use mocks/stubs/etc in various situations. More specific 
examples and use cases can be found in the [Examples](../examples/overview.md) and [Case Studies](../case-studies/overview.md) sections.

## In PHP unit tests (General)

### Patchwork

[Patchwork](https://antecedent.github.io/patchwork/) is an easy-to-use library for replacing **global functions** and static methods with fake test versions in PHP. It allows you to override the behavior of functions during tests. It doesn't require any global setup or teardown, making it easy to use for individual test cases and very practical for mocking procedural code.

:::note
Example to come
:::

### Mockery

[Mockery](https://docs.mockery.io/en/stable/) is a powerful mocking library for PHP that allows you to create mock **objects** and set expectations on them. It is particularly useful for testing complex **classes** that you need to instantiate (as opposed to testing just static methods) as it allows you to create mock objects with just the relevant methods and properties, as well as providing ways to handle protected and private methods.

:::note
Example to come
:::

## In PHP unit tests (WordPress)

Patchwork and Mockery can both be used in unit tests for WordPress plugin and theme PHP code, but there are also some WordPress-specific libraries that can be used to simplify handling of WordPress's hook system and common WordPress functions.

[BrainMonkey](https://giuseppe-mazzapica.gitbook.io/brain-monkey) and [WP_Mock](https://wp-mock.gitbook.io/documentation) are libraries that use Patchwork and Mockery under the hood, but provide additional features for WordPress-specific testing such as support for actions and filters and built-in mocks for common WordPress functions so you don't have to worry about tests failing because you didn't mock something like `wp_json_encode`.

I came across BrainMonkey first and really like its syntax for mocking/patching functions, but I'm also trying WP_Mock in some of my current projects. You can find more information in the dedicated [BrainMonkey vs WP_Mock](../tooling/brainmonkey-vs-wpmock.md) article.

## In JavaScript unit tests

There are a number of ways to mock functions in JavaScript unit tests, depending on the testing framework you are 
using. Examples include:

### Jest mocks

[Jest](https://jestjs.io/docs/mock-functions) provides built-in support for mocking functions, including the ability to create mock functions that can be used to replace real functions in your code. Jest's mock functions can be used to track calls, arguments, and return values.

:::note
Example to come
:::

### React Magnetic DI

If you're testing React components, you can use [React Magnetic DI](https://github.com/albertogasparin/react-magnetic-di) to replace dependencies with test versions. This library allows you to create a dependency injection container that can be used to provide mock implementations of your components' dependencies during tests. A bonus of this approach is that it can also be used in component tests, making it easy to share code and reduce context switching when working with both unit and component tests.

:::note
Example to come
:::


## In component tests

:::note
Content still to come.
:::