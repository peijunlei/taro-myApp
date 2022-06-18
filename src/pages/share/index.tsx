import { Button, View } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage } from "@tarojs/taro";

type Props = {

};

const Share = (props: Props) => {
  useShareAppMessage(res => {
    return {
      title: '自定义转发标题',
      path: '/pages/poster/index'
    }
  })

  useDidShow(() => {
    const params = Taro.getCurrentInstance().router?.params
    console.log(params);
  })
  return (
    <View>
      <Button openType="share">
        分享
      </Button>
    </View>
  );
};

export default Share