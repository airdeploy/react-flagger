import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import builtins from 'rollup-plugin-node-builtins'

import pkg from './package.json'

export default {
  input: 'temp/index.js',
  output: {
    file: 'dist/react.js',
    name: 'FlaggerReact',
    format: 'umd',
    globals: {
      react: 'React',
      flagger: 'flagger',
    },
  },
  external: ['react', 'flagger'],
  plugins: [
    resolve({
      browser: true,
    }),
    commonjs({
      exclude: 'src/**',
    }),
    replace({
      __VERSION__: pkg.version,
    }),
    builtins(),
  ],
}
