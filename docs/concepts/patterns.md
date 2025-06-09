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