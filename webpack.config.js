const path = require('path')
const babelConfig = require('./babel.config')

const build = {
  mode: 'production', // "production" | "development" | "none"
  entry: path.resolve(__dirname, 'src/index.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [require.resolve('typescript')],
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
      },
    ],
  },
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2', // universal module definition
  },
  optimization: {
    minimize: false,
  },
  externals: [
    'path',
    'fs',
    'util',
    'typescript',
    '@microsoft/typescript-etw',
    'fsevents',
  ],
}

const minified = {
  ...build,
  optimization: undefined,
  output: {
    ...build.output,
    filename: 'index.min.js',
  },
}

module.exports = [build, minified]
