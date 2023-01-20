import { Button, View, Image, Input } from "@tarojs/components";
import { useState } from "react";





import styles from './index.module.scss';

const defaultAvatar = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';


function UserCenter() {

  const [nickname, setNickname] = useState('')
  const [avatar, setAvatar] = useState('')

  return (

    <View className={styles.user}>
      {
        avatar ?
          <Image src={avatar} className={styles.avatar} />
          : <Button openType='chooseAvatar' onChooseAvatar={(e) => {
            setAvatar(e.detail.avatarUrl)
          }}
          >
            获取头像
          </Button>
      }
      <Input
        type='nickname'
        className={styles.ipt}
        value={nickname}
        onInput={(e) => {
          setNickname(e.detail.value)
        }}
      />
      <Button
        onClick={() => {

        }}
      >
        保存
      </Button>
    </View>

  );
}

export default UserCenter;