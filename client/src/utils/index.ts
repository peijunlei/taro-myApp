import Taro, { pxTransform } from "@tarojs/taro";


const { screenWidth } = Taro.getSystemInfoSync();

export const isFunction = (value: unknown): value is Function => typeof value === 'function';
export const isH5 = TARO_ENV === "h5"

export function toRpx(px: number) {
  return pxTransform(Math.round(px / (screenWidth / 750)));
}