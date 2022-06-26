import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Input, View } from "@tarojs/components";
import { FC, useRef } from "react";
import { addTodo } from '../../todoSlice'

import styles from './index.module.less'
interface TodoInputProps {

}

const TodoInput: FC<TodoInputProps> = () => {
  const iptRef = useRef<HTMLInputElement>()
  // const todo = useAppSelector((state) => state.todoReducer)
  const dispatch = useAppDispatch()
  const handleClick = (e) => {
    const value = iptRef.current?.value
    if (value?.trim().length) {
      dispatch(addTodo({
        id: Math.random().toString().slice(2),
        desc: value?.trim(),
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        complete:false
      }))
      iptRef.current!.value = ''
    }
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