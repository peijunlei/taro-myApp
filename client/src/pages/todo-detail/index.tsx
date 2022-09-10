import { Button, View, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useMemo } from "react";
import { TodoItem } from "../todo/todoSlice";
import styles from './index.module.less'

type Props = {

};

const TodoDetail = (props: Props) => {

  const data = useMemo(() => Taro.getCurrentInstance().preloadData, []) as TodoItem
  useEffect(() => {
    Taro.setNavigationBarTitle({ title: data.title || 'todo详情' })
  }, [])
  return (
    <View className={styles.todo_detail}>
      <View>
        <Text>描述:</Text>
        <Text>{data.title}</Text>
      </View>
      <View>
        <Text>是否完成:</Text>
        <Text>{data.complete ? "已完成" : "未完成"}</Text>
      </View>
      <View>
        <Text>创建时间:</Text>
        <Text>{new Date(data.createTime).toLocaleString()}</Text>
      </View>
      <View>
        <Text>更新时间:</Text>
        <Text>{data.updateTime ? new Date(data.updateTime).toLocaleString() : "-"}</Text>
      </View>
    </View>
  );
};

export default TodoDetail