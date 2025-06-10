---
title: Custom Pricing (WooCommerce)
heading: Custom Pricing for a WooCommerce site
order: 0
status: drafting
source_lang: [PHP]
test_type: [Unit,Integration,E2E]
test_tools: [Pest,Playwright]
sidebarDepth: 0
---

This case study showcases an example of how different types of testing can be used to test the same functionality.

I'm under no illusions that most developers will be able to utilise all possible testing types for absolutely optimal coverage in the average client project - or that it's even beneficial to do so. The purpose of this case study is not to suggest that you need to use all of these testing types for a similar project; rather it is to demonstrate and explore:
- some of the ways that different types of testing can complement each other
- some of the pros and cons you might consider when choosing just one or two types of testing for your project.

[[toc]]

## The case study brief

This case study is not of a single real project or client, but rather a combination of common requirements that I encountered when I worked at an agency with multiple ecommerce clients.

"Demo Dance" is a fictional dancewear supplier that sells shoes, leotards, tights, accessories, etc., to private individuals as well as providing bulk ordering to dance schools and studios. They require special pricing rules for different customer groups:
- Anonymous or general retail customers
- Individuals who register as a member of the Demo Dance community
- Dance schools and studios who register as a business customer.

Pricing requirements include:
- Price fields per product:
  - Regular price (built into WC)
  - Sale price (built into WC)
  - Individual member price (custom field)
  - Dance school price (custom field)
- School price kicks in at category level 
- Customer should always get the lowest price per item that they are eligible for.

:::note Aren't there plugins for this?
Yes, there are existing plugins that might meet this requirement such as [WooCommerce Role-Based Pricing](https://woocommerce.com/products/role-based-pricing-for-woocommerce/). However, that's really not the point here - this case study is about demonstrating testing as part of the workflow for a custom implementation of something. So if you're the kind of person who immediately reaches for a plugin, please imagine that:
- the requirements are not met by any existing plugin, or 
- there is a business reason to implement a custom solution[^1], or
- we are developing a plugin that will be distributed for use on other sites with similar requirements.
:::

[^1]: Business reasons why a custom solution was chosen over existing plugins can include: the client not wanting to pay ongoing costs for a premium plugin; the client or agency wanting to avoid the risk of a plugin being abandoned or not updated; client or agency policy on limiting third-party plugins for core functionality; the agency wanting to limit the feature to the client's exact requirements rather than bear the risks introduced by a plugin that has more features and options and could add more at any time.

## Some background understanding

### Individual product prices in WooCommerce

**Note:** This case study uses simple products only at this stage.

There are three built-in price fields in WooCommerce that we need to understand:
1. `regular_price` - the normal price of the product.
2. `sale_price` - the price of the product when it is on sale.
3. `price` - the price that is actually given to the customer, which (by default) is either the `regular_price` or the `sale_price`, depending on whether the product is on sale.

The code I have written for this case study "intercepts" the setting of the `sale_price` and `price` fields using WooCommerce filter hooks.

It intercepts the setting of the `sale_price` field and sets it to no sale price if the user is a member and the member price is lower, because otherwise the final price field would reflect the sale price even if the member price is lower; and we don't want to set the sale price to the member price, as that would be misleading. This way, members simply do not see sale prices if the member price is lower.

It does not intercept the setting of the `regular_price` field, to ensure minimal data changes and enable front-end display of the regular price to members so they can see the discount they're getting (note: that is not automatic; it needs to be implemented in the front-end templates).

I have added a field to the product editor for each of the custom prices, which are stored in product meta and thus can be retrieved using the `get_post_meta()` function. This data is used in the function that updates the `price` field.

There are a few ways you can check the raw data of a product if you know its ID:
:::details In the database
**Note:** This method is unaffected by the custom code and does not account for user roles or other context.

```sql
SELECT * from wp_postmeta WHERE post_id = 117
AND meta_key IN ('_regular_price', '_sale_price', '_price', '_member_price'); 
```
:::

:::details Using the REST API
**Note:** The results you see here will depend on the user role you query with.

See [Using the WP REST API to integration test a plugin](./wp-integration.md) for examples of how to do this.
:::

:::details Temporarily adding debugging code
**Note:** The results you see here will depend on the user role you have when you refresh the page.

If you have `WP_DEBUG_LOG` enabled in `wp.config.php`, you can temporarily add some debugging code to your theme's `functions.php` file to log the product data. This will log the product data to the debug log when you refresh the page in the browser, which you can then view in `wp-content/debug.log`.

```php
add_action('init', function() {
    $product = wc_get_product(117);
    error_log(print_r([
        'price' => $product->get_price(),
        'sale_price' => $product->get_sale_price(),
        'regular_price' => $product->get_regular_price(),
        'member_price' => get_post_meta($product->get_id(), '_member_price', true),
    ], true));
}, 100);
```

If you are using Laravel Herd for your local server and have Symfony VarDumper installed in your project, you can use the `dump()` function and get the data served to you in [Herd's dumps window](https://herd.laravel.com/docs/windows/herd-pro/dumps#dumps). This method is unaffected by `WP_DEBUG` and `WP_DEBUG_LOG` settings in `wp-config.php`.

```php
add_action('init', function() {
	$product = wc_get_product(117);
	dump([
		'price' => $product->get_price(),
		'sale_price' => $product->get_sale_price(),
		'regular_price' => $product->get_regular_price(),
		'member_price' => get_post_meta($product->get_id(), '_member_price', true),
	]);
}, 100);
```

**Note:** If you are using a theme with PHP templates, you don't need to know the ID in advance - you can use a WooCommerce template override for `content-single-product.php` and use its `$product` global variable, and just do the `error_log()` or `dump()` in the template file (without the `add_action`), which will then log the data for the product being viewed.

:::


## Testing types

In this case study, I focus on the custom pricing functionality specifically and cover using unit, integration, and end-to-end testing for this:
- [Part 1: Unit testing](./wp-unit.md) - testing the custom pricing functions in isolation, without a real site or database
- [Part 2: Integration testing](./wp-integration.md) - testing the custom pricing functionality in the context of a real WooCommerce dev/staging site instance, by using the REST API to fetch real data while still being isolated from the front-end and other parts of the system
- [Part 3: End-to-end testing](./wp-e2e.md) - testing complete user journeys in a real WooCommerce dev/staging site instance, in the browser and with the real theme and other plugins, to ensure that the custom pricing functionality works as expected in the context of the whole site.

In real projects, it is common for me to also need to develop custom front-end template parts, which would be a use case for component and/or visual regression testing. For example, including the regular price alongside the member price to show the member their discount would require a custom template override.

## Findings

Many of the example tests in this case study test the same requirements in different ways, which gives us a good opportunity to clearly and fairly compare some of the capabilities and caveats of the different testing types.

The below table summarises the functionality coverage and findings from testing the _item pricing_ functionality only (not the bulk pricing at this stage).

<table class="case-study-findings-table">
   <thead>
        <tr>
            <th></th>
            <th>Unit tests</th>
            <th>Integration tests</th>
            <th>E2E tests</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Speed</th>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Key tools used</th>
            <td>
                <ul>
                    <li>Pest</li>
                    <li>Xdebug (for coverage)</li>
                    <li>WP_Mock</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>Pest</li>
                    <li>Xdebug (for coverage)</li>
                    <li>Guzzle (HTTP client)</li>
                </ul>
            </td>
            <td></td>
        </tr>
        <tr>
            <th scope="row" rowspan="2">Setup</th>
            <td style="text-indent:0">
                <ul>
                    <li>No dev/staging site required</li>
                </ul>
            </td>
            <td colspan="2" style="text-indent:0">
                <ul>
                    <li>Dev/staging site with test data, test user accounts, WooCommerce, the custom pricing plugin, and default theme* (*see note 1)</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td style="text-indent:0">
                <ul>
                    <li>Mocks and stubs for data and dependencies</li>
                </ul>
            </td>
           <td style="text-indent:0">
                <ul>
                    <li>Configuration for local/test environment access to WC REST API by test users</li>
                </ul>
            </td>
            <td></td>
        </tr>
        <tr>
            <th scope="row">Sale prices are correct</th>
            <td>
                <ul>
                    <li>✅ Calculation function</li>
                    <li>✅ Function applied on expected filter hook</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>✅ End result<br/> (stored value)</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>✅ End result<br/> (displayed value)</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th scope="row">Regular prices are not modified</th>
            <td>
                <ul>
                    <li>⛔ Not directly tested</li>
                </ul>
            </td>
             <td>
                <ul>
                    <li>✅ End result<br/> (stored value)</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>🔷 Inferred (see note 2)</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th scope="row">Final prices are correct</th>
            <td>
                <ul>
                    <li>✅ Calculation function</li>
                    <li>✅ Function applied on expected filter hook</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>✅ End result<br/> (stored value)</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>✅ End result<br/> (displayed value)</li>
                </ul>
            </td>
        </tr>
        <tr>
            <th scope="row">Custom price field values are correct</th>
            <td>
                <ul>
                    <li>⛔ Not directly tested - testing the basic saving of WordPress meta is out of scope</li>
                </ul>
            </td>
             <td>
                <ul>
                   <li>✅ End result<br/> (stored value)</li>
                </ul>
            </td>
            <td>
                <ul>
                    <li>✅ End result<br/> (displayed value)</li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>

:::details Notes
- **Note 1:** I used this setup for both integration and E2E to keep the case study as simple as possible, and it is 
the way I would usually recommend doing integration testing (minimal dependencies - test only the thing you're building, in relative isolation). For a real client, E2E tests would also be conducted with their custom theme and full suite of plugins, which would help us identify two things:
  1. Whether any other plugin or theme code interferes with the custom pricing functionality
  2. Whether the custom theme or additional plugins introduce significant performance concerns (i.e., do the E2E tests run much slower compared with the minimal setup?).

- **Note 2:** That the regular price is stored correctly is inferred from the test cases for non-members being correct: They get the expected regular price, or the expected sale price with the regular price displayed alongside it. If the regular price was also shown alongside the member price, this would strengthen the assumption that the regular price is being stored correctly.
:::