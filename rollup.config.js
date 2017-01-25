import babel from 'rollup-plugin-babel';

export default {
  entry: 'index.js',
  plugins: [ babel() ],
  dest: 'wkt.build.js',
  format: 'cjs'
};
