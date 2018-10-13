const Path = require("path");
const Webpack = require("webpack");
const webpackConfig = require("./webpack.test.js");

const Paths = require("./paths");

const ci = !!+process.env.ci;
const includeCoverage = !!process.env.coverage || ci;
const includeJunit = !!process.env.junit || ci;
const runUnitTests = !process.env.scope || ~process.env.scope.indexOf("unit");
const runAcceptanceTests = process.env.scope && ~process.env.scope.indexOf("acceptance");
const runPerformanceTests = process.env.scope && ~process.env.scope.indexOf("performance");

const config = {
	basePath: Paths.projectRoot,
	files: [
		{
			pattern: "test/fixtures/**",
			watched: false,
			served: true,
			included: false
		}
	],
	preprocessors: {
		"test/context/*.js": ["webpack"]
	},
	frameworks: ["jasmine", "jasmine-matchers"],
	reporters: ["dots"],
	browsers: ["ChromeHeadless"],
	webpack: webpackConfig,
	customLaunchers: {
		ChromeHeadless: {
			base: "Chrome",
			flags: ["--no-sandbox", "--disable-gpu", "--headless", " --remote-debugging-port=9222"]
		},
		FirefoxHeadless: {
			base: "FirefoxNightly",
			flags: ["--headless"]
		}
	},
	watch: false,
	singleRun: true,
	jasmine: { random: false },
	logLevel: "error",
	webpackMiddleware: {
		stats: {
			chunks: false
		}
	},
	reportSlowerThan: 250
};

delete config.webpack.entry;
config.webpack.stats = "errors-only";
config.webpackMiddleware = {
	stats: "errors-only"
};

var scopes = [];
runUnitTests && scopes.push("unit");
runAcceptanceTests && scopes.push("acceptance");
runPerformanceTests && scopes.push("performance");
config.files.push({ pattern: "test/context/" + scopes.join("_") + ".js", watched: false });

let name;
if (runUnitTests && runAcceptanceTests && runPerformanceTests) {
	name = "full";
} else if (runAcceptanceTests) {
	name = "acceptance";
} else if (runPerformanceTests) {
	name = "performance";
} else {
	name = "unit";
}

if (includeCoverage) {
	let fileName = name + ".lcov";

	config.reporters.push("coverage-istanbul");
	config.coverageIstanbulReporter = {
		reports: ["lcovonly", ...(!ci ? ["html"] : [])],
		fixWebpackSourcePaths: true,
		dir: Paths.testReportRoot,
		"report-config": {
			lcovonly: {
				file: fileName
			}
		},
		file: fileName
	};

	config.webpack.module.rules.push({
		test: /\.(ts|tsx|ts|js)$/,
		use: {
			loader: "istanbul-instrumenter-loader"
		},
		include: Paths.sourceRoot,
		exclude: /(debug|test\.js)/,
		enforce: "post"
	});
}

if (includeJunit) {
	config.reporters.push("junit");
	config.junitReporter = {
		outputFile: Path.resolve(Paths.testReportRoot, name + ".xml"),
		useBrowserName: false
	};

	config.reporters.push("sonarqubeUnit");

	config.sonarQubeUnitReporter = {
		outputFile:
			"." + Path.resolve(Paths.testReportRoot, name + "-sq.xml").substring(Paths.projectRoot.length),
		//		overrideTestDescription: true,
		testPaths: [Paths.testRoot],
		testFilePattern: "*.test.*",
		useBrowserName: false
	};
}

if (runAcceptanceTests) {
	const environment = new Webpack.DefinePlugin({
		"process.acceptance": JSON.stringify({
			size: process.env.size !== undefined ? +process.env.size : undefined,
			planet: process.env.planet !== undefined ? +process.env.planet : undefined,
			seed: process.env.seed !== undefined ? +process.env.seed : undefined
		})
	});

	config.webpack.plugins = config.webpack.plugins || [];
	config.webpack.plugins.push(environment);
}

module.exports = function(c) {
	c.set(config);
};
