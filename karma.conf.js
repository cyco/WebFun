const Path = require("path");
const Webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const includeCoverage = !!process.env.coverage;
const runUnitTests = !process.env.scope || ~process.env.scope.indexOf("unit");
const runAcceptanceTests = process.env.scope && ~process.env.scope.indexOf("acceptance");
const runPerformanceTests = process.env.scope && ~process.env.scope.indexOf("performance");

console.log(includeCoverage ? "coverage" : "", runUnitTests ? "unit" : "", runAcceptanceTests ? "acceptance" : "");

const config = {
	basePath: "./",
	files: [ {
		pattern: "game-data/**",
		watched: true,
		served: true,
		included: false
	}, {
		pattern: "test/fixtures/**",
		watched: true,
		served: true,
		included: false
	} ],
	preprocessors: {
		"test/context/*.js": [ "webpack" ]
	},
	frameworks: [ "jasmine", "jasmine-matchers" ],
	reporters: [ "dots" ],
	webpack: webpackConfig,
	browsers: [ "ChromeHeadless" ],
	customLaunchers: {
		ChromeHeadless: {
			base: "ChromeCanary",
			flags: [
				"--no-sandbox",
				"--headless",
				"--disable-gpu",
				" --remote-debugging-port=9222"
			]
		},
		FirefoxHeadless: {
			base: "FirefoxNightly",
			flags: [
				"--headless",
			]
		}
	},
//	logLevel: 'error',
	webpackMiddleware: {
//		noInfo: true,
		stats: {
//			chunks: false
		}
	}
};

delete config.webpack.entry;

if (includeCoverage) {
	let fileName = "lcov.info";
	if (runUnitTests && !runAcceptanceTests) {
		fileName = "unit.lcov";
	} else if (runAcceptanceTests && !runUnitTests) {
		fileName = "acceptance.lcov";
	}


	config.reporters.push("coverage-istanbul");
	config.coverageIstanbulReporter = {
		reports: [ "lcovonly" ],
		fixWebpackSourcePaths: true,
		dir: Path.join(__dirname, "../test/coverage"),
		"report-config": {
			lcovonly: {
				file: fileName
			}
		},
		file: fileName
	};

	config.webpack.module.rules.push({
		test: /\.(ts|js)$/,
		use: {
			loader: "istanbul-instrumenter-loader"
		},
		include: Path.resolve(__dirname, "../src"),
		enforce: "post"
	});
}

if (runUnitTests) {
	config.files.push({ pattern: "test/context/unit.js", watched: false });
}

if (runPerformanceTests) {
	config.files.push({ pattern: "test/context/performance.js", watched: false });
}

if (runAcceptanceTests) {
	config.files.push({ pattern: "test/context/acceptance.js", watched: false });

	const environment = new Webpack.DefinePlugin({
		"process.acceptance": JSON.stringify({
			size: (process.env.size !== undefined ? +process.env.size : undefined),
			planet: (process.env.planet !== undefined ? +process.env.planet : undefined),
			seed: (process.env.seed !== undefined ? +process.env.seed : undefined)
		})
	});

	config.webpack.plugins = config.webpack.plugins || [];
	config.webpack.plugins.push(environment);
}

module.exports = function (c) {
	c.set(config);
};
