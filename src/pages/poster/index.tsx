import { FC, useEffect, useRef, useState } from 'react';
import { Button, View } from '@tarojs/components';
// import ShareModal from './shareModal2';
import ShareModal from './shareModal';
import Taro, { UserInfo } from '@tarojs/taro';
import { fetchQrcode } from './api';

const PosterPage: FC = () => {
  const [visible, setVisible] = useState(false)
  const [code, setCode] = useState<string>()
  const [userInfo, setUserInfo] = useState<UserInfo>()

  const getQrcode = async () => {
    const res = await fetchQrcode() as string;
    if (!res) {
      Taro.hideLoading()
      Taro.showToast({ title: "功能不可用",icon:"none" })
      return
    }
    setCode(res)
    setVisible(true)
  }
  const handlePoster = () => {
    Taro.showLoading({ title: "加载中..." })
    const userInfo = Taro.getStorageSync('user_info') as UserInfo
    if (userInfo.avatarUrl) {
      getQrcode()
    } else {
      Taro.getUserProfile({
        desc: "获取你的头像!",
        success: function (res) {
          console.log(res);
          setUserInfo(res.userInfo);
          Taro.setStorageSync("user_info", res.userInfo)
        },
        complete() {
          getQrcode()
        }
      })
    }
  }
  if (TARO_ENV === 'h5') return <View>h5不支持!</View>
  return (
    <View>
      {visible && <ShareModal onClose={() => setVisible(false)} userInfo={userInfo} qrcode={code} />}
      <Button onClick={handlePoster}> 生成海报 </Button>
    </View>
  );
};

export default PosterPage;