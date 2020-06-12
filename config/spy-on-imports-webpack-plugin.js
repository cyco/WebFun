const { ReplaceSource } = require('webpack-sources');

class SpyOnImportsWebpackPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync("spy-on-imports", (compilation, callback) => {
			compilation.chunks.forEach(chunk => {
				chunk.files.forEach(filename => {
					const search = /exports, "([a-z0-9A-Z_]+)", \{\n\s+enumerable: true,\n\s+get: function get\(\) \{\n\s+return ([a-z0-9A-Z_]+)\.([a-z0-9A-Z_]+)/g

					const source = new ReplaceSource(compilation.assets[filename], filename)
					const sourceCode = source.source();
					let result = null;
					while ((result = search.exec(sourceCode)) !== null) {
						const index = result.index;
						const exportName = result[1];
						const moduleName = result[2];
						const importName = result[3];
					
						const newContent = 'exports, "'+exportName+'", {\nenumerable: true,set: function(v) { '+moduleName+'.'+importName+' = v; },\nget: function get() {\nreturn '+moduleName+'.'+importName;

						source.replace(result.index, result.index + result[0].length, newContent)
					}

					compilation.updateAsset(
						filename,
						old => source
					);
				});
			});

			callback();
		});
	}
}

module.exports = SpyOnImportsWebpackPlugin;
