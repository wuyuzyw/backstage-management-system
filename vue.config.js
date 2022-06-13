const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'http://sph-h5-api.atguigu.cn'
  },
  configureWebpack: {
    resolve: {
      // 配置src的别名
      alias: {
        '@': path.join(__dirname, './src')
      }
    }
  },
  pluginOptions: {
    // 配置全局Less
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.join(__dirname, './src/assets/less/global.less')
      ]
    }
  }
})
