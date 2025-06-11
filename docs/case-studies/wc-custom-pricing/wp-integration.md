---
title: "Part 2: Integration testing with the WP REST API"
heading: "Using the WP REST API to integration test a plugin"
order: 2
status: drafting
source_lang: [PHP]
test_type: [Integration]
test_tools: [Pest, Jest]
sidebarDepth: 0
---

[[toc]]

## Rationale

You might be wondering why, if you have a test site running, you would want to write integration tests using the REST API instead of just using E2E tests.

The first reason is **speed** - integration tests are generally faster than E2E tests because they don't have to load the entire front-end of the site, instead just querying the API endpoint to check the data returned. This makes it easier to run tests frequently during development, maximising their usefulness.

The second reason is **isolation** - integration tests can be run in isolation from the front-end, which means you can test the logic of your plugin without potential interference from theme code or styling. If you then get to manual or E2E testing and find inconsistencies, you can be more confident that the issue is with the theme, another plugin, or other front-end code rather than your plugin logic.

## Prerequisites

You will need a dev or staging site with the plugin(s) you want to test installed, and their dependencies. Ideally for integration testing this will be a minimal setup with only the requirements of what you're testing, although there are some cases where you might want to do this with a full site setup as an alternative or a precursor to E2E testing.

:::tip Tip
This article assumes you have a working test site set up somewhere, ready to go. 

You can use tools like [Docker](https://www.docker.com/) to automate setting up a pre-configured, pre-populated test site, which is particularly useful for running tests in CI/CD pipelines. That's outside the scope of this article, but worth a note.
:::

## Setup

### Test data, content, users

Ensure your test site contains data/content that meets all the test scenarios you need to cover. A good way to do this is to write out all your test cases first (without the actual test code is fine - just the function with an empty body that you will populate later), and then create the necessary data in your test site to cover those cases if it doesn't already exist.

For test users, you will need to store their credentials somewhere that the tests can access them. In this example, 
I have put them in a `.env` file within the integration test folder in my plugin. See [handling authentication](#handling-authentication) below for details on which credentials you should use.


### Optional: Postman

[Postman](https://www.postman.com/) is a great tool for testing and debugging API endpoints, and can be used to manually test and debug your API queries and responses. It also provides code snippets for various programming languages and common libraries, enabling easier translation of your working request into a working automated test.

### Testing framework

Pick your poison! Because we're going to be testing by querying an API endpoint, you can use any testing framework that allows you to make HTTP requests and parse JSON responses.

- If you've already written unit tests using [PHPUnit](https://phpunit.de/) or [Pest](https://pestphp.com/), you can step that up a notch and use those same tools to write integration tests
- If your source code and unit tests are in JavaScript, or you simply prefer JavaScript and you don't need coverage reporting, you can use [Jest](https://jestjs.io/) or similar
- If you use Postman for testing and debugging your API responses, you can also [write tests in Postman itself](https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/).

:::important
The below examples are written in PHP with [Pest](https://pestphp.com/), because as mentioned above, to test PHP code with coverage reporting, you need to write your tests in PHP too - and I want coverage reporting!

In my case, it was also a straightforward translation from unit tests to corresponding integration tests, meaning it's not much extra work and the comparison is more useful for the purposes of this case study (see the [Findings](./overview.md#findings) section on the first page for more about that).
:::

#### Supporting libraries
- For Pest:
  - for ease of making HTTP requests, I am using [Guzzle HTTP client](https://docs.guzzlephp.org/en/stable/) 
  - access the user credentials stored in `.env` in a non-standard location, I am using [phpdotenv](https://github.com/vlucas/phpdotenv)

#### Setup code and utilities
There is often common setup or utility code that is needed across all tests that can be put into a configuration or setup file.

For Pest, the below code sets up a single Guzzle HTTP client that can be used in all tests with consistent configuration, such as the base URI for the API endpoint. It also sets up a utility specific to my use case that simplifies getting user credentials. 

```php
<?php
namespace Doubleedesign\Pricing\Tests\Integration;
use GuzzleHttp\Client;
use Dotenv\Dotenv;

// Load .env from current directory
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

class TestUtils {
	public static Client $client;

	static function setUp(): void {
		self::$client = new Client([
			'base_uri' => 'https://demo-dance.test/wp-json/wc/v3/',
		]);
	}

	static function getCustomerCredentials(string $userEnvPrefix): array {
		return [
			$_ENV[$userEnvPrefix . '_CUSTOMER_USERNAME'],
			$_ENV[$userEnvPrefix . '_CUSTOMER_PASSWORD'],
		];
	}
}
```

These can be used in tests like so:

```php
$response = TestUtils::$client->request('GET', 'products/100', [
    'auth' => TestUtils::getCustomerCredentials('TEST_BASIC'),  
    'headers' => [
        'Accept' => 'application/json',
    ]
]);
```


## Handling authentication

If you are testing functionality that requires a user to have a specific role or capability, you will need to 
authenticate your requests accordingly. In this guide I have used basic authentication for simplicity, but you might alternatively want to consider something like [JWT Token Authentication](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/).

:::danger
It is important to be mindful of security when handling authentication in your tests. Do not hard-code sensitive credentials in your test files, and ensure that any test accounts you create have the minimum necessary permissions. This is one of the reasons it is advisable to test on a separate dev/staging site that does not contain any sensitive client or user data, not the real site.

The test user credentials for the demo site are stored in plain text and put on GitHub for convenience and because there's no sensitive data (likewise for the database dump being included in the repo). This is absolutely not recommended for production sites or staging sites derived from production sites.
:::

### With an application password

In your test user's profile, you can create an [application password](https://developer.wordpress.org/rest-api/reference/application-passwords/) to use for basic authentication with their WordPress username.

### WooCommerce REST API authentication
If you are testing WooCommerce functionality with user accounts where the user has `manage_woocommerce` permission, you can use an API key and secret for basic authentication. You can generate these in the WooCommerce settings under `WooCommerce > Settings > Advanced > REST API`, and use the consumer key as the username and the consumer secret as the password.

If you are testing WooCommerce functionality with user accounts that _do not_ have the `manage_woocommerce` permission, one way around that is to use the `woocommerce_rest_check_permissions` to enable access to everyone in local environments.

I do this by configuring it to return `true` in local environments by adding a `define('WP_ENVIRONMENT_TYPE', 'local');` to the `wp-config.php` file, and then checking that in the filter function:

```php
function grant_local_api_access($permission, $context, $object_id, $post_type) {
    $is_local = defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'local';
    if($is_local && $context === 'read') { 
        return true;
    }

    return $permission;
}
add_filter('woocommerce_rest_check_permissions', 'grant_local_api_access', 10, 4);
```

## Test environment bootstrapping

In my WooCommerce pricing example, I have some code that I want WordPress to run only in my test environment (as briefly described above). To ensure that these functions are only run in a local environment, I separated this code into a test bootstrap class that is only loaded at all when the `WP_ENVIRONMENT_TYPE` is set to `local`.  This ensures that even if the functions have conditions in them to check for the environment, they can't impact performance or functionality in production because they are never loaded.

:::important
Because this code is for the WordPress site itself to run, it needs to be added regardless of the testing framework being used.
:::

In my plugin's root file:

```php
if(defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'local') {
	// Load integration tests bootstrap
	require_once __DIR__ . '/__tests__/integration/Bootstrap.php';
	Doubleedesign\Pricing\Tests\Integration\Bootstrap::setUp();
}
```

And in the class file itself:

```php
<?php
namespace Doubleedesign\Pricing\Tests\Integration;

class Bootstrap {

	static function setUp(): void {
		add_filter('woocommerce_rest_check_permissions', [self::class, 'grant_local_api_access'], 10, 4);
	}

	static function grant_local_api_access($permission, $context, $object_id, $post_type) {
		$is_local = defined('WP_ENVIRONMENT_TYPE') && WP_ENVIRONMENT_TYPE === 'local';
		if($is_local && $context === 'read') {
			return true;
		}

		return $permission;
	}
}

```

## Writing tests

At this point, I like to test some API requests using Postman or similar to ensure that the REST API is returning the expected data for some basic queries. This helps ensure that any site access issues, user permissions issues, or other site-specific problems are resolved before they show up in test output - so then I know if I get an error in my tests, it is likely due to a problem with the test code itself rather than the site setup.

With that out of the way, here's some examples of test code for the [Custom Pricing](wc-custom-pricing.md) case study! 

```php
<?php /** @noinspection PhpUnhandledExceptionInspection */
namespace Doubleedesign\Pricing\Tests\Integration;

describe('Item pricing', function()  {

	beforeEach(function() {
		TestUtils::setUp();
	});

	describe('User is a member', function() {

		test('it should return the member price if lower than the regular price', function() {
			$response = TestUtils::$client->request('GET', 'products/117', [
				'auth' => TestUtils::getCustomerCredentials('TEST_MEMBER'),
				'headers' => [
					'Accept' => 'application/json',
				]
			]);

			// First, we should check that this product meets our test case criteria in case anyone has messed with the test data
			$data = json_decode($response->getBody(), true);
			$basic_price = $data['price'];
			$member_price = array_find($data['meta_data'], function($meta) {
				return $meta['key'] === '_member_price';
			})['value'] ?? null;
			expect($member_price)->toBeLessThan($basic_price);

			// Then assert that the final price this customer will receive is the member price
			expect($data['regular_price'])->toBe($member_price);
		});
		
		// ... more test cases here
	});
});
```

You may notice that most of the test cases line up to the unit test cases. This is intentional, as the integration tests are designed to ensure that the plugin logic works correctly in the real system, the same as it does when the data is mocked/stubbed.

:::info
The complete site code for the custom pricing case study, including test files, is available on [GitHub](https://github.com/doubleedesign/demo-dance).
:::


## Useful links
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WooCommerce REST API documentation](https://woocommerce.github.io/woocommerce-rest-api-docs/)
- [JWT Token Authentication for WP REST API plugin](https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/) (third-party)