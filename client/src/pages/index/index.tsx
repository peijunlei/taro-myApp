import NavBar from "@/components/nav-bar";
import { Button, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";
import { useEffect } from "react";

type Props = {

};

const list = [
  {
    title: '海报分享',
    path: '/pages/poster/index'
  },
  {
    title: 'LBS定位获取',
    path: '/pages/gaode/index'
  },
  {
    title: '点击回到顶部示例',
    path: '/pages/share/index'
  },
  {
    title: 'Todo List',
    path: '/pages/todo/index'
  },
  {
    title: '虚拟化长列表',
    path: '/pages/virtual-list/index'
  },
  {
    title: '订阅消息示例',
    path: '/pages/subscribe-message/index'
  },
  {
    title: 'zustand',
    path: '/pages/zustand/index'
  },
]
const Home = (props: Props) => {



  useEffect(() => {
    // setTimeout(()=>{
    // Taro.navigateTo({ url: '/pages/sharePage/sharePage' })

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