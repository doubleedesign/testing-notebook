---
title: Breadcrumbs Plugin (WordPress)
order: 1
source_lang: [PHP]
test_type: [Unit]
test_tools: [Pest]
sidebarDepth: 0
---

# Example: Unit testing a WordPress plugin

[[toc]]

## Background

Many years ago, before I knew anything about how to do automated testing, I wrote a [WordPress plugin for adding breadcrumb trails to templates](https://github.com/doubleedesign/doublee-breadcrumbs). It was only through usage on several sites that I gradually discovered some bugs and edge cases that needed to be handled better - without breaking existing functionality!

The plugin is written entirely in PHP, and while it includes functions to render the HTML, it doesn't include any front-end styling (that's the responsibility of themes on sites that use it), so the best type of testing to start with is unit testing, which can be done in isolation from the WordPress environment with without any need for a demo site.

:::tip Why unit tests?
In addition to this particular plugin being independent of front-end styling, unit tests being the most isolated type of tests you can write makes them particularly useful for testing a plugin that is intended for use on multiple sites because it ensures no logic is tied to a specific site's data, theme, or other specifics.
:::

:::warning
This is an example of "retrofitting" unit tests to a plugin that has already been developed - it's backwards from the ideal scenario to be gleaning requirements from completed code rather than the test-driven development (TDD) approach of writing out test cases and then writing code that meets those requirements. Let's be real though - this is a  common scenario for many developers who have built things before knowing about testing, who have inherited code that doesn't have unit tests, or simply could not make the time to write tests at the time of development. Better late than never!
:::


## Prerequisites

If you are following this case study as a guide to how to add unit tests to your own plugin, it is assumed that you have followed the [Getting Started](../setup.md) guide and have a working local development environment with PHP, Composer, and a suitably configured IDE.

## Project setup

I have chosen [Pest](https://pestphp.com/) as my test runner, which is a modern PHP testing framework that makes it easy to write and run tests with similar syntax to the JavaScript-based frameworks (Jest, Cypress, Playwright) I was already familiar with. I also need to [mock](../concepts/mocking.md) WordPress functions that are used in the plugin, so I can test the plugin in isolation without needing to set up a full WordPress environment. For this I chose [BrainMonkey](https://giuseppe-mazzapica.gitbook.io/brain-monkey) for its simple monkey-patching capabilities and syntax.

You can find details on how to install and set these up in the [Getting Started](../setup.md) page.

:::info
You will notice that my bootstrap, setup, and teardown code is written differently to the documentation for BrainMonkey. This is because I am using [Pest](https://pestphp.com) instead of PHPUnit directly, which does not use classes for test files (as PHPUnit does), instead using functions to define the tests. Pest is built on top of PHPUnit, so it is still compatible with PHPUnit syntax and features, but requires some small adjustments to where some common code goes.
:::


## Creating test files

This plugin has a very simple structure of four PHP classes all located in the root of the `src` directory, plus a template partial for the admin interface. One of the classes just instantiates the others and defines what to run on plugin activation, deactivation, and uninstall, so I've focused on the other three classes for unit testing: `Settings`, `Admin`, and `Frontend`.

I decided on using a `tests` directory in the root of the plugin to put all the unit tests. This is what Pest expects by default, which keeps configuration simple.

In the tests folder, I created a test file for each class, following the PHPUnit/Pest naming convention of `ClassNameTest.php` and adding BrainMonkey's setup and teardown functions. The skeleton of a test file looks like this:

```php
<?php
use function Brain\Monkey\{setUp, tearDown};
use function Brain\Monkey\Functions\when;
use Doubleedesign\Breadcrumbs\Settings;

describe('Settings', function() {

	beforeEach(function() {
		setUp();
	});

	afterEach(function() {
		tearDown();
	});
});
```

### Mocking WordPress functions

BrainMonkey takes care of several WordPress functions, but not all of them - and often we need to mock specific results to set up the scenario(s) we want to test. We can put common mock setups in the `beforeEach` function, and specific mocks for each test in the individual test cases.

For example, the `Settings` class has a method that returns the post types that can have breadcrumbs. Inside this method, the WordPress `get_post_types` function is called to get all the post types in the current site. I set up a basic stub of this function in the `beforeEach` function, so each test now has the same scenario to work with: "In a site that has these post types..."

```php
beforeEach(function() {
    setUp();

    when('get_post_types')->justReturn([
        'page',
        'post',
        'nav_menu_item',
        'wp_block',
        'attachment',
        'revision'
    ]);
});
```

It is important to include two things here that cover the core purpose of this method:
1. A post type that _is_ excluded by default
2. A post type that _is not_ excluded by default.

:::tip
We don't usually test every value excluded in the list. The **equivalence partitioning** (or equivalence class) approach to testing means that we assume that if the test passes for a value in a given group, it will pass for all other values that meet the same criteria. The groups will usually be, broadly speaking, something like:
- Values in the expected input range or group
- Values outside the expected input range or group
- Boundary or edge values (e.g. exactly the first and last values in a number range)

There can be some exceptions and nuance to this; for example the source code for the `get_breadcrumbable_post_types` method accounts for [ACF](https://www.advancedcustomfields.com/) post types, and we might want to test for that specifically for plugin support assurance. Conversely, we _generally_ don't need to test both "post" and "page" in every test for a feature that treats them the same.
:::


## Writing tests

Because this is a pre-existing codebase the next step is to examine each class and its methods to determine what it's supposed to do, and write out a list of the "requirements" in the format of test cases. 

:::important 
While I generally adopt a one test file to each source file approach for unit tests, the same does not apply per method. You will usually need multiple tests per method to cover different expected scenarios, edge cases, and error handling.
:::

A starting point looks like this:

```php
describe('Settings', function() {

	describe('Which post types can have breadcrumbs', function() {

		it('excludes menu items by default', function() {
		    // Arrange
			$settings = new Settings();

            // Act
			$post_types = $settings::get_breadcrumbable_post_types();

            // Assert
			expect($post_types)->not->toContain('nav_menu_item');
		});
	});
});
```

This uses the [Arrange-Act-Assert (AAA)](../concepts/patterns.md) pattern to structure the test, which is a common pattern in unit testing. We set up the scenario, do a thing (such as call a function or method), and then check the result is what we expect.

As we progress further in our test writing, we should also consider what edge cases might occur. For example in the `get_breadcrumbable_post_types` method:
- What if there are no post types at all?
- What if when a plugin or theme uses the filter to include or exclude a post type that doesn't exist?