// babel.config.js
module.exports = (api) => {
  if (!api.env('test')) {
    return {};
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current',
          },
        },
      ],
    ],
  };
};
