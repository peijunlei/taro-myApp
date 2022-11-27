const path = require('path');
const config = {
  projectName: 'myApp',
  date: '2022-5-5',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/assets': path.resolve(__dirname, '..', 'src/assets'),
    '@/store': path.resolve(__dirname, '..', 'src/store'),
    '@/hooks': path.resolve(__dirname, '..', 'src/hooks'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/cache': path.resolve(__dirname, '..', 'src/cache'),

  },
  defineConstants: {
    TARO_ENV: JSON.stringify(process.env.TARO_ENV)
  },

  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  sass: {
    resource: [
      path.resolve(__dirname, '..', 'src/styles/theme.scss'),
      path.resolve(__dirname, '..', 'src/styles/mixin.scss')

    ]
  },
  mini: {
    hot: true,

    webpackChain(chain, webpack) {
      // chain.plugin('analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
