import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { FC, useEffect, useRef, useState } from "react";
import { PosterItemConfig, PosterRender, PosterRenderRef } from "taro-poster-render";
import { fetchQrcode } from "../api";
import './index.less'

interface ShareModalProps {
  onClose: () => void;
}

const ShareModal: FC<ShareModalProps> = ({ onClose }) => {
  const poster = useRef<PosterRenderRef>(null);
  const [code, setCode] = useState('')

  const getQrcode = async () => {
    Taro.showLoading({ title: "加载中..." })
    const res = await fetchQrcode() as string;
    setCode(res)
  }

  const getList = (): PosterItemConfig[] => {
    return [
      {
        type: 'rect',
        x: 0,
        y: 0,
        width: 560,
        height: 844,
        backgroundColor:"#369",
        radius: 16,
      },
      {
        type: 'rect',
        x: 0,
        y: 0,
        width: 560,
        height: 336,
        radius: [16, 16, 0, 0],
      },
      {
        type: 'image',
        x: 40,
        y: 48,
        width: 80,
        height: 80,
        radius: 40,
        src: 'http://tmp/eas3BBJqrs5f2ab119855d4348c4efe11661dddf7608.jpeg',
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
        baseLine: "bottom"
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
        height: 32,
        text: '星巴克原味微甜星巴克原味微甜咖啡正星巴克原味微甜星巴克原味微甜咖啡',
        color: 'rgba(0, 0, 0, 0.8)',
        fontSize: 24,
        lineHeight: 32,
        lineNum: 2,
      },
      {
        type: 'rect',
        x: 40,
        y: 736,
        width: 76,
        height: 28,
        radius: 4,
      },
      {
        type: 'text',
        x: 48,
        y: 738,
        width: (textWidth) => textWidth,
        height: 20,
        text: '砍价享',
        color: '#fff',
        fontSize: 20,
      },
      {
        type: 'text',
        x: 40,
        y: 772,
        width: (textWidth) => textWidth,
        height: 32,
        text: '¥19.9',
        color: '#FF6600',
        fontSize: 32,
        lineHeight: 32,
      },
      {
        type: 'text',
        x: (_, instance) => instance.measureText('¥19.90', {
          fontSize: 32
        }).width + 40 + 8,
        y: 782,
        width: (textWidth) => textWidth,
        height: 20,
        text: '¥19.90',
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 20,
        lineHeight: 20,
        textDecoration: "underline"
      },
      {
        type: 'text',
        x: 398,
        y: 784,
        width: (textWidth) => textWidth,
        height: 20,
        text: '长按帮TA砍价',
        color: 'rgba(0, 0, 0, 0.4)',
        fontSize: 20,
      },
      {
        type: 'image',
        x: 400,
        y: 650,
        width: 120,
        height: 120,
        radius: 60,
        src: code,
      },
    ]
  }

  useEffect(() => {
    getQrcode()
  }, [])
  return (
    <View className="share-modal-mask-wrapper">
      {
        code && <PosterRender
          className="poster"
          canvasId="pjl-poster"
          style={{ width: 280, height: 422 }}
          canvasWidth={560}
          canvasHeight={844}
          ref={poster}
          renderType="image"
          disableRerender
          debug
          showMenuByLongpress
          onRender={(url) => {
            Taro.hideLoading()
          }}
          onRenderFail={() => Taro.hideLoading()}
          list={getList}
        />
      }

    </View>
  );
}

export default ShareModal;