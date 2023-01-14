import { Button, View, Textarea } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { useEffect, useMemo, useState } from "react";
import { addTodo } from "../../../pages/todo/api";
import styles from './index.module.scss';

type Props = {

};

const TodoDetail = (props: Props) => {
  const [value, setVal] = useState('')
  async function handleSave() {
    if (!value.trim()) return Taro.showToast({ title: "请输入描述", icon: 'none' })
    await addTodo({
      description: value,
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

  // const subscribe = async () => new Promise(async (resolve, reject) => {
  //   await Taro.requestSubscribeMessage({
  //     tmplIds: ['7yK6xGoEWLCx8TbG_OEyH9iRe53HjOogeMllq7a11tI'],
  //     success(res) {
  //       let arr = [] as string[]
  //       for (const key in res) {
  //         const value = res[key];
  //         value === 'accept' && arr.push(key)
  //       }
  //       if (arr.length > 0) {
  //         Taro.cloud.callFunction({ name: "login", }).then(res => {
  //           Taro.cloud.callFunction({
  //             name: "subscribe",
  //             data: {
  //               openId: res.result.openid,
  //               page: '/pages/todo/index',
  //               templateId: arr[0],
  //               data: {
  //                 "time1": {
  //                   "value": '2022-12-12'
  //                 },
  //                 "thing2": {
  //                   "value": "学习云开发"
  //                 },
  //                 "time3": {
  //                   "value": '2022-12-13'
  //                 },
  //               }
  //             }
  //           }).then(res => {
  //             resolve(res)
  //           })
  //         })
  //       }else{
  //         resolve(true)
  //       }
  //     },
  //     fail(result) {
  //       reject(result)
  //     },
  //   })
  // })


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