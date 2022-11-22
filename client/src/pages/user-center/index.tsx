import { Button, View, Text, Image, Input } from "@tarojs/components";
import Taro, { useDidShow, UserInfo } from "@tarojs/taro";
import { useEffect, useMemo, useState } from "react";
import styles from './index.module.scss';
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
type Props = {

};

const UserCenter = (props: Props) => {

  const [userInfo, setUserInfo] = useState<UserInfo>()
  const [avatar, setAvatar] = useState<string | undefined>()

  const getUserInfo = () => {
    Taro.getUserInfo({
      success: function (res) {
        console.log(res);
        setUserInfo(res.userInfo);
      },
      fail(err) {
        Taro.showToast({ title: '授权失败!', icon: "none" })
      },
    })
  }

  useEffect(() => {
    // getUserInfo()
  }, [])
  return (
    <View className={styles.user_center}>
      <Button
      className={styles.avatar_wrapper}
        openType="chooseAvatar"
        onChooseAvatar={(e) => {
          setAvatar(e.detail.avatarUrl);
        }}>
        <Image src={avatar || defaultAvatarUrl} className={styles.avatar} />
      </Button>
      <View className={styles.nickname}>
        <Text>昵称:</Text>
        <Input type="nickname" className={styles.ipt} />
      </View>

      {
        avatar && (
          <View>

          </View>
        )
      }
    </View>
  );
};

export default UserCenter