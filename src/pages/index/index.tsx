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
    title: '高德地图',
    path: '/pages/gaode/index'
  },
  {
    title: '分享页2022',
    path: '/pages/share/index?over=false'
  }
]
const Home = (props: Props) => {
  useDidShow(() => {
    const params = Taro.getCurrentInstance().router?.params
    console.log(params);

  })
  return (
    <View>
      {
        list.map(v => <Button key={v.path} onClick={() => Taro.navigateTo({ url: v.path })}>{v.title}</Button>)
      }
    </View>
  );
};

export default Home