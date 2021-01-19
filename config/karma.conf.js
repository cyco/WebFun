const Webpack = require("webpack");
const webpackConfig = require("./webpack.test.js");

const Path = require("path");
const Paths = require("./paths");

const ci = !!+process.env.ci;
const includeCoverage = !!process.env.coverage || ci;
const includeJunit = !!process.env.junit || ci;
const runUnitTests = !process.env.scope || ~process.env.scope.indexOf("unit");
const runAcceptanceTests = process.env.scope && ~process.env.scope.indexOf("acceptance");

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
		"test/context/*.ts": ["webpack"]
	},
	frameworks: ["jasmine", "jasmine-matchers", "webpack"],
	plugins: [
		"karma-chrome-launcher",
		"karma-coverage",
		"karma-coverage-istanbul-reporter",
		"karma-firefox-launcher",
		"karma-jasmine",
		"karma-jasmine-matchers",
		"karma-sonarqube-reporter",
		"karma-sourcemap-loader",
		"karma-webpack"
	],
	reporters: ["dots"],
	browsers: ["ChromeHeadless"],
	webpack: webpackConfig,
	watch: false,
	singleRun: true,
	client: {
		jasmine: { random: false }
	},
	logLevel: "error",
	webpackMiddleware: {
		stats: {
			chunks: false
		}
	},
	reportSlowerThan: 500
};

delete config.webpack.entry;
config.webpack.stats = "errors-only";
config.webpackMiddleware = {
	stats: "errors-only"
};

const scopes = [];
runUnitTests && scopes.push("unit");
runAcceptanceTests && scopes.push("acceptance");
config.files.push({ pattern: "test/context/" + scopes.join("_") + ".ts", watched: false });

let name;
if (runUnitTests && runAcceptanceTests) {
	name = "full";
} else if (runAcceptanceTests) {
	name = "acceptance";
} else {
	name = "unit";
}

if (includeCoverage) {
	const fileName = name + ".lcov";
	config.devtool = "eval-source-map";
	config.reporters.push("coverage-istanbul");
	config.coverageIstanbulReporter = {
		"fixWebpackSourcePaths": true,
		"reports": ["lcovonly", ...(!ci ? ["html"] : [])],
		"dir": Paths.testReportRoot,
		"report-config": {
			lcovonly: {
				file: fileName
			}
		},
		"file": fileName
	};

	config.webpack.module.rules[0].use[0].options.plugins = ["istanbul"];

	config.reporters.push("ingame-coverage");
	config.frameworks.push("ingame-coverage");
	config.ingameCoverageReporter = {
		outputFile: Path.join(Paths.assetsRoot, "ingame-coverage.json")
	};
	config.plugins.push(require("../test/helpers/ingame-coverage-reporter"));
}

if (includeJunit && false) {
	config.reporters.push("sonarqube");

	config.sonarqubeReporter = {
		basePath: "test",
		filePattern: "**/*.test.*",
		encoding: "utf-8",
		outputFolder: "test/reports",
		legacyMode: false,
		reportName: _ => {
			return [name].concat("xml").join(".");
		}
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

module.exports = function (c) {
	c.set(config);
};
