/* eslint-disable import/no-nodejs-modules */

import { basename, join } from 'path';

import InertEntryPlugin from 'inert-entry-webpack-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';
import webpack from 'webpack';
import yargs from 'yargs';

import babelrc from './.babelrc.json';

const browserConfig = {
	chrome: {
		target: 'chrome',
		entry: 'chrome/manifest.json',
		environment: 'chrome/environment',
		output: 'chrome',
	},
	edge: {
		target: 'edge',
		entry: 'edge/manifest.json',
		environment: 'edge/environment',
		output: 'edge',
	},
	safari: {
		target: 'safari',
		entry: 'safari/Info.plist',
		environment: 'safari/environment',
		output: 'RES.safariextension',
	},
	firefox: {
		target: 'firefox',
		entry: 'firefox/package.json',
		environment: 'firefox/environment',
		output: 'firefox',
	},
	firefoxbeta: {
		target: 'firefox',
		entry: 'firefox/beta/package.json',
		environment: 'firefox/environment',
		output: 'firefox-beta',
	},
	node: {
		target: 'node',
		entry: 'node/files.json',
		environment: 'node/environment',
		output: 'node',
	},
};

const browsers = (
	typeof yargs.argv.browsers !== 'string' ? ['chrome'] :
	yargs.argv.browsers === 'all' ? Object.keys(browserConfig) :
	yargs.argv.browsers.split(',')
);

const shouldZip = !!yargs.argv.zip;
const isProduction = process.env.NODE_ENV !== 'development';

const configs = browsers.map(b => browserConfig[b]).map(({ target, entry, environment, output }) => {
	// extra transforms for Safari
	const babelConfig = {
		...babelrc,
		...(target === 'safari' ? babelrc.env.safari : {}),
		babelrc: false,
	};

	return {
		entry: `extricate!interpolate!./${entry}`,
		bail: isProduction,
		output: {
			path: join(__dirname, 'dist', output),
			filename: basename(entry),
		},
		devtool: isProduction ? '#source-map' : '#cheap-source-map',
		resolve: {
			alias: {
				browserEnvironment$: join(__dirname, environment),
			},
		},
		module: {
			loaders: [
				{ test: /\.entry\.js$|options\.js$/, loaders: ['spawn?name=[name].js', `babel?${JSON.stringify(babelConfig)}`] },
				{ test: /\.js$/, exclude: join(__dirname, 'node_modules'), loader: 'babel', query: babelConfig },
				{ test: /\.js$/, include: join(__dirname, 'node_modules'), loader: 'babel', query: { plugins: ['transform-dead-code-elimination', 'transform-node-env-inline'], compact: true, babelrc: false } },
				{ test: /\.mustache$/, loader: 'mustache?noShortcut' },
				{ test: /\.scss$/, loaders: ['file?name=[name].css', 'extricate?resolve=\\.js$', 'css', 'postcss', 'sass'] },
				{ test: /\.html$/, loaders: ['file?name=[name].[ext]', 'extricate', 'html?attrs=link:href'] },
				{ test: /\.(png|gif)$/, exclude: join(__dirname, 'src', 'images'), loader: 'file?name=[name].[ext]' },
				{ test: /\.(png|gif)$/, include: join(__dirname, 'src', 'images'), loader: 'url' },
			],
			noParse: [
				// to use `require` in Firefox and Node
				/_nativeRequire\.js$/,
			],
		},
		plugins: [
			new ProgressBarPlugin(),
			new webpack.DefinePlugin({
				'process.env': {
					BUILD_TARGET: JSON.stringify(target),
				},
			}),
			new InertEntryPlugin(),
			(shouldZip && new ZipPlugin({
				path: join('..', 'zip'),
				filename: output,
			})),
		].filter(x => x),
	};
});

export default (configs.length === 1 ? configs[0] : configs);
