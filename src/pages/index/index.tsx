import { Button, View } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";

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
  }
]
const Home = (props: Props) => {

  useShareAppMessage(res => {
    console.log(res);

    return {
      title: '自定义转发标题',
    }
  })
  return (
    <View>
      {
        list.map(v => <Button key={v.path} onClick={() => Taro.navigateTo({ url: v.path })}>{v.title}</Button>)
      }
      <Button openType="share" onClick={(e)=>{
        console.log(1111);
        
      }}>
          分享
      </Button>
    </View>
  );
};

export default Home