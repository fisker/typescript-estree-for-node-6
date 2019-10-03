import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'
import builtins from 'builtin-modules'

export default {
  input: require.resolve('@typescript-eslint/typescript-estree'),
  output: {
    format: 'commonjs',
    file: 'index.js',
    exports: 'named'
  },
  plugins: [
    babel(),
    commonjs(),
    resolve(),
    json(),
  ],
  externals: builtins,
}