const path = require('path')
const babelConfig = require('./babel.config')

const ROOT = path.resolve(__dirname)

const build = {
  mode: "production", // "production" | "development" | "none"
  entry: require.resolve('@typescript-eslint/typescript-estree'),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [
          require.resolve('typescript')
        ], 
        use: {
          loader: "babel-loader",
          options: babelConfig
        }
      }
    ],
  },
  target: 'node',
  output: {
    filename: "index.js",
    path: ROOT,
    libraryTarget: "commonjs2", // universal module definition
  },
  optimization: {
    minimize: false
  },
  externals: [
    'path',
    'fs',
    'util',
    'typescript',
    '@microsoft/typescript-etw',
    'fsevents'
  ], 
}

const minified = {
  ...build,
  optimization: undefined,
  output: {
    ...build.output,
    filename: 'index.min.js'
  }
}

module.exports = [build, minified]