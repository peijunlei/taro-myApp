import { getCurrentPages } from '@tarojs/taro';
import React, { Component } from 'react'

import { Provider } from 'react-redux'

// 全局样式
import './app.less'
import { store } from './store'


class App extends Component {
  // 可以使用所有的 React 生命周期方法
  componentDidMount() { }

  // 对应 onLaunch
  onLaunch() {
    wx.onAppRoute(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      console.log(currentPage);
      currentPage.onShareAppMessage = () => {
        return {
          title: "全局分享拦截",
          imageUrl: 'https://img14.360buyimg.com/n0/jfs/t1/219497/18/1719/231993/61762935E0be23330/53ff0150593d5852.jpg',
          path: currentPage.$taroPath + "&id=123456"
        }
      }
    });
  }

  // 对应 onShow
  componentDidShow() { }

  // 对应 onHide
  componentDidHide() { }

  render() {
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    return (
      <Provider store={store}>
        {/* this.props.children 是将要被渲染的页面 */}
        {this.props.children}
      </Provider>
    )
  }
}

export default App