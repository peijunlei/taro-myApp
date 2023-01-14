import { useEffect, useMemo, useRef, useState } from "react";
import { Button, View, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";

import TodoContent from "./components/todoContent";

import styles from './index.module.scss'
import NavBar, { NavBarRef } from "@/components/nav-bar";

import addIcon from '@/assets/common/add.png';
import useTodoStore from "./store";
// import NavBar from "@/components/nav-bar";
type Props = {

};

const Todo = (props: Props) => {
  const navRef = useRef<NavBarRef>(null)
  const { setValue, fetchTodos, showTop } = useTodoStore()
  useDidShow(async () => {
    setValue('pageNum', 0)
    fetchTodos({ pageNum: 0 })
  })

  return (
    <View className='container'>
      <NavBar title='待办事项' ref={navRef} />
      <View className={styles.todo} style={{ height: `calc(100vh - ${navRef.current?.height!}px)` }}>
        <View>
          {
            showTop &&
            <Button
              style={{ position: "fixed", zIndex: 999, bottom: 30, left: 30 }}
              onClick={() => {
                setValue('top', Math.random())
              }}
            >↑</Button>
          }
        </View>
        <TodoContent />
        <View className={styles.add} onClick={() => Taro.navigateTo({ url: '/packageA/demo/todo-add/index' })}>
          <Image src={addIcon} className={styles.img} />
        </View>
      </View>
    </View>

  );
};

export default Todo