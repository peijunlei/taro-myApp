import { Button, View, Text, Image } from "@tarojs/components";
import Taro, { useDidShow, UserInfo } from "@tarojs/taro";
import { useEffect, useMemo, useState } from "react";
import styles from './index.module.less'

type Props = {

};

const UserCenter = (props: Props) => {

  const [userInfo, setUserInfo] = useState<UserInfo>()

  const getUserInfo = () => {
    Taro.getUserProfile({
      desc: '用于完善会员资料',
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
      <Button onClick={getUserInfo} >获取用户信息</Button>
      <Button openType="getPhoneNumber" onGetPhoneNumber={(e) => {
        console.log(e);
      }}>获取用户电话</Button>
      {
        userInfo && (
          <View>
            <Image src={userInfo?.avatarUrl || ""} className={styles.avatar} />
            <View>
              <Text>昵称:</Text>
              <Text>{userInfo?.nickName}</Text>
            </View>
          </View>
        )
      }
    </View>
  );
};

export default UserCenter