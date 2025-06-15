---
title: PHP Abstract Class
heading: Unit testing an abstract PHP class
order: 2
source_lang: [PHP]
test_type: [Unit]
test_tools: [Pest]
sidebarDepth: 0
---

## Context

[Comet Components](https://cometcomponents.io) is a UI component library written in object-oriented PHP. It uses [abstract classes](https://www.php.net/manual/en/language.oop5.abstract.php) for shared foundational features that the components themselves extend. For example, there's `UIComponent`, `LayoutComponent`, and `TextComponent`, which are extended by classes for components such as `Container`, `DateBlock`, `CallToAction`, and `PageHeader`.

Being abstract means they can't be directly instantiated. We can't create a plain `LayoutComponent`, for example - we can only create instances of the various types of `LayoutComponent` such as a `Container`, a `Group`, `Columns`, etc.

Here's a (truncated) example of how one of these components works:

```php
<?php
namespace Doubleedesign\Comet\Core;

abstract class LayoutComponent extends UIComponent {
    use BackgroundColor;
    use LayoutAlignment;

    public function __construct(array $attributes, array $innerComponents, string $bladeFile) {
        parent::__construct($attributes, $innerComponents, $bladeFile);
        $this->set_layout_alignment_from_attrs($attributes);
        $this->set_background_color_from_attrs($attributes);
    }

    protected function get_filtered_classes(): array {
        if ((!$this instanceof Column) && (!$this instanceof Steps)) {
            return array_merge(
                parent::get_filtered_classes(),
                ['layout-block']
            );
        }

        return parent::get_filtered_classes();
    }

    /**
     * Default render method (child classes may override this)
     */
    public function render(): void {
        $blade = BladeService::getInstance();

        echo $blade->make($this->bladeFile, [
            'tag'        => $this->tagName->value,
            'classes'    => $this->get_filtered_classes_string(),
            'attributes' => $this->get_html_attributes(),
            'children'   => $this->innerComponents,
        ])->render();
    }
}

```

## The problem

Using abstract classes for the shared features of my component types presents a challenge for unit testing. While testing methods like `get_filtered_classes` (meaning CSS classes) in unit tests for the child component PHP classes will provide [coverage](../concepts/coverage.md), that alone is not isoalated enough for my liking. I want to test the absolute foundations, such as the _default_ implementation of `get_filtered_classes` in a `LayoutComponent`, so that I know that works - which means if a particular component type is behaving badly, I can quickly narrow it down to something about _that_ PHP class. 

## The solution

Fortunately, there's a way around this! What we can do is create a helper function that returns a generic child class of the abstract class we want to test. It shouldn't have any of its own implementations of the abstract class's methods, and generally be kept as minimal as possible.

Here's an example for the `LayoutComponent` unit tests:

```php
/**
 * Function to create a generic component class that extends the abstract class being tested,
 * allowing it to stay local to this test/file
 */
function create_layout_component(array $attributes = [], array $innerComponents = [], string $bladeFile = 'components.test-component'): LayoutComponent {
    return new class($attributes, $innerComponents, $bladeFile) extends LayoutComponent {
        public function render(): void {
            // TODO: Implement render() method.
        }
    };
}
```

Then we can write tests like this:

```php
describe('LayoutComponent', function() {

    it('adds the "layout-block" class to the filtered classes', function() {
        $component = create_layout_component([], [], 'components.test');

        $classes = PestUtils::call_protected_method($component, 'get_filtered_classes');
        expect($classes)->toContain('layout-block');
    });
});
```

## Principles

This approach is aligned with the [FIRST principles](../concepts/principles.md) of being **isolated** and **repeatable**. We are testing only the foundational abstract class, with nothing else present that could interfere; and we are doing so with no dependencies or dynamic data that could cause a different result.