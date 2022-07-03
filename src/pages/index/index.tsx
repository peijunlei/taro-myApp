import NavBar from "@/components/nav-bar";
import { Button, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";

type Props = {

};

const list = [
  {
    title: '海报',
    path: '/pages/poster/index'
  },
  {
    title: 'LBS定位',
    path: '/pages/gaode/index'
  },
  {
    title: '分享页2022',
    path: '/pages/share/index'
  },
  {
    title: 'todo',
    path: '/pages/todo/index'
  },
]
const Home = (props: Props) => {
  useDidShow(() => { })
  return (
    <View>
      {/* <NavBar  title="首页" showBack={false} showHome={false} /> */}
      {
        list.map(v => <Button key={v.path} onClick={() => Taro.navigateTo({ url: v.path })}>{v.title}</Button>)
      }
    </View>
  );
};

export default Home