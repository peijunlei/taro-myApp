import Taro from "@tarojs/taro";


const request = (url, params: any) => {
  return new Promise((resolve, reject) => {
    Taro.request({
      url: url,
      data: { key: 'd44a341bc63aee604518e1d2c15a6255', ...params },
      success(result) {
        resolve(result.data);
      },
      fail(err) {
        reject(err)
      },
    })
  })

}

export const getPoisList = (params) => {
  return request('https://restapi.amap.com/v5/place/text', params)
}

/**
 * 经纬度转地址
 * @param params 
 * @returns 
 */
export const getRegeo = (params) => {
  return request('https://restapi.amap.com/v3/geocode/regeo', params)
}

/**
 * 地址转经纬度
 * @param params 
 * @returns 
 */
 export const getGeo = (params) => {
  return request('https://restapi.amap.com/v3/geocode/geo', params)
}
/**
 * 地址转经纬度
 * @param params 
 * @returns 
 */
 export const getAround = (params) => {
  return request('https://restapi.amap.com/v5/place/around', params)
}