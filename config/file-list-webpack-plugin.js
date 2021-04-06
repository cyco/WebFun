const DefaultOptions = { output: "file-list.json", static: [], filter: () => true };

class FileListPlugin {
	constructor(options) {
		this.options = Object.assign({}, DefaultOptions, options);
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, callback) => {
			const filelist = Object.keys(compilation.assets)
				.filter(this.options.filter)
				.concat(this.options.static);
			compilation.assets[this.options.output] = {
				source: () => JSON.stringify(filelist),
				size: () => filelist.length
			};
			callback();
		});
	}
}

module.exports = FileListPlugin;
