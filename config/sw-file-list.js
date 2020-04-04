const FS = require("fs");
const Path = require("path");
const Paths = require("./paths");

const listDirectory = directory =>
	Array.prototype.concat.apply(
		[],
		FS.readdirSync(directory).map(file =>
			FS.statSync(directory + "/" + file).isDirectory()
				? listDirectory(directory + "/" + file)
				: [Path.join(directory, "/", file)]
		)
	);

const DefaultOptions = {
	marker: "[]",
	directory: Paths.buildRoot,
	file: null,
	test: true
};

module.exports = (options = {}) => compiler => {
	options = Object.assign({}, DefaultOptions, options);
	compiler.hooks.afterEmit.tap("SWInjectFileList", () => {
		const test = false
			? null
			: typeof options.test === "function"
			? v => v
			: typeof options.test === "boolean"
			? v => () => v
			: options.test instanceof RegExp
			? v => file => file.test(v)
			: () => () => false;
		const files = listDirectory(options.directory)
			.map(p => p.substr(options.directory.length + 1))
			.filter(test(options.test));
		const serviceWorkerSource = FS.readFileSync(options.file, { encoding: "utf-8" });
		const newServiceWorkerSource = serviceWorkerSource.replace(options.marker, JSON.stringify(files));
		FS.writeFileSync(options.file, newServiceWorkerSource, { encoding: "utf-8" });
	});
};
