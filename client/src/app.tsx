import Taro, { getCurrentPages } from '@tarojs/taro';

import React, { Component } from 'react'

import { Provider } from 'react-redux'

import { store } from './store'
import './styles/font/qweather-icons.css';
import './app.scss';


class App extends Component {
  // 可以使用所有的 React 生命周期方法
  constructor(props) {
    super(props);
    Taro.cloud.init({
      env: "dev-3ghsvhjf1466a56a",
      traceUser: true,
    })
  }
  componentDidMount() {
  }

  onLaunch() {
    wx.onAppRoute(() => {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      // console.log(currentPage.$taroPath);
      currentPage.onShareAppMessage = () => {
        return {
          title: "快分享给你的好友吧~~~",
          imageUrl: 'https://img14.360buyimg.com/n0/jfs/t1/219497/18/1719/231993/61762935E0be23330/53ff0150593d5852.jpg',
          path: currentPage.$taroPath
        }
      }
    });
  }
  render() {
    return (
      this.props.children
      // <Provider store={store}>
      //   {this.props.children}
      // </Provider>
    )
  }
}

export default App