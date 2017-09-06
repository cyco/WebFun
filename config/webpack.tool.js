const Path = require("path");
const Webpack = require("webpack");
const NodeExternals = require("webpack-node-externals");

const Paths = require('./paths');
const BaseConfig = require('./webpack.base.js');

BaseConfig.entry = Path.resolve(Paths.toolsRoot, 'generate-world.js');
BaseConfig.output = {
	filename: "generate-world.bin.js",
	path: Paths.toolsRoot
};

module.exports = BaseConfig;
