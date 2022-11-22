import { Button, View, Textarea } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useMemo, useState } from "react";
import { addTodo } from "../todo/api";
import { TodoItem } from "../todo/todoSlice";
import styles from './index.module.scss';

type Props = {

};

const TodoDetail = (props: Props) => {
  const [value, setVal] = useState('')
  async function handleSave() {
    if (!value.trim()) return Taro.showToast({ title: "请输入描述", icon: 'none' })
    await addTodo({
      description: value,
      createTime: new Date().toLocaleString()
    }).then(() => {
      setVal('')
      Taro.showToast({ title: "保存成功!", icon: 'none' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1500);
    }).catch(console.error)
  }
  function handleChange(e) {
    setVal(e.detail.value)
  }
  useEffect(() => {
  }, [])
  return (
    <View className='container'>
      <View className={styles.addTodo}>
        <View>简要描述:</View>
        <Textarea className={styles.input} value={value} onInput={handleChange} autoHeight />
        <Button onClick={handleSave}>保存</Button>
      </View>

    </View>
  );
};

export default TodoDetail