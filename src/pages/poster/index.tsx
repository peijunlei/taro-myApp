import { FC, useEffect, useRef, useState } from 'react';
import Taro from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import Poster, { PosterItemConfig, PosterRef } from '@/components/poster';

const getList = (): PosterItemConfig[] => {
  return [
    {
      type: 'shape',
      x: 0,
      y: 0,
      gradient: {
        position: [0, 0, 560, 336],
        colors: ['#FB5629', '#FC7B00']
      },
      width: 560,
      height: 336,
      radius: '16 16 0 0',
    },
    {
      type: 'image',
      x: 40,
      y: 48,
      width: 80,
      height: 80,
      radius: 40,
      src: 'https://img.1000.com/shumou/interaction/avatar.png',
    },
    // 这里的文字与下一个文字要联动居中
    {
      type: 'text',
      x: 136,
      y: 56,
      width: (textWidth) => textWidth,
      height: 20,
      text: '中二猪猪猪猪猪猪',
      color: '#fff',
      fontSize: 20,
      baseLine: 'normal',
    },
    {
      type: 'text',
      x: 136,
      y: 88,
      width: (textWidth) => textWidth,
      height: 32,
      text: '快来帮我砍一刀!',
      color: '#fff',
      fontSize: 32,
      baseLine: 'normal',
    },
    {
      type: 'image',
      x: 40,
      y: 152,
      width: 480,
      height: 480,
      radius: 12,
      src: 'https://img14.360buyimg.com/n0/jfs/t1/219497/18/1719/231993/61762935E0be23330/53ff0150593d5852.jpg',
    },
    {
      type: 'text',
      x: 40,
      y: 652,
      width: 320,
      text: '星巴克原味微甜星巴克原味微甜咖啡正星巴克原味微甜星巴克原味微甜咖啡',
      color: 'rgba(0, 0, 0, 0.8)',
      fontSize: 24,
      lineHeight: 32,
      lineNum: 2,
      baseLine: 'normal',
    },
    {
      type: 'shape',
      x: 40,
      y: 736,
      width: 76,
      height: 28,
      gradient: {
        position: [40, 750, 116, 750],
        colors: ['#FB5629', '#FC7B00']
      },
      radius: 4,
    },
    {
      type: 'text',
      x: 48,
      y: 738,
      width: (textWidth) => textWidth,
      text: '砍价享',
      color: '#fff',
      fontSize: 20,
      baseLine: 'normal',
    },
    {
      type: 'text',
      x: 40,
      y: 772,
      width: (textWidth) => textWidth,
      text: '¥19.9',
      color: '#FF6600',
      fontSize: 32,
      lineHeight: 32,
      baseLine: 'normal',
    },
    {
      type: 'text',
      x: (_, instance) => instance.measureTextWidth('¥19.90', {
        fontSize: 32
      }) + 40 + 8,
      y: 782,
      width: (textWidth) => textWidth,
      text: '¥19.90',
      color: 'rgba(0, 0, 0, 0.4)',
      fontSize: 20,
      lineHeight: 20,
      baseLine: 'normal',
      textDecoration: "line-through"
    },
    {
      type: 'text',
      x: 398,
      y: 784,
      width: (textWidth) => textWidth,
      text: '长按帮TA砍价',
      color: 'rgba(0, 0, 0, 0.4)',
      fontSize: 20,
      baseLine: 'normal',
    },
    {
      type: 'image',
      x: 400,
      y: 650,
      width: 120,
      height: 120,
      radius: 60,
      src: 'https://qrimg.jd.com/https%3A%2F%2Fitem.m.jd.com%2Fproduct%2F1233203.html%3Fpc_source%3Dpc_productDetail_1233203-118-1-4-2.png',
    },
  ]
}
const PosterPage: FC = () => {
  const poster = useRef<PosterRef>(null);
  const [visible, setVisible] = useState(false)
  const savePicToAlbum = () => {
    poster.current?.savePosterToPhoto()
  };
  const previewImage = () => {
    poster.current?.preview()
  };
  if (TARO_ENV === 'h5') return <View>h5不支持!</View>
  return (
    <View>
      {
        visible &&
        <Poster
          width={560}
          height={844}
          ref={poster}
          renderType="image"
          disableRerender
          debug
          showMenuByLongpress
          onRender={(url) => console.log('onRender', url)}
          onClose={() => setVisible(false)}
          list={getList}
        />
      }
      <Button onClick={() => setVisible(true)}> 生成海报 </Button>
      <Button onClick={savePicToAlbum}> 保存相册 </Button>
      <Button onClick={previewImage}> 预览 </Button>
    </View>
  );
};

export default PosterPage;