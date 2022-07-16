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
    '@/*': path.resolve(__dirname, '..', 'src/*'),
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/store': path.resolve(__dirname, '..', 'src/store'),
    '@/hooks': path.resolve(__dirname, '..', 'src/hooks'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
  },
  defineConstants: {
    TARO_ENV: JSON.stringify(process.env.TARO_ENV)
  },
  terser: {
    enable: true,
    config: {
      warnings: false,
      compress: {
        drop_debugger: true,
        drop_console: true,
        pure_funcs: ['console.log'],
      },
    },
  },
  csso: {
    enable: true,
    config: {
      restructure: false,
    },
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
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
