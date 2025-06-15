---
title: "Part 1: Unit Testing"
heading: "Unit testing a custom pricing plugin in a WooCommerce site"
order: 1
source_lang: [PHP]
test_type: [Unit]
test_tools: [Pest]
sidebarDepth: 0
---

[[toc]]

## Rationale

Unit tests are the most granular and isolated tests you can write for your code. They are designed to test individual functions or methods in isolation, without relying on external systems like databases or APIs. This makes them very fast and reliable, as they can be run frequently during development to catch bugs and regressions early. Their isolation also means there's not much setup required - you don't need a whole site or real database running.

## Prerequisites

Because we don't need real data, all you need to get started is an understanding of the functions you're going to test, their use cases, their edge cases, what functions they call inside them, and what objects they use (if any).

## Setup

### Testing framework

For this case study, we're testing PHP functions so we'll use [Pest](https://pestphp.com/), a modern testing framework for PHP that is built on top of PHPUnit. We also need to [mock](../../concepts/mocking.md) some of the WordPress functions and classes that we will be using in our tests, for which we'll use [Mockery](http://docs.mockery.io/en/stable/) and [WP_Mock](https://github.com/10up/wp_mock).

WP_Mock uses Mockery under the hood, so we don't need to install it separately.

You can install these in your project by running the following commands in the terminal:

```bash
composer require pestphp/pest --dev
composer require 10up/wp_mock --dev
```

### Mocks and stubs

For this case study, we're looking at some functions that use WooCommerce products (objects of the `WC_Product` class) and some WordPress functions for things like retrieving metadata (`get_post_meta`) and checking the current user's role (`current_user_can`). To be able to set up the isolated scenarios that we need to test, we need to provide pre-defined instances of those objects and results of these functions.

For convenience, we can do this in some utility classes (though this is not mandatory - you can also just put these right in the test case). For example:

```php
namespace Doubleedesign\Pricing\Tests\Unit;
use Mockery;
use Mockery\MockInterface;
use WP_Mock;

class MockUtils {

	/**
	 * Shortcut function to mock the current_user_can function
	 * to set the value of the given role or capability for the user in the test context
	 * @param string $role_or_capability
	 * @param bool $user_has
	 * @return void
	 */
	public static function mock_user_role_or_cap(string $role_or_capability, bool $user_has): void {
		WP_Mock::userFunction('current_user_can', [
			'args' => [$role_or_capability],
			'return' => $user_has
		]);
	}
	
	// ...more utility methods here
}
```

:::info
You can find the full code of these utilities and the unit tests that use them can be found [on GitHub](https://github.com/doubleedesign/demo-dance/tree/master/wp-content/plugins/demo-custom-pricing/__tests__).
:::

## Writing tests

Once our mocks are set up (or at least some of them are - we might need to add more as we go) we can start writing our tests! 

### Structure
In Pest, each **test case** is written using the `test()` function, which receives a statement describing the requirement we're testing for and a function that tests it. We can also group tests using `describe` blocks.

We can also use `beforeEach` and `afterEach` hooks to run common setup and teardown code, such as initialising and resetting mocks so that stubs and calls to mock methods don't impact subsequent tests.

Unit tests generally follow the [Arrange-Act-Assert](../../concepts/patterns.md) pattern, where we:
1. Set up the conditions for the test (arrange): This is where we define the scenario's input values, the results of functions called within (such as checking user role), and create mock objects to act on (such as a product object).
2. Run the code we're testing (act): Call the function that we're testing.
3. Check that result is what we expect (assert).

This is also known as "Given, When, Then": "Given these values and conditions, when I call this function, then I expect this result".

### Expectations
The **assert** step utilises the concept of **expectations**, which are methods provided by our testing framework to which we pass some object or value to the `expect()` function, and then chain methods to it to check that it meets our expectations. For example, we can check that a value is equal to another value using `toBe()`, or that an array contains a specific value using `toContain()`.

:::tip
Expectations work similarly across many different testing frameworks, so they're a key thing to get your head around.
For example, in the [E2E tests](./wp-e2e.md) for this case study, we also use expectations when using Playwright for the testing framework.
:::

An example of how all of this comes together in a test case is:

```php
use App\Utils\MockProducts;
use App\Utils\MockUtils;
use App\Utils\ItemPricing;

beforeEach(function() {
    // Reset the mocks before each test
    MockProducts::reset();
    MockUtils::reset();
});

afterEach(function() {
    // Clean up after each test
    MockProducts::clear();
    MockUtils::clear();
});

describe('Sale price calculation', function() {
    $regPrice = 25.00;
    $salePrice = 20.00;
    $memberPrice = 17.50;
    
    test('it should set the sale price to empty if the member price is cheaper', function() use ($salePrice, $memberPrice, $regPrice) {
        // Instantiate the class here so it's after the mocks have been set up
        $instance = new ItemPricing();

        // Create a minimal mock of a product and the relevant post meta
        $product = MockProducts::create(['id' => 123, 'regular_price' => $regPrice]);
        MockUtils::mock_postmeta(123, '_member_price', $memberPrice);

        // Mock the result of current_user_can for the member role
        MockUtils::mock_user_role_or_cap('member', true);

        // Run the function we're testing
        $result = $instance->update_sale_price($salePrice, $product);

        // Assert that the result is no sale price
        expect($result)->toBe("");
    });
		
    // ...more test cases here that use the same $salePrice, $memberPrice, and $regPrice variables
    
});
```