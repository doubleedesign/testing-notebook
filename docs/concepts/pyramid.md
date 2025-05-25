---
title: Testing Pyramid
position: 1
sidebarDepth: 0
---

# The Testing Pyramid

The testing pyramid is a metaphor for the distribution of different types of tests in a software or web project, visualising the core principles that:
- there should be more low-level (granular, small piece) tests than high-level (whole feature in a real website) ones 
- we should test our building blocks thoroughly, with our more holistic tests building upon the foundation of code that we know works in isolation.

This is for a couple of reasons:
- Small, isolated, low-level tests are generally simpler to write and maintain, and they run faster. They can easily be run frequently, which helps catch bugs early.
- The higher up the pyramid you go, the more complex and time-consuming the tests become. They often require more setup and are slower to run, which can make them less practical for frequent use.

There are several variations of the testing pyramid, but they all share these common principles. Common divisions include:
- Unit, integration, end-to-end
- Unit, system, end-to-end
- Unit, API, UI

Which version of the pyramid you use may depend on the nature of your project. For example, a custom WordPress theme probably doesn't have an API layer, and is better served by a UI-focused pyramid than an API-focused one.

Shown below is my own conceptualisation of the testing pyramid as it applies to primarily user-facing websites. This is a variation on the common "unit, integration, end-to-end" model, but with emphasis placed on the user interface and user experience by including:
- a "component" layer as distinct from unit and integration tests
- visual regression testing, which doesn't fit neatly into a single pyramid layer but can be a useful part of testing strategies at multiple levels.

You can find the specific definitions for each of these layers that are used throughout this site on the [Testing Types](./testing-types.md) page.

<Pyramid></Pyramid>