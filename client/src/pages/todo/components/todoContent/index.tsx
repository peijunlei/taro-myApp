import Taro from "@tarojs/taro";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ScrollView, View, Image, Checkbox, Text } from "@tarojs/components";
import { FC, useEffect, useState } from "react";
import styles from './index.module.scss'

import deleteIcon from '../../img/delete.png'
import useTodoStore from "../../store";
import { removeTodo } from "../../api";
import { TodoItem } from "../../types";

interface TodoContentProps {
  nextPage?: () => void;
  noMore?: boolean;
  loadingMore?: boolean;
}

function TodoContent() {

  let { list, loading, total, pageNum, setValue, fetchTodos } = useTodoStore()

  const [trigger, setTrigger] = useState(false)

  const handleRefresh = async () => {
    setTrigger(true)
    setValue('pageNum', 0)
    await fetchTodos({ pageNum: 0 })
    setTrigger(false)
  }
  if (loading && list.length === 0) return null;
  return (
    <ScrollView
      scrollTop={200}
      className={styles.todo_content}
      scrollY
      refresherEnabled
      scrollWithAnimation
      refresherTriggered={trigger}
      showScrollbar={false}
      onRefresherRefresh={handleRefresh}
      onScrollToLower={() => {
        if (list.length >= total) return;
        setValue('pageNum', pageNum++)
        fetchTodos({ pageNum })
      }}
    >
      <View>
        {list.map((todo) => <Item data={todo} key={todo._id} />)}
      </View>
      {list.length === 0 && <Text className={styles.empty}>没有数据哦~</Text>}
      {list.length !== 0 && list.length === total && <View className={styles.status}>没有更多了</View>}
      {list.length < total && list.length !== 0 && <View className={styles.status}>加载中...</View>}
    </ScrollView>
  );

}
function Item({ data }: { data: TodoItem }) {
  const { fetchTodos } = useTodoStore()
  const handleJump = (item) => {
    Taro.preload(item)
    Taro.navigateTo({ url: `/pages/todo-detail/index` })
  }
  const handleremove = async (id) => {
    await removeTodo(id)
    await fetchTodos({ pageNum: 0 })
    Taro.showToast({ title: "删除成功", icon: 'none' })
  }
  return (
    <View className={styles.todo_item}>
      <View
        className={styles.desc}
        onClick={() => handleJump(data)}
      >
        <View className={styles.title}>
          {data.description}
        </View>
        <View className={styles.time}>
          {data.createTime}
        </View>
      </View>
      <Image src={deleteIcon} className={styles.icon} onClick={() => handleremove(data._id)} />
    </View>
  )
}
export default TodoContent;