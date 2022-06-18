export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/gaode/index',
    'pages/poster/index',
    'pages/share/index',

  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  permission: {
    "scope.userLocation": {
      "desc": "您的位置信息将用于展示您所在城市的信息"
    }
  }
})
