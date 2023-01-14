import { Button, View } from "@tarojs/components";
import Taro, { useDidShow, useZustandAppMessage } from "@tarojs/taro";

type Props = {

};


const Zustand = (props: Props) => {
console.log(props);
  return (
    <View>
      <Button onClick={()=>{}}>  调用 </Button>
    </View>
  );
};

export default Zustand