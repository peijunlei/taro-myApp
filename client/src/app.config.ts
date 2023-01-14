export default defineAppConfig({
  pages: [
    'pages/index/index',
    "pages/todo/index",
    'pages/user-center/index',
  ],
  subpackages: [
    {
      root: "packageA",
      pages: [
        'demo/gaode/index',
        'demo/poster/index',
        'demo/share/index',
        'demo/sharePage/index',
        'demo/subscribe-message/index',
        'demo/todo-add/index',
        'demo/todo-detail/index',
        'demo/virtual-list/index',
        'demo/zustand/index',
      ]
    }
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
    list: [
      {
        iconPath: "./assets/tabbar/home.png",
        selectedIconPath: "./assets/tabbar/home_active.png",
        pagePath: "pages/index/index",
        text: "首页"
      },
      {
        iconPath: "./assets/tabbar/home.png",
        selectedIconPath: "./assets/tabbar/home_active.png",
        pagePath: "pages/todo/index",
        text: "待办"
      },
      {
        iconPath: "./assets/tabbar/user.png",
        selectedIconPath: "./assets/tabbar/user_active.png",
        pagePath: "pages/user-center/index",
        text: "天气"
      }
    ]
  },
  requiredPrivateInfos: [
    'getLocation',
    'chooseLocation'
  ],
  permission: {
    "scope.userLocation": {
      "desc": "您的位置信息将用于展示您所在城市的信息"
    }
  }
})
