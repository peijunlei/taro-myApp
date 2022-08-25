import { Button, View } from "@tarojs/components";
import Taro, { useDidShow, useZustandAppMessage } from "@tarojs/taro";
import { useEffect, useRef, useState } from "react";
import create from "zustand";
import { devtools, persist } from 'zustand/middleware'
type Props = {

};

interface BearState {
  bears: number
  increase: (by: number) => void
}

const useBearStore = create<BearState>()(
  devtools(
    persist((set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by })),
    }))
  )
)
const Zustand = (props: Props) => {

  const bears = useBearStore((state) => state.bears)
  const increase = useBearStore((state) => state.increase)

  function handleClick() {
    increase(1)

  }
  useEffect(() => {
    console.log(bears);
    return () => {
      console.log('unmount');
    }
  }, [])
  return (
    <View>
      <Button onClick={handleClick}>  {`点击${bears}`} </Button>
    </View>
  );
};

export default Zustand