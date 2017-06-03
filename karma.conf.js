const Path = require('path');
const webpackConfig = require('./webpack.config.js');

const includeCoverage = !!process.env.coverage;
const runUnitTests = !process.env.scope || ~process.env.scope.indexOf('unit');
const runAcceptanceTests = process.env.scope && ~process.env.scope.indexOf('acceptance');

console.log(includeCoverage ? 'coverage' : '', runUnitTests ? 'unit' : '', runAcceptanceTests ? 'acceptance' : '');

const config = {
	files: [
		'test/helpers/index.js',
		// fixtures
		{
			pattern: 'test/fixtures/**',
			watched: true,
			served: true,
			included: false
		}
	],
	preprocessors: {
		'test/helpers/index.js': ['webpack'],
	},

	frameworks: ['jasmine', 'jasmine-matchers'],
	reporters: ['dots'],
	webpack: webpackConfig,
	browsers: ['Chrome'],
	customLaunchers: {
		ChromeHeadless: {
			base: 'ChromeCanary',
			flags: [
				'--no-sandbox',
				// See https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md
				'--headless',
				'--disable-gpu',
				// Without a remote debugging port, Google Chrome exits immediately.
				' --remote-debugging-port=9222'
			]
		}
	},
	// logLevel: 'error',
	webpackMiddleware: {
	// 	noInfo: true,
		stats: {
	// 		chunks: false
		}
	}
};

if (runUnitTests) {
	// config.files.unshift('src/**/*.test.js');
	// config.preprocessors['src/**/*.test.js'] = ['webpack'];
}

if (runAcceptanceTests) {
	// config.files.unshift('test/acceptance/*.test.js');
	// config.preprocessors['test/acceptance/*.test.js'] = ['webpack'];
}

if (includeCoverage) {
	config.reporters.push('coverage-istanbul');
	config.coverageIstanbulReporter = {
		reports: ['html'],
		fixWebpackSourcePaths: false,
		dir: Path.join(__dirname, 'test/coverage'),
	};

	config.webpack.module.rules[0].options = {
		plugins: ['istanbul']
	};
}

module.exports = function(c) {
	c.set(config);
};
