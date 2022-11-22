import { Button, View, Image } from "@tarojs/components";
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
    const db = Taro.cloud.database()
    // db.collection('todos').add({
    //   data: {
    //     description: 'eat an apple2',
    //     location: db.Geo.Point(113.123, 33.1213)
    //   }
    // }).then((res1) => {
    //   console.log(res1);

    //   Taro.cloud.callFunction({
    //     name: "getTodos"
    //   }).then(res => {
    //     console.log(res);

    //   })
    // })
    // Taro.cloud.getTempFileURL({
    //   fileList: ['cloud://dev-1gx4rw5dc32c2f95.6465-dev-1gx4rw5dc32c2f95-1312260026/1 (1).png'],
    //   success: (res) => {
    //     console.log(res.fileList)
    //   }
    // })

    Taro.cloud.callFunction({
      name: "delTodo"
    }).then(res => {
      console.log(res);

    })


  }
  return (
    <View>
      <Button onClick={handleClick}>  调用 </Button>
      <Image src='cloud://dev-1gx4rw5dc32c2f95.6465-dev-1gx4rw5dc32c2f95-1312260026/1 (1).png' />
    </View>
  );
};

export default Zustand