const os = require("os");
const path = require("path");
const fs = require("fs");

const IngameCoverageReporter = function(baseReporterDecorator, config, logger) {
	const outputFile = config.ingameCoverageReporter.outputFile;
	baseReporterDecorator(this);
	const log = logger.create("reporter.ingamecoverage");

	this.onRunStart = function(browsers) {
		// log.error("onRunStart");
	};

	this.onBrowserStart = function(browser) {
		// log.error("onBrowserError");
	};

	this.onBrowserError = function(browser, error) {
		// log.error("onBrowserError");
	};

	this.onBrowserComplete = function(browser, result) {
		// log.error("onBrowserComplete", Object.keys(result));
		const coverage = result.webFunCoverage || {};
		fs.writeFileSync(outputFile, JSON.stringify(coverage));
	};

	this.onRunComplete = function(browsers, results) {
		// log.error("onRunComplete");
	};

	this.specSuccess = function(browser, result) {
		// log.error("specSuccess", result.webFunCoverage);
	};

	this.specSkipped = function(browser, result) {};
	this.specFailure = function(browser, result) {
		// log.error("specFailure");
	};

	this.onExit = function(done) {
		// log.error("onExit");
		done();
	};
};

IngameCoverageReporter.$inject = ["baseReporterDecorator", "config", "logger"];

const initCoverageCollector = function(files) {
	files.unshift({
		pattern: path.join(__dirname, "/ingame-coverage-collector.js"),
		included: true,
		served: true,
		watched: false
	});
};

initCoverageCollector.$inject = ["config.files"];

module.exports = {
	"framework:ingame-coverage": ["type", initCoverageCollector],
	"reporter:ingame-coverage": ["type", IngameCoverageReporter]
};
