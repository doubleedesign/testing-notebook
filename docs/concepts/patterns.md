---
title: Patterns
heading: Test patterns
order: 5
---

Test patterns are ways to structure your tests to ensure that they adopt consistent conventions and do what they are designed to do. 

[[toc]]

## Arrange, Act, Assert

The AAA pattern (_Arrange, Act, Assert_) and its variations is the test pattern generally used throughout this guide. It is also known as _Given, When, Then._

:::details Arrange
In the Arrange step, you set up the conditions for the test. When testing back-end code, this might include creating mock objects and mocking/stubbing functions that the code under test depends on. When testing front-end code, this might include rendering something on a page or in a simulated browser environment such as JSDOM.

You can also think of it as "Given this scenario..." - where you write the code that sets up the scenario you want to test.
:::

:::details Act
In the Act step, you execute the code that you want to test. This is where you call the function or method that you are testing, trigger the event that you want to test, or equivalent.

You can also think of it as "When this happens..." - where you write the code that triggers the action you want to test in the scenario you set up above it.
:::

:::details Assert
In the Assert step, you check that the code you executed in the Act step behaves as expected. This is where you verify that the output of the code matches what you expect, that the state of the component is as you expect it to be, etc.
:::

### Examples

#### PHP unit test with Pest
```php
test('Day, date and month in same month', function() {
    // Arrange: Given the component is created with these dates...
    $startDate = new DateTime('2025-06-13');
    $endDate = new DateTime('2025-06-15');
    $dateRangeBlock = new DateRangeBlock(['startDate' => $startDate, 'endDate' => $endDate, 'showYear' => false, 'showDay' => true]);

    // Act: When I request the accessible date string...
    $formattedDate = $dateRangeBlock->get_accessible_date_string();
    
    // Assert: Then I expect the formatted date to be...
    expect($formattedDate)->toBe('Friday 13 - Sunday 15 June');
});
```

#### JavaScript UI component unit test with Jest and Vue Testing Library
```typescript
it('renders the tabs with the correct titles and content', () => {
    // Arrange: Given this component data...
    const data = {
        props: {
            // Data has been truncated for brevity, you can find the full test code here: 
            // https://github.com/doubleedesign/comet-components/blob/master/packages/core/src/plugins/shared-vue-components/__tests__/tabs.test.ts
        },
    }
    
    // Act: When I render the Tabs component to the page...
    render(Tabs, data);

    // Assert: Then I expect the tabs to be rendered with the correct titles and content...
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('This is the content of tab 1.')).toBeInTheDocument();
    // Tab 2 content should be in the document but not visible initially
    const tab2Content = screen.getByText('This is the content of tab 2.');
    expect(tab2Content).toBeInTheDocument();
    expect(tab2Content).not.toBeVisible();
});
```

### Variations

#### Arrange, Assert Not, Act, Assert

This variation of the AAA pattern just adds an extra assertion before the act, to validate the initial state so that you can be sure that your final assertion is as a result of the act, not just a coincidence of the initial state. Examples of when you might use this include:
- Asserting that an element is not visible before an action that should make it visible
- Asserting that an input field is empty before an action that should enter some text 
- Asserting that the default value of an object property is the default before an action that should change it.

#### Multi-step AAA

Sometimes you may need to perform multiple actions in the Act step, or multiple assertions in the Assert step. In this case, you can still use the AAA pattern - you'll just have multiple Act and Assert steps. Generally you should keep these to a minimum - if you have more than 2 or maybe 3 "act" steps, your test might really be multiple tests in disguise. 

#### Arrange, Assert, Act

In some cases such as when using [WP_Mock](https://github.com/10up/wp_mock) to mock WordPress functions, you may need to include the assertion as part of the mock and _then_ call the thing that calls it (the **act**) step. This can feel a little counterintuitive if you're used to the standard AAA pattern, but you could think of it was "expect this to happen" rather than "expect that this happened". For example:

```php
test('it should register the sale price function on the expected WooCommerce hook', function() {
    // Set up the expectation before creating the instance that will trigger the hook
    WP_Mock::expectFilterAdded('woocommerce_product_get_sale_price', [Mockery::anyOf(ItemPricing::class), 'update_sale_price'], 10, 2);
    
    // Create the instance so the constructor, which contains the hook registration, is called
    $instance = new ItemPricing();
});
```

```php
test('it should set the sale price to empty if the member price is cheaper', function() use ($salePrice, $memberPrice, $regPrice) {
    // Instantiate the class here so it's after the mocks have been set up
    $instance = new ItemPricing();
    
    // Mock the result of current_user_can for the member role
    MockUtils::mock_user_role_or_cap('member', true);

    // Create a minimal mock of a product and the relevant post meta
    $product = MockProducts::create(['id' => 123, 'regular_price' => $regPrice]);
    WP_Mock::userFunction('get_post_meta', [
        'args' => [123, '_member_price', true],
        'return' => $memberPrice,
        'times' => 1 // Assert that get_post_meta will be called once in this case
    ]);

    // Run the function we're testing
    $result = $instance->update_sale_price($salePrice, $product);

    // Assert that the result is no sale price
    expect($result)->toBe("");
});
```