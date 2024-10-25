const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  chainWebpack: config => {
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        return {
          ...options,
          name: 'assets/[name].[hash:8].[ext]',
        };
      });
  },
  transpileDependencies: true
})
