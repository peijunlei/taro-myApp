import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ScrollView, View, Image, Checkbox, Text } from "@tarojs/components";
import { FC, useEffect, useState } from "react";
import { TodoItem, toggleTodo, removeTodo, fetchTodoList } from "../../todoSlice";
import styles from './index.module.less'

import deleteIcon from '../../img/delete.png'
import Taro from "@tarojs/taro";

interface TodoContentProps {
  nextPage: () => void;
  noMore: boolean;
  loadingMore: boolean;
}

const TodoContent: FC<TodoContentProps> = ({ nextPage, noMore, loadingMore }) => {

  const todo = useAppSelector((state) => state.todoReducer)
  const dispatch = useAppDispatch()

  const [trigger, setTrigger] = useState(false)
  const handleCheckboxChange = (id) => {
    dispatch(toggleTodo(id))
  }
  const handleRefresh = async () => {
    setTrigger(true)
    await dispatch(fetchTodoList(1))
    setTrigger(false)
  }

  const handleJump = (item) => {
    Taro.preload(item)
    Taro.navigateTo({ url: `/pages/todo-detail/index` })
  }
  const handleremove = async (id) => {
    await dispatch(removeTodo(id))
    Taro.showToast({ title: "删除成功" })
  }

  const Item = ({ item }: { item: TodoItem }) => {
    return (
      <View className={styles.todo_item}>
        <Checkbox
          value={item.id}
          checked={item.complete}
          onClick={() => handleCheckboxChange(item.id)}
        />
        <View
          className={`${styles.desc} ${item.complete ? styles.complete : ""}`}
          onClick={() => handleJump(item)}
        > {item.desc}
        </View>
        <Image src={deleteIcon} className={styles.icon} onClick={() => handleremove(item.id)} />
      </View>
    )
  }
  useEffect(() => {
    console.log(todo.loading, 'todo.loading');
  }, [todo.loading])
  return (
    <ScrollView
      className={styles.todo_content}
      scrollY
      refresherEnabled
      enhanced
      refresherTriggered={trigger}
      showScrollbar={false}
      onRefresherRefresh={handleRefresh}
      onScrollToLower={() => {
        console.log(11);
        nextPage && nextPage()
      }}
    >
      <View>
        {todo.list.map((todo) => <Item item={todo} key={todo.id} />)}
      </View>
      {todo.list.length === 0 && !todo.loading && <Text className={styles.empty}>没有数据哦~</Text>}
      {noMore && <View>没有更多了</View>}
      {loadingMore && todo.list.length !== 0 && <View>加载中...</View>}
    </ScrollView>
  );

}

export default TodoContent;