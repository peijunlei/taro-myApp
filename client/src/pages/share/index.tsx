import { Button, ScrollView, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import React from "react";

type Props = {

};

interface ShareProps {

}

interface ShareState {

}


const LocationBtn = ({ pageInit }) => {
  const initLocationChange = () => {
    Taro.getLocation({
      type: 'gcj02',
      success(res) {
        Taro.setStorageSync('test', 1000);
        setTimeout(() => {
          pageInit();
        }, 1000);
      },
      fail(error) {
        Taro.removeStorageSync('test');
        Taro.showModal({
          title: '提示',
          content: '需要您授权位置信息',
          success: (res) => {
            if (res.confirm) {
              Taro.openSetting({
                success(res) {
                  if (res.authSetting['scope.userLocation']) {
                    Taro.showToast({ title: '授权成功', icon: 'none' });
                    Taro.getLocation({
                      type: 'gcj02',
                      success(res) {
                        Taro.setStorageSync("test", 1000);
                        setTimeout(() => {
                          pageInit();
                        }, 1000);
                      },
                    });
                  } else {
                    Taro.showToast({ title: '授权失败', icon: 'none' });
                    Taro.removeStorageSync('test');
                  }
                },
              });
            }
          },
        });
      },
    });
  }
  return (
    <View>
      <Button onClick={initLocationChange}>--获取定位--</Button>
    </View>
  )
}



class Share extends React.Component<ShareProps, ShareState> {
  state = {
    top: 0,
    showToTop: false
  }




  init = () => {
    const test = Taro.getStorageSync('test')
    console.log('init', test);
    this.setState({ test })
  }

  componentDidMount() {



  }

  componentDidShow() {
    // this.setState({ top: Math.random() })
    // console.log(this.state.scrollX);



  }
  render() {
    return (
      <View>
        {/* 这里必须包裹一下 */}
        <View>
          {
            this.state.showToTop &&
            <Button
              style={{ position: "fixed", zIndex: 999 }}
              onClick={() => {
                this.setState({ top: Math.random() })
              }}>↑</Button>
          }
        </View>
        <ScrollView
          style={{ height: '100vh' }}
          scrollY
          scrollWithAnimation
          scrollTop={this.state.top}
          onScroll={(e) => {
            this.setState({ showToTop: e.detail.scrollTop >= 500 })
          }}
          onScrollToLower={() => {
            console.log('到底了');

          }}
        >
          <View>
            {Array.from({ length: 20 }).fill(0).map((v, i) => <View style={{ height: 100, textAlign: 'center', }}>{i + ""}</View>)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default Share;

