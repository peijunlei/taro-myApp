import { Button, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { useEffect } from "react";

type Props = {

};

const list = [
  {
    title: '海报分享',
    path: '/packageA/demo/poster/index'
  },
  {
    title: 'LBS定位获取',
    path: '/packageA/demo/gaode/index'
  },
  {
    title: '点击回到顶部示例',
    path: '/packageA/demo/share/index'
  },
  {
    title: '虚拟化长列表',
    path: '/packageA/demo/virtual-list/index'
  },
  {
    title: '订阅消息示例',
    path: '/packageA/demo/subscribe-message/index'
  },
  {
    title: 'zustand',
    path: '/packageA/demo/zustand/index'
  },
]
const Home = (props: Props) => {



  useEffect(() => {
    // setTimeout(()=>{
    // Taro.navigateTo({ url: '/packageA/demo/sharePage/sharePage' })

    // },2000)
  }, [])
  return (
    <View>
      {
        list.map(v => <Button key={v.path} onClick={() => Taro.navigateTo({ url: v.path })}>{v.title}</Button>)
      }
    </View>
  );
};

export default Home