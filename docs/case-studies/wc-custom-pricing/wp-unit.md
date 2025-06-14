---
title: "Part 1: Unit Testing"
heading: "Unit testing a custom pricing plugin in a WooCommerce site"
order: 1
status: drafting
source_lang: [PHP]
test_type: [Unit,E2E]
test_tools: [Pest,Playwright]
sidebarDepth: 0
---

[[toc]]

:::note
Complete content to come
:::

## Writing tests

```php
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