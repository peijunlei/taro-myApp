
import request from "./fetch";
const ApiUrl: {
  inputtips: string;
  geo: string;
  around: string;
  regeo: string;
} = {
  inputtips: "https://restapi.amap.com/v3/assistant/inputtips",
  geo: "https://restapi.amap.com/v3/geocode/geo",
  around: "https://restapi.amap.com/v5/place/around",
  regeo: "https://restapi.amap.com/v3/geocode/regeo"
};
class API {
  /**
   * 输入提示
   * @param data 
   * @returns 
   * @see https://lbs.amap.com/api/webservice/guide/api/inputtips
   */
  static _getInputtips(data: { keywords: string }) {
    return request({
      url: ApiUrl.inputtips,
      method: "GET",
      params: data
    });
  }

  /**
   * 地理编码 位置=>坐标
   * @param data
   * @returns
   * @see https://lbs.amap.com/api/webservice/guide/api/georegeo
   */
  static _getGeo(data: { address: string }) {
    return request({
      url: ApiUrl.geo,
      method: "GET",
      params: data
    });
  }
  /**
   * 逆地理编码 坐标=>位置
   * @param data 
   * @returns 
   * @see https://lbs.amap.com/api/webservice/guide/api/georegeo
   */
  static _getReGeo(data: { location: string; }) {
    return request({
      url: ApiUrl.regeo,
      method: "GET",
      params: data
    });
  }
  /**
   * 周边搜索
   * @param data 
   * @returns 
   * @see https://lbs.amap.com/api/webservice/guide/api/newpoisearch#t6
   */
  static _getAround(data: { location: string }) {
    return request({
      url: ApiUrl.around,
      method: "GET",
      params: data
    });
  }

}
export default API;
