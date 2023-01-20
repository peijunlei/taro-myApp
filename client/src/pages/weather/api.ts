

import Taro from "@tarojs/taro";
const KEY = 'd1afa383cd58499bb736cd57342e452d'   //和风天气中应用的key名称
const USER_ID = 'HE2211262043531492' //和风天气中应用的密钥ID

const request = (url, params: any) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: url,
      method: 'GET',
      data: { key: KEY, ...params },
      success(result) {
        resolve(result.data);
      },
      fail(err) {
        reject(err)
      },
    })
  })

}
/**近3日 */
export const getWeather3d = (params) => {
  return request('https://devapi.qweather.com/v7/weather/3d', params)
}

/**实时天气 */
export const getWeatherNow = (params) => {
  return request('https://devapi.qweather.com/v7/weather/now', params)
}
/**空气质量 */
export const getWeatherAir = (params) => {
  return request('https://devapi.qweather.com/v7/air/now', params)
}
/**穿衣指数 */
export const getWeatherDress= (params) => {
  return request('https://devapi.qweather.com/v7/indices/1d?type=3', params)
}



