import { FC, useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import Poster, { PosterItemConfig, PosterRef } from '@/components/poster';
import ShareModal from './shareModal';

const PosterPage: FC = () => {
  const [visible, setVisible] = useState(false)

  if (TARO_ENV === 'h5') return <View>h5不支持!</View>
  return (
    <View>
      {
        visible &&
        <ShareModal
          onClose={() => setVisible(false)}
        />
      }
      <Button onClick={() => setVisible(true)}> 生成海报 </Button>
    </View>
  );
};

export default PosterPage;