module.exports = {
  entry: './src/main.ts',
  output: { filename: './public/bundle.js' },
  resolve: {
    extensions: ['.ts', '.js', '.d.ts'],
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /\.glsl$/,
        loader: 'raw-loader',
      },
      {
        test: /\.glsl$/,
        loader: 'glslify-loader',
      },
    ],
  },
};
