export default defineAppConfig({
  pages: [
    'pages/weather/index',
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
    color: "#2c2c2c",
    selectedColor: "#1296db",
    list: [
      // {
      //   iconPath: "./assets/tabbar/home.png",
      //   selectedIconPath: "./assets/tabbar/home_active.png",
      //   pagePath: "pages/index/index",
      //   text: "首页"
      // },
      {
        iconPath: "./assets/tabbar/weather.png",
        selectedIconPath: "./assets/tabbar/weather_active.png",
        pagePath: "pages/weather/index",
        text: "天气"
      },
      {
        iconPath: "./assets/tabbar/todo.png",
        selectedIconPath: "./assets/tabbar/todo_active.png",
        pagePath: "pages/todo/index",
        text: "待办"
      },
      {
        iconPath: "./assets/tabbar/user.png",
        selectedIconPath: "./assets/tabbar/user_active.png",
        pagePath: "pages/user-center/index",
        text: "我的"
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
