import { msg } from "@/utils/msg";
import { View } from "@tarojs/components";
import Taro, { getCurrentPages } from "@tarojs/taro";
import React from "react";


interface SharePageProps {

}

interface SharePageState {

}

class SharePage extends React.Component<SharePageProps, SharePageState> {
  state = { login: false }

  componentWillMount() {
    Taro.showLoading()
    // msg.on('handleLogin', (data) => {
    //   console.log(data);
    //   this.setState({ login: data });
    // })
  }
  componentDidMount() {
    console.log(getCurrentPages());
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (!prevPage) return
    console.log(prevPage.route);

    if (prevPage.route.includes('pages/index/index')) {
      this.init()
    }
  }
  componentDidUpdate(prevProps: SharePageProps, prevState: SharePageState) {
    if (this.state.login) {
      this.init()
    }
  }
  componentWillUnmount() {
    msg.off('handleLogin')
  }
  init = () => {
    Taro.hideLoading()
    Taro.navigateTo({ url: '/pages/todo/index' })
  }
  render() {
    return (
      <View></View>
    );
  }
}

export default SharePage;