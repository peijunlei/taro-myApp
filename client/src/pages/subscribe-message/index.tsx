import { Button, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC } from "react";

interface SubscribeMessageProps {

}

const SubscribeMessage: FC<SubscribeMessageProps> = () => {

  const submit = async () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("")
      }, 1000);
    })
  }

  const handleClick = async () => {

    await Taro.requestSubscribeMessage({
      tmplIds: ['yhPHDaZGKmtxe3AUWstu5XaLOKmv1rLEqRDLFA9jLMo','dD4twFerWD1lDHyJCOoYuwONPwm3p7wqx0nohYqqAjU'],
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
  return (
    <View>
      <Button onClick={handleClick}>点击订阅</Button>
    </View>
  );
}

export default SubscribeMessage;