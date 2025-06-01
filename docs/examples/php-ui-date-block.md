---
title: "PHP UI Component: Date Block"
order: 1
---

# Example: PHP UI Component - Date Block

## Context

I have a PHP class called `DateRangeBlock` which takes some options as an argument and generates some HTML for displaying a UI component for a date range. (See the [full code on GitHub](https://github.com/doubleedesign/comet-components/blob/master/packages/core/src/components/DateRangeBlock/DateRangeBlock.php)).

Inside the class there are some methods that determine what to render, such as the `get_accessible_date_string` method, which determines how to format the date for an `aria-label` or similar uses so that assistive technologies get a straightforward, descriptive read-out of the date range rather than separate pieces of text with abbreviations like "Jan" or "Fri".

## Requirements

Some of the scenarios we need to consider for handling a date range include:
- Same month, same year
- Different months, same year
- Different years
- All of the above with different options selected, such as whether to show the day of the week.

## Testing strategy

As a standalone PHP class, the `DateRangeBlock` component can be tested in isolation using unit tests. The tests can 
take the form of a list of requirements of how the different options and date scenarios should be handled and what 
the expected value returned from each method should be.

Using `get_accessible_date_string` as an example, you can see below how I could efficiently check that these requirements were met _before I even wrote the HTML_, let alone opened a web browser; and how these tests can also be used to quickly ensure that future changes to the code do not unexpectedly change these results.

Other testing types would also be useful for this component to build upon this, but this example focuses on unit testing.

## Example test code

The following code shows some examples of how the `get_accessible_date_string` method can be documented and tested using [Pest](https://pestphp.com/), unit tests. You can also [see the full test file on GitHub](https://github.com/doubleedesign/comet-components/blob/master/packages/core/src/components/DateRangeBlock/__tests__/DateRangeBlockTest.php)

```php
<?php
/** @noinspection PhpUnhandledExceptionInspection */
use Doubleedesign\Comet\Core\{DateRangeBlock};

describe('DateRangeBlock', function() {

    test('Date and month in same month', function() {
        $startDate = new DateTime('2025-06-13');
        $endDate = new DateTime('2025-06-15');
        $dateRangeBlock = new DateRangeBlock(['startDate' => $startDate, 'endDate' => $endDate, 'showYear' => false]);

        $formattedDate = $dateRangeBlock->get_accessible_date_string();
        expect($formattedDate)->toBe('13-15 June');
    });

    test('Date and month in different years, without showing year', function() {
        $startDate = new DateTime('2025-12-20');
        $endDate = new DateTime('2026-01-05');
        $dateRangeBlock = new DateRangeBlock(['startDate' => $startDate, 'endDate' => $endDate, 'showYear' => false, 'showDay' => false]);

        $formattedDate = $dateRangeBlock->get_accessible_date_string();
        expect($formattedDate)->toBe('20 December - 5 January');
    });

    test('Day, date and month in same month', function() {
        $startDate = new DateTime('2025-06-13');
        $endDate = new DateTime('2025-06-15');
        $dateRangeBlock = new DateRangeBlock(['startDate' => $startDate, 'endDate' => $endDate, 'showYear' => false, 'showDay' => true]);

        $formattedDate = $dateRangeBlock->get_accessible_date_string();
        expect($formattedDate)->toBe('Friday 13 - Sunday 15 June');
    });

    test('Date and month with different months, with year', function() {
        $startDate = new DateTime('2025-06-13');
        $endDate = new DateTime('2025-07-15');
        $dateRangeBlock = new DateRangeBlock(['startDate' => $startDate, 'endDate' => $endDate, 'showYear' => true, 'showDay' => false]);

        $formattedDate = $dateRangeBlock->get_accessible_date_string();
        expect($formattedDate)->toBe('13 June - 15 July 2025');
    });
    
    // Note: This is a simplified example and does not cover all possible scenarios.
});
```

## Test pattern

These tests follow the Arrange-Act-Assert (AAA) pattern:
1. **Arrange**: Set up the test by creating instances of `DateTime` for the start and end dates, and instantiate the `DateRangeBlock` with the appropriate options.
2. **Act**: Call the `get_accessible_date_string` method to get the formatted date string.
3. **Assert**: Use the `expect` function to check that the returned value matches the expected string.

[Read more about test patterns](../concepts/patterns.md)

## Principles

This testing approach adheres to the FIRST principles of unit testing:
- **Fast**: The tests run quickly since they do not require any external dependencies or browser interactions.
- **Isolated** (or Independent): Each test is independent and does not rely on the outcome of other tests.
- **Repeatable**: The tests can be run multiple times because all setup is done within the test itself and it does not impact anything outside the test.
- **Self-validating**: The tests use assertions to validate the output, making it clear whether the test passes or fails.
- **Timely**: By using these tests during development, I knew that this functionality was working before proceeding to the next steps of developing the UI component, ensuring maximum value from the tests because they were  available at the right time in the development process. Keeping them in the codebase also supports efficient future changes - not writing tests until then wouldn't be as timely.

[Read more about principles](../concepts/principles.md)