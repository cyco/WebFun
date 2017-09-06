const Path = require("path");
const Webpack = require("webpack");
const NodeExternals = require("webpack-node-externals");

module.exports = {
	entry: "./tools/generate-world.js",
	output: {
		filename: "generate-world.bin.js",
		path: Path.resolve(__dirname, "tools")
	},
	externals: [NodeExternals()],
	resolve: {
		extensions: [".js", ".ts"],
		alias: {
			"src": Path.resolve(__dirname, "src"),
			"std": Path.resolve(__dirname, "src/std"),
			"std.dom": Path.resolve(__dirname, "src/std.dom"),
			"std.webgl": Path.resolve(__dirname, "src/std.webgl"),
			"test-helpers": Path.resolve(__dirname, "test/helpers"),
			"fs": Path.resolve(__dirname, "test/helpers/polyfill/fs.js"),
			"path": Path.resolve(__dirname, "test/helpers/polyfill/path.js"),
			"libs": Path.resolve(__dirname, "src/libs.js"),
			// disable zlib (imported from KaitaiStream)
			"zlib": Path.resolve(__dirname, "src/util/empty.js")
		},
		unsafeCache: true
	},
	module: {
		rules: [{
			/* JavaScript / Babel */
			test: /\.js?$/,
			loader: "babel-loader",
			include: [
				Path.resolve(__dirname, "src"),
				Path.resolve(__dirname, "tools")
			],
			exclude: [
				"node_modules",
				Path.resolve(__dirname, "src/editor"),
				Path.resolve(__dirname, "src/debug")
			]
		}, {
			/* JavaScript / Babel */
			test: /\.js?$/,
			loader: "babel-loader",
			include: [
				Path.resolve(__dirname, "src/editor"),
				Path.resolve(__dirname, "src/debug"),
				Path.resolve(__dirname, "test/helpers")
			]
		}, {
			/* JavaScript / Babel */
			test: /\.tsx?$/,
			loader: "awesome-typescript-loader",
			include: [
				Path.resolve(__dirname, "src"),
				Path.resolve(__dirname, "tools")
			],
			exclude: [
				"node_modules"
			],
			options: { configFileName: "./config/tsconfig.json" }
		}, {
			/* Styles */
			test: /\.scss$/,
			use: [{
				loader: "style-loader"
			}, {
				loader: "css-loader"
			}, {
				loader: "sass-loader",
				options: {
					includePaths: ["src/_style"]
				}
			}],
			exclude: [
				"node_modules"
			]
		}, {
			/* Shader */
			test: /\.glsl?$/,
			loader: "webpack-glsl-loader"
		}, {
			/* Kaitai-Struct definitions */
			test: /\.ksy$/,
			loader: "kaitai-struct-loader"
		}, {
			/** fonts **/
			test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: "url-loader?limit=10000&mimetype=application/font-woff"
		}, {
			test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: "file-loader"
		}]
	},
	cache: true,
	plugins: [],
	target: "node"
};
