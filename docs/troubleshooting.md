# Troubleshooting

This page is a general dumping ground for troubleshooting tips and common issues encountered when working with the tools and techniques discussed in this documentation. 

:::details Time-out connecting to debugging client, waited: 200 ms. Tried: localhost:9003 (through xdebug.client_host/xdebug.client_port)
If you encounter this error in PhpStorm when trying to debug with Xdebug, you just need to listen for debug connections. By default, the button for this is in the top right corner of the IDE, next to the Run options.

If you aren't trying to debug with Xdebug, it's not essential to do this - the warning should not affect your tests.
:::

:::details When using Laravel Herd for PHP, running tests with Xdebug on in PhpStorm causes it to stop in the dump loader
Go to `Settings -> PHP -> Debug` and in the Xdebug section, uncheck "Force break at first line when a script is outside the project".
:::
