class FileListPlugin {
	constructor(options) {
		this.options = Object.assign({}, options, { output: "file-list.json", filter: () => true });
	}

	apply(compiler) {
		compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, callback) => {
			const filelist = Object.keys(compilation.assets).filter(this.options.filter);
			compilation.assets[this.options.output] = {
				source: () => JSON.stringify(filelist),
				size: () => filelist.length
			};
			callback();
		});
	}
}

module.exports = FileListPlugin;
