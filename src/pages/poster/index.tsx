import { FC, useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import Poster, { PosterRef } from '@/components/poster';

const PosterPage: FC = () => {
  const poster = useRef<PosterRef>(null);


  useEffect(() => {
    Taro.getImageInfo({
      src: '/src/bg.png',
      success (res) {
        console.log(res);
        
      }
    })
  },[])
  if (TARO_ENV === 'h5') return <View>h5不支持!</View>
  return (
    <Poster
      style={{ marginLeft: Taro.pxTransform(95) }}
      width={560}
      height={844}
      ref={poster}
      renderType="image"
      disableRerender
      // debug
      showMenuByLongpress
      onRender={(url) => console.log('onRender', url)}
      onSave={(url) => console.log('onSave', url)}
      list={[
        // {
        //   type: 'shape',
        //   x: 0,
        //   y: 0,
        //   gradient: {
        //     position: [0, 0, 560, 336],
        //     colors: ['#FB5629', '#FC7B00']
        //   },
        //   width: 560,
        //   height: 336,
        //   radius: 16,
        // },
        // {
        //   type: 'image',
        //   x: 0,
        //   y: 0,
        //   width: 560,
        //   height: 336,
        //   mode: 'cover',
        //   src: 'https://img.1000.com/shumou/interaction/bg3.png',
        // },
        {
          type: 'image',
          x: 0,
          y: 0,
          width: 560,
          height: 336,
          mode: 'cover',
          src: 'https://img.1000.com/shumou/interaction/bg3.png',
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
          src: 'https://test-wanmi-1305193689.cos.ap-chengdu.myqcloud.com/0f9102bac6bc3e464fc7974f514621e0.png?imageMogr2/thumbnail/340x',
        },
        {
          type: 'text',
          x: 40,
          y: 652,
          width: 320,
          text: '星巴克原味微甜星巴克原味微甜咖啡正宗星巴克原味250g10袋原装货',
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
          y: 740,
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
          x: (_, instance) => instance.measureTextWidth('¥19.90',{
            fontSize:32
          }) + 40 + 8,
          y: 782,
          width: (textWidth) => textWidth,
          text: '¥19.90',
          color: 'rgba(0, 0, 0, 0.4)',
          fontSize: 20,
          baseLine: 'normal',
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
          y: 656,
          width: 120,
          height: 120,
          radius: 60,
          src: 'https://test-wanmi-1305193689.cos.ap-chengdu.myqcloud.com/0f9102bac6bc3e464fc7974f514621e0.png?imageMogr2/thumbnail/340x',
        },
      ]}
    />
  );
};

export default PosterPage;