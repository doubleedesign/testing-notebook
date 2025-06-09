---
title: Getting Started
heading: Setting up for testing in your project
---

The exact setup for testing in your project will depend on the nature of your project and the tools and frameworks you are using. Below is some general guidance related to the examples and case studies in this site.

[[toc]]

## PHP, Composer, Node

If you are writing tests in PHP, you will need PHP and Composer installed and available on the command line. If you are writing tests in JavaScript, you will need Node.js and NPM installed and available on the command line.

There are many equally appropriate ways to set up your local development environment to meet this requirement, and if you already develop sites locally then you probably already have some, if not all, of these installed. You can check what's available on your command line like so:

On MacOS, Linux, or WSL (Windows Subsystem for Linux):
```bash
php -v
composer -V
node -v
```

On Windows (PowerShell):
```powershell
Get-Command php
Get-Command composer
Get-Command node
```

If you don't already have these set up or are looking for a recommendation to do it all, I find [Laravel Herd](https://herd.laravel.com/) to be a great solution as it installs all of these as well as [Xdebug](https://xdebug.org/), and also has version management for PHP and Node. The Pro version also includes database management and a really handy [Dumps](https://herd.laravel.com/docs/windows/herd-pro/dumps) feature to view your debugging output.

Other ways include:
- If you're already using WAMP, MAMP, XAMPP, or Local By Flywheel, you already have PHP. You may just need to configure your system environment variables to make it available on the command line.
- If you're on Windows and like to use the command line, you can install each of these using [Chocolatey](https://chocolatey.org/). For Node, you might also be interested in [NVM for Windows](https://github.com/coreybutler/nvm-windows).
- Download and run the installers from the respective sites ([PHP](https://www.php.net/downloads), [Composer](https://getcomposer.org/download/), [Node.js](https://nodejs.org/en/download/)).


## IDE / Code Editor

Regardless of the types of tests you are writing, you will need an IDE or code editor that supports the language and testing framework you are using. Throughout this site I discuss using [PhpStorm](https://www.jetbrains.com/phpstorm/) or [WebStorm](https://www.jetbrains.com/webstorm/) with the [Test Automation](https://plugins.jetbrains.com/plugin/20175-test-automation) plugin enabled. 

PhpStorm contains all the features that WebStorm has, plus additional features for PHP development and testing. So if you are only writing and testing JavaScript code, or are only writing end-to-end tests using JavaScript (e.g., with Cypress or Playwright), you can use either of these. If you're using a completely different language to write end-to-end tests for some reason (such as Java with Selenium), you can just as easily use IntelliJ for a very similar experience.

Other IDEs and code editors such as VS Code can also be used, but you may need to install additional plugins or extensions to get the best experience with the tools you're using, which is outside the scope of this guide.

### General setup advice for PhpStorm/WebStorm

1. Install and enable the JetBrains [Test Automation](https://plugins.jetbrains.com/plugin/20175-test-automation) plugin
2. Ensure the relevant bundled plugins are enabled: PHP, JavaScript and TypeScript, Terminal, Pest
3. Enable coding assistance for Node.js if you're writing JavaScript tests (`File -> Settings > Languages & Frameworks > Node.js and NPM`)
4. In `File -> Settings -> PHP`:
   - configure the CLI interpreter to match the PHP instance you are using in your terminal
   - select the PHP language level appropriate for your project
   - in the `PHP Runtime` tab, click "Sync extensions with interpreter"
5. If you have Xdebug installed but it isn't automatically detected, manually add the path to the debugger extension
6. In `File -> Settings -> PHP -> Debug`, ensure the Xdebug port is set to 9003 (or a custom port if you have configured it differently) and untick "Force break at first line when a script is outside the project"
7. If you want to use the built-in terminal rather than a separate terminal window, go to`File -> Settings -> Terminal` and:
   - set the shell path to your preferred terminal[^1]
   - tick "Shell integration"
   - tick "Add default PHP interpreter to PATH"
   - restart your terminal if you made any changes, and run the commands above to check that PHP, Composer, and Node are available and match the versions set in the PhpStorm/WebStorm settings.

:::important
Once you have installed PhpUnit or Pest in your project, you will also need to come back to the `File -> Settings -> PHP -> Test Frameworks` screen and configure the defaults for that.
:::

## Installing testing tools in your project

Testing frameworks such as PHPUnit, Pest, Playwright, Jest, etc. as well as supporting libraries such as Mockery and React Testing Library are typically installed on a per-project basis. There are some cases where you might need or want to install something globally, but for now I'll focus on the per-project approach.

If you don't already have a `composer.json` (for PHP) or `package.json` for (JavaScript) file in your project, you can create one using the following commands. For some projects, you may need both.

```bash
composer init
```
```bash
npm init
```

Then you can install the specific tools you need for your project. This will add the relevant dependencies to your `composer.json` or `package.json` file, and install them and their dependencies in the `vendor` directory (for PHP) or `node_modules` directory (for JavaScript) in your project.

For example, to install Pest and BrainMonkey for unit testing in a WordPress PHP project:

```bash
composer require --dev pestphp/pest
composer require --dev brain/monkey
```

To install Jest and React Testing Library for unit testing in a React project:

```bash
npm install --save-dev jest @testing-library/react
```

The `--dev` flag in Composer and `--save-dev` in NPM/Yarn/PNPM indicates that these packages are only needed for development and testing, so they will not be included in a production build step if you have one.


[^1]: If you're on Windows and using PowerShell 7 rather than the default Windows PowerShell or are using WSL, it probably won't be in the drop-down list by default, if you can enter the path to the executable manually.

## Configuring your project for testing

Once you have installed the testing tools you need, you will usually need some kind of configuration file to tell the testing framework how to find your test files and any other settings you want to use. The type, name, and location of this file will depend on the testing framework you are using.

For some tools, you may also need or want a "setup" or "bootstrap" file that runs before your tests to set up any necessary environment or configuration. This is often used to load any necessary libraries, global mock functions, or set up global variables. 

### Pest example

:::info
No, that's not a typo - Pest uses PHPUnit under the hood, and uses the same configuration file format.
:::

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/11.5/phpunit.xsd"
         bootstrap="bootstrap.php"
         colors="true"
>
    <php>
        <ini name="display_errors" value="1"/>
        <ini name="display_startup_errors" value="1"/>
        <ini name="error_reporting" value="E_ALL"/>
        <ini name="xdebug.mode" value="coverage"/>
    </php>
</phpunit>
```

```php
<?php
// Basic bootstrap file - runs the Composer autoloader so all expected classes are available
require_once __DIR__ . '/../vendor/autoload.php';
```

:::note
JavaScript examples to come
:::


## PhpStorm/WebStorm Run configurations

Once you have installed your testing framework(s) and supporting libraries, and set up your configuration files, you can create a "Run configuration" template in PhpStorm/WebStorm and/or specific run configurations to run the tests using these files. This is an alternative to running the terminal command yourself which provides a more integrated experience which:
- allows you to run individual tests, files, or all tests in a directory by clicking a button (or a context menu option)
- shows the results in a dedicated "Run" window, with options to filter, sort, and navigate to the test code
- if you have configured your project for [coverage reporting](./concepts/coverage.md) and use the "Run with coverage" option, shows the coverage results in a dedicated "Coverage" window and highlights covered and uncovered lines of code in the editor.

For Pest or PHPUnit, you can first set defaults in `File -> Settings -> PHP -> Test Frameworks`.

For all testing frameworks with built-in or plugin-based support, you can set the rest of the default configuration in `Run -> Edit Configurations` and clicking on the "Edit configuration templates" link in the bottom left corner of the dialog.

Once you have set your templates, you can create specific run configurations from this dialog as well. Alternatively, you can run tests from the test files themselves or the context menu when right-clicking on a test file or directory in the Project view or its editor tab. This creates a temporary run configuration that you can then modify and/or save if you need specific options for that test or directory.

## Writing tests

Once you have configured your development environment, installed project-specific tooling, and configured your project, you're ready to start writing tests!

You can refer to the [Examples](./examples/overview.md) and [Case Studies](./case-studies/overview.md) sections of this site for inspiration and guidance, as well as referring to the documentation for the specific testing framework and libraries you are using.

:::tip
Asking your favourite AI assistant to help you write tests can be really helpful to get started, generate boilerplate or skeleton code, or fill in gaps in your tests efficiently. Tools like [GitHub Copilot](https://github.com/features/copilot) integration in your IDE can also save you a lot of typing (and/or copying and pasting boilerplate) while keeping you in the driver's seat.
:::

:::warning
If using AI to help you write tests, be very vigilant in reviewing the code it generates and ensure it:
- is consistent within the project in terms of style and conventions, tools used, etc
- doesn't introduce new tools that duplicate what your existing ones do (because it introduces unnecessary complexity) 
- doesn't write passing tests for code that is actually broken or incomplete
- doesn't modify your source code without your knowledge or consent, and without you checking that the changes are 
  appropriate and correct (a risk with tools like Cursor or Jetbrains Junie).
- doesn't mock/stub functions that don't actually exist.
:::