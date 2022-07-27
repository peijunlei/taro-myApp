import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Input, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC, useRef } from "react";
import { fetchTodoList, TodoItem } from "../../todoSlice";

import styles from './index.module.less'
interface TodoInputProps {

}

const TodoInput: FC<TodoInputProps> = () => {
  const iptRef = useRef<HTMLInputElement>()
  // const todo = useAppSelector((state) => state.todoReducer)
  const dispatch = useAppDispatch()
  const handleClick = async (e) => {
    const value = iptRef.current?.value
    if (value?.trim().length) {
      await addTodo({
        title: value,
        createTime: new Date().toString(),
        updateTime: new Date().toString(),
        complete: false,
      })
      iptRef.current!.value = ''
      dispatch(fetchTodoList(0))
    }
  }

  const addTodo = async (data: Omit<TodoItem, "_id">) => {
    const db = Taro.cloud.database()
    await db.collection('todos').add({ data })
  }
  return (
    <View className={styles.todo_input}>
      <Input className={styles.ipt} ref={iptRef} />
      <View className={styles.btn} onClick={handleClick} >
        添加
      </View>
    </View >
  );
}

export default TodoInput;