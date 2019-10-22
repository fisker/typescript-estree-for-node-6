import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'

export default {
  input: require.resolve('@typescript-eslint/typescript-estree'),
  output: {
    format: 'commonjs',
    file: 'dist/index.js',
    exports: 'named',
  },
  plugins: [
    commonjs(),
    resolve({
      preferBuiltins: true,
    }),
    json(),
    babel({
      exclude: [/\/core-js\//],
    }),
  ],
  external: ['typescript', '@microsoft/typescript-etw', 'glob'],
}
