module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',          // @ теперь указывает на src
            '@/app': './app',      // алиас для app
            '@/hooks': './hooks',  // алиас для hooks в корне
            '@/assets': './assets',
          }
        }
      ]
    ]
  };
};