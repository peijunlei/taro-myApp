import Taro from "@tarojs/taro";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ScrollView, View, Image, Checkbox, Text } from "@tarojs/components";
import { FC, useEffect, useRef, useState } from "react";
import styles from './index.module.scss'

import deleteIcon from '../../img/delete.png'
import useTodoStore from "../../store";
import { TodoItem } from "../../types";
import moment from 'dayjs'
import TimeFormat from "@/constants/time-format";
import { changeTodoComplete, removeTodo } from "../../api";

interface TodoContentProps {
  nextPage?: () => void;
  noMore?: boolean;
  loadingMore?: boolean;
}

function TodoContent() {

  let { list, loading, total, pageNum, setValue, fetchTodos, top, tabKey } = useTodoStore()

  const [trigger, setTrigger] = useState(false)
  const ref = useRef<Element>(null)
  const tabKeyRef = useRef(tabKey)
  const handleRefresh = async () => {
    setTrigger(true)
    setValue('pageNum', 0)
    await fetchTodos({ pageNum: 0, complete: tabKey === 'all' ? undefined : tabKey === 1 })
    setTrigger(false)
  }
  useEffect(() => {
    tabKeyRef.current = tabKey
  }, [tabKey])
  useEffect(() => {
    let startTime = 0 // 触摸开始时间
    let startDistanceX = 0 // 触摸开始X轴位置
    let endDistanceX = 0 // 触摸开始X轴位置
    let endTime = 0 // 触摸结束时间 
    let moveTime = 0
    let moveDistanceX = 0 // 触摸移动X轴距离
    ref.current!.addEventListener('touchstart', (e) => {
      startTime = new Date().getTime()
      startDistanceX = e.touches[0].clientX
    })
    ref.current!.addEventListener('touchend', (e) => {
      endTime = new Date().getTime()
      endDistanceX = e.changedTouches[0].clientX
      moveTime = endTime - startTime
      moveDistanceX = endDistanceX - startDistanceX

      if (Math.abs(moveDistanceX) > 40 && moveTime < 500) {
        // 判断左右
        console.log(moveDistanceX < 0 ? '👈' : '👉');
        let isLeft = moveDistanceX < 0
        if (isLeft) {
          switch (tabKeyRef.current) {
            case 'all':
              setValue('tabKey', 1)
              tabKeyRef.current = 1
              break;
            case 1:
              setValue('tabKey', 0)
              tabKeyRef.current = 0
              break;
            default:
              break;
          }
        } else {
          switch (tabKeyRef.current) {
            case 0:
              setValue('tabKey', 1)
              tabKeyRef.current = 1
              break;
            case 1:
              setValue('tabKey', 'all')
              tabKeyRef.current = 'all'
              break;
            default:
              break;
          }
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (loading && list.length === 0) return null;

  return (
    <ScrollView
      ref={ref}
      scrollTop={top}
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
      onScroll={(e) => {
        setValue('showTop', e.detail.scrollTop >= 300)
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
    Taro.navigateTo({ url: `/packageA/demo/todo-detail/index` })
  }
  const handleremove = async (id) => {
    await removeTodo(id)
    await fetchTodos({ pageNum: 0 })
    Taro.showToast({ title: "删除成功", icon: 'none' })
  }
  const handleChange = async (id: string, bol: boolean) => {
    await changeTodoComplete(id, !bol)
    await fetchTodos({ pageNum: 0 })
    Taro.showToast({ title: "更新成功", icon: 'none' })
  }
  return (
    <View className={styles.todo_item}>
      <View
        className={`${styles.desc} ${data.complete ? styles.complete : ''}`}
        onClick={() => handleJump(data)}
      >
        {data.description}
      </View>
      <View className={styles.actions}>
        <Checkbox checked={data.complete} value='0' onClick={() => handleChange(data._id, data.complete)} />
        <Image src={deleteIcon} className={styles.icon} onClick={() => handleremove(data._id)} />
      </View>

    </View>
  )
}
export default TodoContent;