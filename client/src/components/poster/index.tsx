import { Canvas, Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  Fragment,
} from "react";
import FreePoster from "./free-poster";
import { PosterItemConfig } from "./free-poster/types";
import { PosterCanvasProps, PosterImageProps, PosterProps, PosterRef } from "./type";
import { toPx } from "./free-poster/utils";
import close from './img/close.png'
import './index.less';
// TODO: 支持text-decoration!!!
const QMPosterCore: ForwardRefRenderFunction<PosterRef, PosterProps> = (
  props,
  ref
) => {
  const $retryCounter = useRef<number>(0);
  const { canvasId = "posterCanvasId", renderType = "image", showClose = true, backgroundColor = '#fff', radius = 16 } = props;
  const $isFirst = useRef<boolean>(true);
  const [url, setUrl] = useState<string>();
  const $freePoster = useRef<FreePoster>();

  useEffect(() => {
    Taro.nextTick(async () => {
      const freePoster = new FreePoster({
        canvasId,
        debug: props.debug,
        width: props.width,
        height: props.height,
        quality: props.quality,
        fileType: props.fileType,
        downloadLimit: props.downloadLimit,
        onSave: props.onSave,
        onSaveFail: props.onSaveFail,
      });
      $freePoster.current = freePoster;
      // props.backgroundColor && (await freePoster.setCanvasBackground(props.backgroundColor));
      await render();
      $isFirst.current = false;
    });
    // eslint-disable-next-line
  }, []);

  async function render(
    config?: PosterItemConfig[] | ((instance: FreePoster) => PosterItemConfig[])
  ): Promise<string | undefined> {
    if ($freePoster.current) {
      $freePoster.current.clearRect();
      $freePoster.current.time("渲染海报完成");
      const tmp = config ?? props.list;
      const list = Array.isArray(tmp) ? tmp : tmp($freePoster.current);
      list.unshift({
        type: 'shape',
        x: 0,
        y: 0,
        width: props.width,
        height: props.height,
        fillStyle: backgroundColor,
        radius
      })
      // 提前加载图片
      await $freePoster.current.preloadImage(
        list.reduce((arr, item) => {
          if (item.type === "image") {
            arr.push(item.src);
          }
          return arr;
        }, [] as string[])
      );
      // 按顺序渲染
      for await (const item of list) {
        await $freePoster.current.exec(item);
      }
      if (props.renderType === "image") {
        try {
          const temp = await $freePoster.current.canvasToTempFilePath();
          setUrl(temp);
          props?.onRender?.(temp);
          $retryCounter.current = 0;
          $freePoster.current.timeEnd("渲染海报完成");
          return temp;
        } catch (e) {
          if (++$retryCounter.current <= 2) {
            $freePoster.current.log(`第${$retryCounter.current}次重新渲染`);
            await render();
          } else {
            $freePoster.current.log(`重新渲染失败，放弃治疗`);
            props?.onRenderFail?.(e);
          }
        }
      } else {
        $retryCounter.current = 0;
        props?.onRender?.();
        $freePoster.current.timeEnd("渲染海报完成");
      }
    }
  }

  useEffect(() => {
    if (!$isFirst.current) {
      render();
    }
    // eslint-disable-next-line
  }, [props.list]);

  /**暴露方法 */
  useImperativeHandle(ref, () => ({
    savePosterToPhoto: async () => {
      try {
        if ($freePoster.current) {
          return await $freePoster.current.savePosterToPhoto();
        }
        return "";
      } catch (e) {
        return "";
      }
    },
    preview: async () => {
      try {
        if ($freePoster.current) {
          $freePoster.current.time("渲染预览用时");
          const res = await $freePoster.current.canvasToTempFilePath();
          await Taro.previewImage({ urls: [res], current: res });
          $freePoster.current.timeEnd("渲染预览用时");
        }
      } catch (e) {
        $freePoster.current?.log("预览图片出错", e);
      }
    },
    render,
  }));

  return (
    <View className="poster-wrapper">
      <Canvas
        id={canvasId}
        canvas-id={canvasId}
        onLongTap={() => props.renderType === "canvas" && props.onLongPress?.()}
        className={props.className}
        // @ts-ignore 兼容支付宝
        width={toPx(props.width)}
        // @ts-ignore 兼容支付宝
        height={toPx(props.height)}
        style={{
          width: Taro.pxTransform(props.width),
          height: Taro.pxTransform(props.height),
          position: "fixed",
          left: "-9999px",
        }}
      />
      {url && renderType === "image" && (
        <Image
          className={props.className}
          src={url}
          style={{
            width: Taro.pxTransform(props.width),
            height: Taro.pxTransform(props.height),
            ...props.style,
          }}
          showMenuByLongpress={props.showMenuByLongpress}
          onLongPress={() => props?.onLongPress?.(url)}
        />
      )}
      {url && renderType === "image" && showClose && (
        <View
          className="close"
          onClick={(e) => {
            e.stopPropagation();
            typeof props.onClose === 'function' && props.onClose();
            setUrl("")
          }}
        >
          <Image src={close} className="img" />
        </View>
      )}
    </View>
  );
};


export type {
  PosterRef,
  PosterProps,
  PosterItemConfig,
  PosterImageProps,
  PosterCanvasProps,
};
export { FreePoster };
export const Poster = memo(forwardRef(QMPosterCore), (prev, next) => {
  if (next.disableRerender) {
    return true;
  }
  if (typeof prev.list === "function" || typeof next.list === "function") {
    return false;
  }
  return _isEqual(prev.list, next.list);
});

function _isEqual(prevList: PosterItemConfig[], nextList: PosterItemConfig[]) {
  for (let [i, item] of prevList.entries()) {
    for (let [k, v] of Object.entries(item)) {
      if (typeof v === "function") {
        return false;
      }
      if (v !== nextList[i][k]) {
        return false;
      }
    }
  }
  return true;
}

export default Poster;
