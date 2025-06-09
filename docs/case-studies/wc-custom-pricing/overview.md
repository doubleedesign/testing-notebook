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

## Testing types

In this case study, I focus on the custom pricing functionality specifically and cover using unit, integration, and 
end-to-end testing for this:
- [Part 1: Unit testing](./wp-unit.md) - testing the custom pricing functions in isolation, without a real site or database
- [Part 2: Integration testing](./wp-integration.md) - testing the custom pricing functionality in the context of a real WooCommerce dev/staging site instance, by using the REST API to fetch real data while still being isolated from the front-end and other parts of the system
- [Part 3: End-to-end testing](./wp-e2e.md) - testing complete user journeys in a real WooCommerce dev/staging site instance, in the browser and with the real theme and other plugins, to ensure that the custom pricing functionality works as expected in the context of the whole site.

In real projects, it is common for me to also need to develop custom front-end template parts, which would be a use case for component and/or visual regression testing, which may form the topic of a future case study.

## Findings

Many of the example tests in this case study test the same requirements in different ways, which gives us a good opportunity to clearly and fairly assess the pros and cons of each testing type in action.

:::important
To come.
:::