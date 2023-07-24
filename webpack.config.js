/* ------------------------------ Node Modules ------------------------------ */
const path = require('node:path');
/* ------------------------------ Dependencies ------------------------------ */
const nodeExternals = require('webpack-node-externals');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const TerserPlugin = require('terser-webpack-plugin');
/* -------------------------------------------------------------------------- */

const { NODE_ENV = 'production' } = process.env;

module.exports = {
  entry: './src/index.ts',
  mode: NODE_ENV,
  target: 'node',
  watch: NODE_ENV === 'development',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(process.cwd()),
    filename: 'parser.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [{ test: /\.ts$/, use: ['ts-loader'] }],
  },
  plugins: [
    // @ts-ignore
    new WebpackShellPluginNext({
      onAfterDone: { scripts: ["echo 'Build complete!'"] },
    }),
  ],
  optimization: { minimize: true, minimizer: [new TerserPlugin()] },
};
