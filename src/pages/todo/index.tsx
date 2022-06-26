import { useEffect, useMemo } from "react";
import { Button, View } from "@tarojs/components";
import Taro, { useDidShow, usePullDownRefresh, useShareAppMessage } from "@tarojs/taro";
import { useAppSelector, useAppDispatch } from '@/store/hooks'

import { addTodo, fetchTodoList } from './todoSlice'
import TodoInput from "./components/todoInput";
import TodoHeader from "./components/todoHeader";
import TodoContent from "./components/todoContent";

import styles from './index.module.less'
import NavBar from "@/components/nav-bar";
// import NavBar from "@/components/nav-bar";
type Props = {

};

const Todo = (props: Props) => {
  const todo = useAppSelector((state) => state.todoReducer)
  const dispatch = useAppDispatch()
  // usePullDownRefresh(async () => {
  //   Taro.showLoading({title:"loading"})
  //   await dispatch(fetchTodoList(1))
  //   Taro.hideLoading()
  //   Taro.stopPullDownRefresh()
  // })
  useEffect(() => {
    dispatch(fetchTodoList(1))

  }, [])
  return (
    <>
      <NavBar
        title="todo"
        showSearch
        searchText="裴俊磊"
        onHome={() => {
          console.log('回首页');
          Taro.switchTab({url:"/pages/index/index"})
        }}
      />
      <View className={styles.todo}>
        <TodoInput />
        <TodoContent />
      </View>
    </>

  );
};

export default Todo