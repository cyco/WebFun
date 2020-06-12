const {OriginalSource} = require('webpack-sources');

class SpyOnImportsWebpackPlugin {
	apply(compiler) {
		compiler.hooks.emit.tapAsync("spy-on-imports", (compilation, callback) => {
			compilation.chunks.forEach(chunk => {
				chunk.files.forEach(filename => {
					const search = /exports, "([a-z0-9A-Z_]+)", \{\n\s+enumerable: true,\n\s+get: function get\(\) \{\n\s+return ([a-z0-9A-Z_]+)\.([a-z0-9A-Z_]+)/g

					let source = compilation.assets[filename].source();
					let result = null;
					while ((result = search.exec(source)) !== null) {
						const index = result.index;
						const exportName = result[1];
						const moduleName = result[2];
						const importName = result[3];
					
						const prefix = source.slice(0, result.index);
						const suffix = source.slice(result.index + result[0].length);
						const newContent = 'exports, "'+exportName+'", {\nenumerable: true,set: function(v) { '+moduleName+'.'+importName+' = v; },\nget: function get() {\nreturn '+moduleName+'.'+importName;

						source = prefix + newContent + suffix;
					}

					compilation.updateAsset(
						filename,
						old => new OriginalSource(source, filename)
					);
				});
			});

			callback();
		});
	}
}

module.exports = SpyOnImportsWebpackPlugin;
