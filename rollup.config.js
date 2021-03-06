import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { string } from 'rollup-plugin-string';

const dist = 'npm';
const bundleName = 'customLibrary';

const common = (isProd) => ({
  input: 'src/index.js',
  external: ['react', 'prop-types'],
  plugins: [
    copy({
      targets: [
        { src: 'LICENSE', dest: `${dist}` },
        { src: 'README.md', dest: `${dist}` },
      ],
    }),
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    isProd && terser(),
    string({
      include: '**/*.css',
    }),
  ],
});

const outputs = [{
  file: `${dist}/cjs/${bundleName}.js`,
  format: 'cjs',
}, {
  file: `${dist}/cjs/${bundleName}.min.js`,
  format: 'cjs',
}, {
  file: `${dist}/umd/${bundleName}.js`,
  format: 'umd',
  name: `${bundleName}`,
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
}, {
  file: `${dist}/umd/${bundleName}.min.js`,
  format: 'umd',
  name: `${bundleName}`,
  globals: {
    react: 'React',
    'prop-types': 'PropTypes',
  },
}];

export default outputs.map((output) => ({
  ...common(new RegExp(/.+\.min\.js$/g).test(output.file)),
  output,
}));
