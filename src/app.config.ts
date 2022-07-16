export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/gaode/index',
    'pages/poster/index',
    'pages/share/index',
    'pages/todo/index',
    'pages/todo-detail/index',
    'pages/user-center/index',
    'pages/sharePage/sharePage',
    'pages/virtual-list/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
    // navigationStyle:"custom",
  },
  tabBar: {
    color: "#333",
    selectedColor: "#FB5629",
    list: [{
      iconPath:"./assets/tabbar/home.png",
      selectedIconPath:"./assets/tabbar/home_active.png",
      pagePath: "pages/index/index",
      text: "首页"
    }, {
      iconPath:"./assets/tabbar/user.png",
      selectedIconPath:"./assets/tabbar/user_active.png",
      pagePath: "pages/user-center/index",
      text: "我的"
    }]
  },
  permission: {
    "scope.userLocation": {
      "desc": "您的位置信息将用于展示您所在城市的信息"
    }
  }
})
