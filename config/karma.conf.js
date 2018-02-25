const Path = require("path");
const Webpack = require("webpack");
const webpackConfig = require("./webpack.test.js");

const Paths = require("./paths");

const intellijCoverageParameterName = "--coverageTempDir=";
const intellijCoverageArg = process.argv.find(s => s.indexOf(intellijCoverageParameterName) === 0);
const customCoverageDirectory = intellijCoverageArg
	? intellijCoverageArg.substr(intellijCoverageParameterName.length)
	: null;

const includeCoverage = !!process.env.coverage || customCoverageDirectory;
const runUnitTests = !process.env.scope || ~process.env.scope.indexOf("unit");
const runAcceptanceTests = process.env.scope && ~process.env.scope.indexOf("acceptance");
const runPerformanceTests = process.env.scope && ~process.env.scope.indexOf("performance");

const projectRoot = Path.resolve(__dirname, "../");
process.chdir(projectRoot);

const config = {
	basePath: projectRoot,
	files: [
		"test/helpers/index.js",
		{
			pattern: "test/fixtures/**",
			watched: false,
			served: true,
			included: false
		}
	],
	preprocessors: {
		"test/helpers/index.js": ["webpack"],
		"test/context/*.js": ["webpack"]
	},
	frameworks: ["jasmine", "jasmine-matchers"],
	reporters: ["dots", "touchbar"],
	browsers: ["ChromeHeadless"],
	webpack: webpackConfig,
	customLaunchers: {
		ChromeHeadless: {
			base: "ChromeCanary",
			flags: ["--no-sandbox", "--disable-gpu", "--headless", " --remote-debugging-port=9222"]
		},
		FirefoxHeadless: {
			base: "FirefoxNightly",
			flags: ["--headless"]
		}
	},
	watch: true,
	singleRun: false,
	logLevel: "error"
};

delete config.webpack.entry;
config.webpack.devServer.contentBase.push(Path.resolve(Paths.testRoot, "fixtures"));

if (includeCoverage) {
	let fileName = "lcov.info";

	config.reporters.push("coverage-istanbul");
	config.coverageIstanbulReporter = {
		reports: ["lcovonly", "html"],
		fixWebpackSourcePaths: true,
		dir: customCoverageDirectory ? customCoverageDirectory : Paths.coverageRoot,
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
		include: Paths.sourceRoot,
		exclude: /(debug|test\.js)/,
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
			size: process.env.size !== undefined ? +process.env.size : undefined,
			planet: process.env.planet !== undefined ? +process.env.planet : undefined,
			seed: process.env.seed !== undefined ? +process.env.seed : undefined
		})
	});

	config.webpack.plugins = config.webpack.plugins || [];
	config.webpack.plugins.push(environment);
}

config.webpack.stats = false;
config.webpack.devServer.stats = false;
config.webpackDevServer = config.webpack.devServer;

module.exports = function(c) {
	c.set(config);
};
