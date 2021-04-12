Build System
============

*WebFun* uses the package manager [yarn](https://yarnpkg.com) to manage dependencies and run build scripts.

The following tasks are defined in `package.json` and can be started using `yarn <task-name>` on the command line.

**build** -- Initiate production build.

**build:docs** -- Build this documentation. This script requires `mdbook` to be installed, see [documentation](documentation.md) for details.

**format** -- Format source code files using [eslint](https://eslint.org) & [prettier](https://prettier.io).

**start** -- Start a local web server for development.

**test** -- Run basic test suite once without collecting code coverage.

**test:cont** -- Run unit test whenever a change is detected. This task does not collect collect code coverage for performance reasons.

**test:full** -- Run all tests and collect code coverage.

**test:unit** -- Run unit tests with code coverage enabled.

**test:unit:cont** -- Run unit tests with code coverage whenever a change is detected

Webpack
-------

[Webpack](https://webpack.js.org) is used to bundle scripts and prepare other assets like css stylesheets, fonts and copy static files in production builds. The following configuration files are used for various tasks, all of them are located in the `config` directory:

**webpack.commmon.js** -- A shared configuration that is used as a base for the dev and test configurations.

**webpack.dev.js** -- Configuration for the development task, the development web server with hot module reloading is defined here.

**webpack.test.js** -- Used for running tests

**webpack.prod.js** -- Defines the production build

**webpack.service-worker.js** -- Defines the production build for the service worker script. This is in a separate file because splitting the service worker code via chunks does not produce a file that runs in the service worker context.

### Custom Plugins

WebFun uses a few custom webpack plugins. These are also single-file scripts found in the `config` directory.

**file-list-webpack-plugin** -- Creates a list of files produce during a production build and stores it in a json file. This file is used to pre-load assets when the service worker is installed.

**spy-on-imports-webpack-plugin** -- This plugin rewrites imports created by Webpack so `jasmine.spy` can be used on wildcard module imports to mock dependencies during test execution:

```javascript
import * as UtilModule from "src/util";

describe("some test", () => {
	beforeEach(() => spyOn(UtilModule, "download"));

	it("starts a download", () => {
		subject.doYourThing();

		expect(UtilModule.download).toHaveBeenCalled();
	});
});
```
