---
title: PHP Trait
heading: Unit testing a PHP trait
order: 3
source_lang: [PHP]
test_type: [Unit]
test_tools: [Pest]
sidebarDepth: 0
---

## Context

[Comet Components](https://cometcomponents.io) is a UI component library written in object-oriented PHP. It uses [PHP traits](https://www.php.net/manual/en/language.oop5.traits.php) for shared foundational properties that are used across many different classes, independent of their inheritance relationships. Examples include `ColorTheme`, `LayoutOrientation`, and `LayoutAlignment`.

Here's a (truncated) example of how one of these traits works:

```php
namespace Doubleedesign\Comet\Core;

trait ColorTheme {
    /**
     * @description Colour keyword for the fill or outline colour
     */
    protected ?ThemeColor $colorTheme;

    /**
     * @description Retrieves the relevant properties from the component $attributes array, validates them, and assigns them to the corresponding component instance field.
     */
    protected function set_color_theme_from_attrs(array $attributes, ?ThemeColor $default = null): void {
        $this->colorTheme = isset($attributes['colorTheme'])
            ? ThemeColor::tryFrom($attributes['colorTheme'])
            : $default;

        if ($this->colorTheme !== null) {
            $this->add_attributes(['data-color-theme' => $this->colorTheme->value]);
        }
    }
}

```

## The problem

Like abstract classes, traits can't be directly instantiated. We can't create a plain `ColorTheme`, for example - we can only create instances of the various classes that use a `ColorTheme`. This isn't isolated enough for me - I want to test this foundational thing on its own.

## The solution

Fortunately, there's a way around this! What we can do is create a helper function that returns a generic class that implements the trait we want to test. They shouldn't implement any more than that, and should generally be as minimal as possible.

Here's an example for the `ColorTheme` unit tests:

```php
/**
 * Function to create a generic component class that uses the trait
 * allowing it to stay local to this test/file
 */
function create_component_with_color_theme(array $attributes): object {
    return new class($attributes) {
        use ColorTheme;
        private array $rawAttributes = [];

        public function __construct(array $attributes) {
            $this->set_color_theme_from_attrs($attributes);
        }

        public function get_color_theme() {
            return $this->colorTheme;
        }

        // Simulate adding attributes to the component like Renderable does,
        // but keep them in this instance for isolation
        public function add_attributes(array $attributes): void {
            $this->rawAttributes = array_merge($this->rawAttributes, $attributes);
        }
    };
}
```

Then we can write tests like this:

```php
describe('ColorTheme', function() {

    test('sets valid value', function() {
        $component = create_component_with_color_theme(['colorTheme' => 'secondary']);

        expect($component->get_color_theme())->toBe(ThemeColor::SECONDARY);
    });

    test('sets null background color when the provided value is not a ThemeColor', function() {
        $component = create_component_with_color_theme(['colorTheme' => '#FFF']);

        expect($component->get_color_theme())->toBeNull();
    });

});
```

## Principles

This approach is aligned with the [FIRST principles](../concepts/principles.md) of being **isolated** and **repeatable**. We are testing only the trait, with nothing else present that could interfere; and we are doing so with no dependencies or dynamic data that could cause a different result.