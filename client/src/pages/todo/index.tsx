import { useEffect, useMemo, useRef, useState } from "react";
import { Button, View, Image } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";

import NavBar, { NavBarRef } from "@/components/NavBar";
import addIcon from '@/assets/common/add.png';
import Tabs from "@/components/Tabs";
import TodoContent from "./components/todoContent";

import styles from './index.module.scss'

import useTodoStore from "./store";
// import NavBar from "@/components/nav-bar";
const options = [
  {
    label: '全部',
    key: 'all'
  },
  {
    label: '已完成',
    key: 1
  },
  {
    label: '未完成',
    key: 0
  }
]
const Todo = () => {
  const navRef = useRef<NavBarRef>(null)
  const { setValue, fetchTodos, showTop, tabKey } = useTodoStore()
  useDidShow(async () => {
    setValue('pageNum', 0)
    fetchTodos({ pageNum: 0, })
  })
  useEffect(() => {
    fetchTodos({ pageNum: 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabKey])
  return (
    <View className='container'>
      <NavBar title='待办事项' ref={navRef} showBack={false} />
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
        <Tabs
          options={options}
          current={tabKey}
          onChange={(v) => {
            setValue('tabKey', v)
          }}
        />
        <TodoContent />
        <View className={styles.add} onClick={() => Taro.navigateTo({ url: '/packageA/demo/todo-add/index' })}>
          <Image src={addIcon} className={styles.img} />
        </View>
      </View>
    </View>

  );
};

export default Todo