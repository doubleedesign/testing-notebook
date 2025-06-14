---
title: BrainMonkey vs WP_Mock
heading: BrainMonkey vs WP_Mock
order: 2
status: drafting
source_lang: [PHP (WordPress)]
test_lang: [PHP]
test_type: [Unit]
sidebarDepth: 0
---

BrainMonkey and WP_Mock are both libraries designed to facilitate unit testing in WordPress by simplifying the [mocking](../concepts/mocking.md) of WordPress functions. Examples of use of each can be found in the [Case Studies](../case-studies/overview.md) section.

[[toc]]

## General comparison

| Item                                                      | [BrainMonkey](https://github.com/Brain-WP/BrainMonkey) | [WP_Mock](https://github.com/10up/wp_mock)                |
|-----------------------------------------------------------|--------------------------------------------------------|-----------------------------------------------------------|
| Install/manage with Composer                              | :white_check_mark: Yes                                 | :white_check_mark: Yes                                    |
| Uses [Patchwork](https://github.com/antecedent/patchwork) | :white_check_mark: Yes                                 | :white_check_mark: Yes                                    |
| Uses [Mockery](http://docs.mockery.io/en/stable/)         | :white_check_mark: Yes                                 | :white_check_mark: Yes                                    |
| Works with [PHPUnit](https://phpunit.de/)                 | :white_check_mark: Yes                                 | :white_check_mark: Yes                                    |
| Works with [Pest](https://pestphp.com/)                   | :white_check_mark: Yes                                 | :warning: May require some additional setup               |
| Licence                                                   | :white_check_mark: MIT                                 | :warning: Copyright notice with permission statement      |
| Ownership                                                 | :grey_question: GitHub org Brain-WP[^1]                | :white_check_mark: Commercially backed (10up and GoDaddy) |
| Accepts contributions                                     | :white_check_mark: Yes                                 | :white_check_mark: Yes                                    |
| Can be used outside of WordPress                          | :white_check_mark: Yes                                 | :no_entry: No                                             |

[^1]: Org members of Brain-WP are not publicly listed on GitHub. Developer Giuseppe Mazzapica seems to be the ultimate custodian of BrainMonkey, but contributions have been accepted from 16 other developers at the time of writing. Given this and the MIT licence, I don't consider this to be much of a "key person risk" concern.

## Testing framework compatibility

WP_Mock is designed for PHPUnit, and BrainMonkey is framework-agnostic and provides documentation for PHPUnit usage. So if you're using vanilla PHPUnit, this is a non-issue for you and you can follow each library's documentation for setup and usage instructions:
- [BrainMonkey - Setup for WordPress testing](https://giuseppe-mazzapica.gitbook.io/brain-monkey/wordpress-specific-tools/wordpress-setup)
- [WP_Mock - Getting Started - Configuration](https://wp-mock.gitbook.io/documentation/getting-started/configuration)

If you are using Pest, you won't have test classes that you can extend. This is not a problem for BrainMonkey, because it just means you put the setup and teardown code in the Pest `beforeEach` and `afterEach` hooks instead of class method overrides: 

```php
use Brain\Monkey;
use Mockery;

beforeEach(function () {
    Monkey\setUp();
});

afterEach(function () {
    Monkey\tearDown();
    Mockery::close(); // If you're using Mockery features
});
```

Conversely, WP_Mock has its own `TestCase` class which extends the PHPUnit one, which the docs instruct us to extend. This could be a problem for Pest users because it means that anything contained in that class will not work out of the box. Whether this matters will depend on which features you use, and it's not necessarily a deal-breaker - it just means you may need to do some additional setup (I have not found this to be an issue in anything I've used it for so far though).

Basic setup of WP_Mock in a Pest test can be done like this:

```php
use WP_Mock;
use Mockery;

beforeEach(function() {
    WP_Mock::setUp();
});

afterEach(function() {
    WP_Mock::tearDown();
    Mockery::close(); // If you're using Mockery features
});
```

At the time of writing, they seem pretty much the same to me so far. When I find a situation where not using WP_Mock's `TestCase` class causes a problem and means I need to do more setup here, I will update this section.

## Some simple scenarios

For basic stubbing, I have not found much difference between these two libraries in practice, other than syntax. If you find the same, which you find easier to read and write might be the deciding factor.

Shown below are some examples of how to do some simple, common mocking/stubbing tasks with each library.

### Setting admin or front-end context

```php
// WordPress function usage
$is_frontend = !is_admin();
```

```php
// WP_Mock
WP_Mock::userFunction('is_admin')->andReturn(false);
```

```php
// BrainMonkey
when('is_admin')->justReturn(false);
```

### Setting the role of the current user

```php
// WordPress function usage
$is_customer = current_user_can('customer');
```

```php
// WP_Mock
WP_Mock::userFunction('current_user_can', [
    'args' => ['customer'],
    'return' => true
]);
```

```php
// BrainMonkey
when('current_user_can')->alias(function($role_or_capability) {
    return $role_or_capability === 'customer';
});
```

:::details Alternative syntax for the callback in the BrainMonkey example
```php
// Shortest version:
when('current_user_can')->alias(fn($role_or_capability) => $role_or_capability === 'role_to_test');

// Expanded version:
when('current_user_can')->alias(function($role_or_capability) {
    if ($role_or_capability === 'role_to_test') {
        return true;
    }
    return false;
});
```
:::

## Assertions about function calls

You may have cases where you want to assert that a function gets called, how many times, with what arguments, etc. 

In WP_Mock, the most concise way you can do this within your mock function setup, _before_ you call the function that will trigger it.

The below example shows how you end up arranging and asserting in one step for each function you want to mock and check, before you do any action (in this case, calling the `update_sale_price` method).

```php
use WP_Mock;

test('it should set the sale price to empty if the member price is cheaper', function() use ($salePrice, $memberPrice, $regPrice) {
    // Arrange: 
    // Instantiate the class we're testing and create a minimal product mock
    $instance = new ItemPricing();
    $product = MockProducts::create(['id' => 123, 'regular_price' => $regPrice, 'sale_price' => $salePrice]);
    
    // Mock that the user is a member (Arrange the user role)
    WP_Mock::userFunction('current_user_can', [
        'args' => ['member'],
        'return' => false
    ]);
    
    WP_Mock::userFunction('get_post_meta', [
        'args' => [123, '_member_price', true],
        'return' => $memberPrice,
        'times' => 1 // Assert that get_post_meta() will be called once in this case
    ]);

    // Act: Run the function we're testing
    $result = $instance->update_sale_price($salePrice, $product);
    
    // Assert that the result is no sale price
    expect($result)->toBe("");
});
```

This can feel a bit counterintuitive if you're used to the standard [AAA pattern](../concepts/patterns.md), because you're asserting before you act. An alternative is to _alias_ the function to a Mockery spy. (Remember, both WP_Mock and BrainMonkey use Mockery under the hood, so while this is more verbose it doesn't bring in another dependency.)

```php
test('it should set the sale price to empty if the member price is cheaper', function() use ($salePrice, $memberPrice, $regPrice) {
    // Arrange: 
    // Instantiate the class we're testing and create a minimal product mock
    $instance = new ItemPricing();
    $product = MockProducts::create(['id' => 123, 'regular_price' => $regPrice, 'sale_price' => $salePrice]);
    
    // Mock that the user is a member (Arrange the user role)
    WP_Mock::userFunction('current_user_can', [
        'args' => ['member'],
        'return' => true
    ]);
    
    // Use a spy function to mock get_post_meta in a way we can assert on later
    $postmetaSpy = Mockery::spy(function($key) use ($memberPrice) {
        if($key === '_member_price') {
            return $memberPrice;
        }
        return null;
    });
    WP_Mock::alias('get_post_meta', $postmetaSpy);

    // Act: Run the function we're testing
    $result = $instance->update_sale_price($salePrice, $product);
    
    // Assert that the member price was fetched
    $postmetaSpy->shouldHaveReceived('get_post_meta', [Mockery::any(), '_member_price', Mockery::any()]);

    // Assert that the result is no sale price
    expect($result)->toBe("");
});
```

The BrainMonkey equivalent of this is:

```php
use Brain\Monkey\Functions\{when,stubs};

test('it should set the sale price to empty if the member price is cheaper', function() use ($salePrice, $memberPrice, $regPrice) {
    // Arrange: 
    // Instantiate the class we're testing and create a minimal product mock
    $instance = new ItemPricing();
    $product = MockProducts::create(['id' => 123, 'regular_price' => $regPrice, 'sale_price' => $salePrice]);
    
    // Mock that the user is a member (Arrange the user role)
    when('current_user_can')->alias(function($role_or_capability) {
        return $role_or_capability === 'member';
    });
    
    // Use a spy function to mock get_post_meta in a way we can assert on later
    $postmetaSpy = Mockery::spy(function($post_id, $key, $single) use ($memberPrice) {
        if ($key === '_member_price') {
            return $memberPrice;
        }
        return null;
    });
    when('get_post_meta')->alias($postmetaSpy);

    // Act: Run the function we're testing
    $result = $instance->update_sale_price($salePrice, $product);
    
    // Assert that the member price was not fetched
   	$postmetaSpy->shouldNotHaveReceived('get_post_meta', [Mockery::any(), '_member_price', Mockery::any()]);
    
    // Assert that the sale price has not changed
	expect($result)->toBe($salePrice);
});
```

## Conclusion

Just as I think I've found an important difference, it turns out no, you can just as easily do that thing with the other library - at least for my use cases so far. Personally, I slightly prefer BrainMonkey's syntax, and that it can be used outside WordPress is another point in its favour. But for WordPress use, there's no clear winner - they're pretty much the same thing and it's reasonably straightforward to translate between the two once you get a hang of using them.