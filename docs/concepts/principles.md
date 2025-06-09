---
title: Principles
heading: Principles
order: 4
---

There are many conceptual frameworks out there that can help you write focused, valid, and reliable tests. They are not prescriptive and don't always apply to all kinds of tests, but they are helpful guides to keep at the front of your mind.

:::tip
When looking for testing guidelines and resources to understand various principles and approaches, remember that the concepts and principles of testing are generally language-agnostic. Don't disregard a book, article, or video just because it was written for a different language or framework than the one you are using.
:::

[[toc]]

## FIRST Principles

- **Fast**: Tests should be set up to be as fast as possible, so that they can be run frequently and add to developer efficiency (not introduce lots of waiting time!)
- **Isolated** (or Independent): 
  - Test code should effectively isolate the thing it's trying to test from other dependencies (especially in unit and component tests)
  - Each test should also be independent of other tests - a test should not rely on the outcome of other tests
  - Test code should not modify real data.
- **Repeatable**: Tests should give the same result every time they are run. Ths means that they should not rely on external state or data that can change. A simple example of this is a function that uses the "current date" should have a fixed "pretend this is the current date" date set for the test.
- **Self-validating**: The tests use assertions to validate the output, making it clear whether the test passes or fails.
- **Timely**: Tests should be written at the right time in the development process to ensure that they are useful. This might mean writing test cases before the code is written (true Test-Driven Development), or alongside it, or a combination of both (the latter usually being the most practical). That said, if you have a project without any tests - that doesn't mean you shouldn't add some! For those cases, "timely" might mean "before any substantial changes are made to the codebase" or "before the next release".

## Right-BICEP

Right-BICEP is a set of principles that help you assess the thoroughness of your tests. It was first proposed in the 
book [_Pragmatic Unit Testing in Java 8  with JUnit_](https://learning.oreilly.
com/library/view/pragmatic-unit-testing/9781680500769/) but is applicable to all languages and multiple testing types. It stands for:

- **Right**: Pretty self-explanatory: Are the results right? Do the tests confirm that the requirements have been met?
- **Boundary conditions**: Tests should cover edge cases and boundary conditions to ensure that the code behaves correctly in all scenarios. For example, if bulk pricing kicks in for groups of 6 items, you should test with 5, 6, 7, 11, 12, 13 items to ensure that the code behaves correctly within, outside, and right on the boundaries.
- **Inverse conditions**: Can your test cover inverse conditions to ensure that the code behaves correctly when the conditions are not met? For example, if a function is supposed to return true if a user is logged in, you should also ensure that it returns false when the user is not logged in.
- **Cross-check**: Can you cross-check your results another way? This could include using more than one type of test, a manual cross-check, or using another function (or combination of them) that you expect to return the same result.
- **Error conditions**: Can you force error conditions to ensure the system behaves as expected when things go wrong? This could include testing for invalid input, network errors, or other unexpected conditions.
- **Performance characteristics**: Can you build performance checks into your tests to ensure that the code performs 
  well under normal or high request/traffic conditions?