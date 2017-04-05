var path = require('path');

module.exports = {
	entry: './src/index.js',
	devtool: 'eval-source-map',
	module: {
		rules: [{
			test: /\.js?$/,
			include: [
				path.resolve(__dirname, "src")
			],
			exclude: [],

			loader: "babel-loader",

			options: {
				presets: ["es2015"]
			},
		}]
	},
	output: {
		filename: 'app.js',
		path: path.resolve(__dirname, 'build')
	}
};
