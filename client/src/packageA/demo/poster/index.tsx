import { useState } from 'react';
import { Button, View } from '@tarojs/components';
import ShareModal from './shareModal';
import Taro from '@tarojs/taro';
import LocalCache from '@/cache';

function PosterPage() {
  const [visible, setVisible] = useState(false)
  const handlePoster = () => {
    Taro.showLoading({ title: "加载中..." })
    Taro.getUserProfile({
      desc: '用于完善会员资料',
      success(res) {
        Taro.setStorageSync(LocalCache.USER_INFO, res.userInfo)
      },
      complete() {
        setVisible(true)
      }
    })
  }
  return (
    <View>
      {visible && <ShareModal onClose={() => setVisible(false)} />}
      <Button onClick={() => handlePoster()}> 生成海报 </Button>
    </View>
  );
};

export default PosterPage;