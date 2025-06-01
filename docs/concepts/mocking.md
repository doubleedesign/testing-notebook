---
title: Mocking
order: 6
---

# Mocking

Mocking is a technique used in unit and component testing to create a simulated version of an object or function. This 
allows you to isolate the code being tested from its dependencies, enabling you to focus on the behavior of the code itself.

Mocking is part of the **arrange** step in the [Arrange-Act-Assert (AAA) test pattern](./patterns.md), where you set up the conditions for your test. It is a way of setting up your scenario: "If this other function returns this value".

:::important
It is _not_ the responsibility of your unit or component test to cover the implementation details of all the external functions called within the function(s) or classes that you are testing. Those other functions should have their _own_ tests to ensure that they work as intended.

In some cases, you will combine unit testing with integration or end-to-end testing to ensure that the entire system works together as expected, which will help you confirm that your mock implementation for unit tests is correct.
:::

Below is some general information about how to set up and use mocks in various situations. More specific examples and use cases can be found in the [Examples](../examples/overview.md) and [Case Studies](../case-studies/overview.md) sections.

[[toc]]

## In PHP unit tests (General)

### Patchwork

[Patchwork](https://antecedent.github.io/patchwork/) is a simple, easy-to-use library for mocking or "monkey patching" functions in PHP. It allows you to override the behavior of functions during tests. It doesn't require any global setup or teardown, making it easy to use for individual test cases and very practical for mocking procedural functions.

:::note
Example to come
:::

### Mockery

[Mockery](https://docs.mockery.io/en/stable/) is a powerful mocking library for PHP that allows you to create mock objects and set expectations on them. It is particularly useful for testing complex classes, as it allows you to create mock objects with just the relevant methods and properties, as well as providing ways to handle protected and private methods.

:::note
Example to come
:::

## In PHP unit tests (WordPress)

### BrainMonkey

:::note
Example to come
:::


### WP_Mock

:::note
Example to come
:::


## In JavaScript unit tests

:::note
Content still to come.
:::

## In component tests

:::note
Content still to come.
:::