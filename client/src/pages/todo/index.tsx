import { useEffect, useMemo, useRef, useState } from "react";
import { Button, View } from "@tarojs/components";
import Taro, { pxTransform, useDidShow, usePullDownRefresh, useShareAppMessage } from "@tarojs/taro";
import { useAppSelector, useAppDispatch } from '@/store/hooks'

import { addTodo, fetchTodoList, changePageNum, clean } from './todoSlice'
import TodoInput from "./components/todoInput";
import TodoHeader from "./components/todoHeader";
import TodoContent from "./components/todoContent";

import styles from './index.module.less'
import NavBar, { NavBarRef } from "@/components/nav-bar";
import { isH5 } from "@/utils";
// import NavBar from "@/components/nav-bar";
type Props = {

};

const Todo = (props: Props) => {
  const navRef = useRef<NavBarRef>(null)
  const todo = useAppSelector((state) => state.todoReducer)
  const dispatch = useAppDispatch()
  // usePullDownRefresh(async () => {
  //   Taro.showLoading({title:"loading"})
  //   await dispatch(fetchTodoList(0))
  //   Taro.hideLoading()
  //   Taro.stopPullDownRefresh()
  // })

  const nextPage = () => {

  }

  useEffect(() => {
    console.log(todo);
    
    dispatch(fetchTodoList(0))
    return () => {
      dispatch(clean())
    }
  }, [])

  return (
    <View>
      {!isH5 && <NavBar title="todo" showSearch searchText="裴俊磊" ref={navRef} />}
      <View className={styles.todo} style={{
        height: `calc(100vh - ${navRef.current?.height || 0}px)`
      }}>
        <TodoInput />
        <TodoContent />
      </View>
    </View>

  );
};

export default Todo