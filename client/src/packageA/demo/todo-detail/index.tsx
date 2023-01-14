import { Button, View, Text } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useMemo } from "react";
import momnet from 'dayjs';
import TimeFormat from "@/constants/time-format";

import { TodoItem } from "../todo/types";
import styles from './index.module.scss'

type Props = {

};

const TodoDetail = (props: Props) => {

  const data = useMemo(() => Taro.getCurrentInstance().preloadData, []) as TodoItem
  return (
    <View className={styles.todo_detail}>
      <View>
        <Text>描述:</Text>
        <Text>{data.description}</Text>
      </View>
      <View>
        <Text>是否完成:</Text>
        <Text>未完成</Text>
      </View>
      <View>
        <Text>创建时间:</Text>
        <Text>{momnet(data.createTime).format(TimeFormat.DEFAULT_TIME)}</Text>
      </View>
      <View>
        <Text>更新时间:</Text>
        <Text>{momnet(data.createTime).format(TimeFormat.DEFAULT_TIME)}</Text>
      </View>
    </View>
  );
};

export default TodoDetail