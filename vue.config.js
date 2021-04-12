const webpack = require('webpack')
module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  },
  configureWebpack: {
    // 解决LocalWIFI的配置信息
    resolve: {
      mainFields: ['main', 'browser']
    },
    module: {
      rules: [
        // janus.js does not use 'export' to provide its functionality to others, instead
        // it creates a global variable called 'Janus' and expects consumers to use it.
        // Let's use 'exports-loader' to simulate it uses 'export'.
        {
          test: require.resolve('janus-gateway'),
          loader: 'exports-loader',
          options: {
            exports: 'Janus'
          }
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({ adapter: ['webrtc-adapter', 'default'] })
    ]
  }
}
