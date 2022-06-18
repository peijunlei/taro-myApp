import { Component } from 'react'
import { Provider } from 'react-redux'

import configStore from './store'

import './app.less'
import { getCurrentPages } from '@tarojs/taro'
import Taro from '@tarojs/taro'

const store = configStore()

class App extends Component {
  componentDidMount() {
    Taro.setStorageSync("userId", '17724683346')
  }
  componentDidShow() {
  }
  componentDidHide() { }

  componentDidCatchError() { }

  onLaunch(options) {
    wx.onAppRoute(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1];
      if (!currentPage) return
      currentPage.onShareAppMessage = (res) => {
        console.log('分享来源=>', res);
        const userId = Taro.getStorageSync("userId")
        return {
          title: '全局分享',
          path: `pages/index/index?userId=${userId}`
        }
      }
    });
  }
  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
