# Troubleshooting

This page is a general dumping ground for troubleshooting tips and common issues encountered when working with the tools and techniques discussed in this documentation. 

:::details Time-out connecting to debugging client, waited: 200 ms. Tried: localhost:9003 (through xdebug.client_host/xdebug.client_port)
If you encounter this error in PhpStorm when trying to debug with Xdebug, you just need to listen for debug connections (by default, the button for this is in the top right corner of the IDE, next to the Run options) or turn off debugging mode in your `php.ini` file if you are not actively debugging.

This warning should not affect the outcome of your unit tests, but can slow them down, as well as slow down your local dev site if you have one running with the same PHP configuration.
:::

:::details When using Laravel Herd for PHP, running tests with Xdebug on in PhpStorm causes it to stop in the dump loader
Go to `Settings -> PHP -> Debug` and in the Xdebug section, uncheck "Force break at first line when a script is outside the project".
:::

:::details When using Laravel Herd for a WordPress site, I get 502 Bad Gateway errors
If you have Xdebug enabled but are not actively debugging, you may encounter 502 Bad Gateway errors because connecting to the Xdebug client is timing out. You can turn off Xdebug entirely if you aren't using it at all, but if you are using it for coverage reporting you can update the enabled modes.

Open the `php.ini` file for the instance of PHP you are using (which you can find in the Herd Dashboard -> PHP, right-clicking on the version and selecting "Open php.ini directory") and look for `xdebug.mode` and remove `debug`. Restart Herd services (either in the UI or by running `herd restart` in the terminal) and try again.

In my experience, setting `xdebug.mode=off` does not unit test impact coverage reporting when I have `<ini name="xdebug.mode" value="coverage"/>` set in my `phpunit.xml` file, but if you find it does, you can try setting `xdebug.mode=coverage` in the `php.ini` file as it seems to only be the `debug` mode that causes the 502 errors.

You can find more information about Xdebug modes in the [Xdebug documentation](https://xdebug.org/docs/all_settings#xdebug.mode).

:::
