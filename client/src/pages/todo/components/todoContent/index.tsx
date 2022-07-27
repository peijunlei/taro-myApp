import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ScrollView, View, Image, Checkbox, Text } from "@tarojs/components";
import { FC, useEffect, useState } from "react";
import { TodoItem, toggleTodo, removeTodo, fetchTodoList, changePageNum } from "../../todoSlice";
import styles from './index.module.less'

import deleteIcon from '../../img/delete.png'
import Taro from "@tarojs/taro";

interface TodoContentProps {
  nextPage?: () => void;
  noMore?: boolean;
  loadingMore?: boolean;
}

const TodoContent: FC<TodoContentProps> = () => {

  const todo = useAppSelector((state) => state.todoReducer)
  const dispatch = useAppDispatch()

  const [trigger, setTrigger] = useState(false)
  const handleCheckboxChange = (id) => {
    dispatch(toggleTodo(id))
  }
  const handleRefresh = async () => {
    setTrigger(true)
    await dispatch(fetchTodoList(0))
    setTrigger(false)
  }

  const handleJump = (item) => {
    Taro.preload(item)
    Taro.navigateTo({ url: `/pages/todo-detail/index` })
  }
  const handleremove = async (id) => {
    dispatch(removeTodo(id))
    Taro.showToast({ title: "删除成功" })
  }
  
  const Item = ({ item }: { item: TodoItem }) => {
    return (
      <View className={styles.todo_item}>
        <Checkbox
          value={item._id}
          checked={item.complete}
          onClick={() => handleCheckboxChange(item._id)}
        />
        <View
          className={`${styles.desc} ${item.complete ? styles.complete : ""}`}
          onClick={() => handleJump(item)}
        > {item.title}
        </View>
        <Image src={deleteIcon} className={styles.icon} onClick={() => handleremove(item._id)} />
      </View>
    )
  }



  return (
    <ScrollView
      className={styles.todo_content}
      scrollY
      refresherEnabled
      scrollWithAnimation
      refresherTriggered={trigger}
      showScrollbar={false}
      onRefresherRefresh={handleRefresh}
      onScrollToLower={() => {
        if (todo.list.length >= todo.total) return;
        dispatch(fetchTodoList(todo.pageNum + 1))
      }}
    >
      <View>
        {todo.list.map((todo) => <Item item={todo} key={todo._id} />)}
      </View>
      {todo.list.length === 0 && !todo.loading && <Text className={styles.empty}>没有数据哦~</Text>}
      {!todo.loading && todo.list.length === todo.total && <View className={styles.status}>没有更多了</View>}
      {todo.list.length < todo.total && todo.list.length !== 0 && <View className={styles.status}>加载中...</View>}
    </ScrollView>
  );

}

export default TodoContent;