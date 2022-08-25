import { Button, View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { FC, useEffect, useRef } from "react";

interface SubscribeMessageProps {

}

const SubscribeMessage: FC<SubscribeMessageProps> = () => {
  const timer = useRef<any>()

  const submit = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("")
      }, 1000);
    })
  }

  const handleClick = async () => {

    await Taro.requestSubscribeMessage({
      tmplIds: ['yhPHDaZGKmtxe3AUWstu5XaLOKmv1rLEqRDLFA9jLMo', 'dD4twFerWD1lDHyJCOoYuwONPwm3p7wqx0nohYqqAjU'],
      success(res) {
        console.log('订阅消息', res);
        let arr = [] as string[]
        for (const key in res) {
          const value = res[key];
          value === 'accept' && arr.push(key)
        }

        Taro.showModal({ content: JSON.stringify(arr) })

      },
      fail(result) {
        Taro.showModal({ content: JSON.stringify(result) })
      },
    })
  }

  useDidShow(() => {
    timer.current = setTimeout(() => {
      console.log('back');

      Taro.navigateBack()
    }, 2000)
  })
  useEffect(() => {
    return () => {
      console.log('卸载');
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <View>
      <Button onClick={handleClick}>点击订阅</Button>
      <Button onClick={()=>Taro.redirectTo({url:'/pages/poster/index'})}>海报</Button>
    </View>
  );
}

export default SubscribeMessage;