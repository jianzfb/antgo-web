const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: true,
  publicPath: '/{DEMONAME}/',
  devServer:{
      proxy:{
        '/antgo':{
          'target': 'http://127.0.0.1:8901',
          'changeOrigin': true,
          headers:{
            referer: 'http://121.40.35.60',
            origin: 'http://121.40.35.60'
          },
          pathRewrite:{
            '^/antgo': '/antgo'
          }
      }
    }
  }

  // proxyTable: {
  //   '/antvis':{
  //     'target': 'http://www.mltalker.com',
  //     'changeOrigin': true,
  //     headers:{
  //       referer: 'http://121.40.35.60',
  //       origin: 'http://121.40.35.60'
  //     }
  //   },
  //   '/antgo':{
  //     'target': 'http://127.0.0.1:9000',
  //     'changeOrigin': true,
  //     headers:{
  //       referer: 'http://121.40.35.60',
  //       origin: 'http://121.40.35.60'
  //     }
  //   }    
  // },

}
