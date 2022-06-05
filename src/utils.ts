import Taro from "@tarojs/taro";

export interface lngAndLat {
  lng: number;
  lat: number;
}
const defaultLngLat: lngAndLat = { lng: 114.24779, lat: 22.71991 };
export const isH5 = TARO_ENV === 'h5'
export const AllIcon: {
  markerIcon: string;
  searchIcon: string;
  selfIcon: string;
  closeIcon: string;
  chooseIcon: string;
  addressIcon: string;
} = {
  markerIcon:
    "https://img.alicdn.com/imgextra/i4/O1CN01xSMn9X1NZ3fk0Q2Lj_!!6000000001583-2-tps-104-126.png",
  searchIcon:
    "https://img.alicdn.com/imgextra/i3/O1CN01BqbAld1aHjhHvqUq4_!!6000000003305-2-tps-32-32.png",
  selfIcon:
    "https://img.alicdn.com/imgextra/i2/O1CN017aEHag28cWbsBj8am_!!6000000007953-2-tps-78-56.png",
  closeIcon:
    "https://img.alicdn.com/imgextra/i4/O1CN01CjEaO71JXRolpeE1H_!!6000000001038-2-tps-32-32.png",
  chooseIcon:
    "https://img.alicdn.com/imgextra/i4/O1CN01Zpoczy20YqVTdKSrO_!!6000000006862-2-tps-32-32.png",
  addressIcon:
    "https://img.alicdn.com/imgextra/i4/O1CN01eIPIII239bWOLZsBk_!!6000000007213-2-tps-32-32.png"
};
export function getWxLocation() {
  return new Promise<lngAndLat>((resolve, reject) => {
    Taro.getSetting({
      success: async (res) => {
        if (res.authSetting['scope.userLocation'] === false) {
          Taro.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: async function (res) {
              if (res.cancel) {
                Taro.showToast({ title: '拒绝授权', icon: 'none' });
                resolve(defaultLngLat)
              } else if (res.confirm) {
                Taro.openSetting({
                  success: async function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      Taro.showToast({ title: '授权成功', icon: 'success', })
                      //再次授权，调用wx.getLocation的API
                      const result = await getCurrentLocation();
                      resolve(result)
                    } else {
                      Taro.showToast({ title: '授权失败', icon: 'none', });
                      resolve(defaultLngLat)
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          Taro.authorize({
            scope: 'scope.userLocation',
            success: async () => {
              //用户同意开启授权
              const result = await getCurrentLocation()
              resolve(result)
            },
            fail(res) { //用户拒绝开启授权
              Taro.showToast({ title: '授权失败', icon: 'none' });
              resolve(defaultLngLat)
            }
          })
        } else if (res.authSetting['scope.userLocation'] == true) {
          const result = await getCurrentLocation()
          resolve(result)
        }
      }
    });
  });
}


function getCurrentLocation() {
  return new Promise<lngAndLat>((resolve, reject) => {
    Taro.getLocation({
      type: 'gcj02',
      success: function (res) {
        resolve({ lng: res.longitude, lat: res.latitude });
      },
      fail: function (res) {
        resolve(defaultLngLat)
      }
    })
  })

}



/**默认经纬度 */

export function getDefaultLngLat() {
  return new Promise<lngAndLat>((resolve, reject) => {
    setTimeout(() => {
      resolve(defaultLngLat)
    }, 1000);
  })
}

function getH5Location() {
  return new Promise<lngAndLat>((resolve, reject) => {
    AMap.plugin('AMap.Geolocation', () => {
      const geolocation = new AMap.Geolocation({
        timeout: 10000,
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        GeoLocationFirst: true,
      });
      geolocation.getCurrentPosition(async function (status: any, result: any) {
        console.log('高德定位', result, status);

        if (status == 'complete') {
          resolve({ lng: result.position.lng, lat: result.position.lat })
        } else {
          const result = await getDefaultLngLat()
          resolve(result)
        }
      });

    });
  })
}

/**
 * 获取位置经纬度 (区分 h5 和 weapp)
 * @returns {lngAndLat}
 */
export async function getLocation() {
  const lngAndLat = isH5 ? await getH5Location() : await getWxLocation()
  return lngAndLat
};
/**
 * 获取地址中指定的查询参数值。
 * @param name 查询参数名。
 * @param url 原地址。
 * @return 返回查询参数值。如果找不到则返回 null。
 * @example getQuery("foo", "?foo=1") // "1"
 * @example getQuery("goo", "?foo=1") // null
 */
 export function getQuery(name: string, url = window.location.href) {
  let match = /\?([^#]*)/.exec(url);
  if (match) {
    match = new RegExp(
      "(?:^|&)" +
        encodeURIComponent(name).replace(/([.*+?^${}()|[\]\\])/g, "\\$1") +
        "=([^&]*)(?:&|$)",
      "i"
    ).exec(match[1]);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }
  return "";
}

/**逆向地理编码 */
export function getAddress(lngAndLat: lngAndLat) {
  return new Promise((resolve, reject) => {
    AMap.plugin('AMap.Geocoder', function () {
      const geocoder = new AMap.Geocoder({
      })
      const lnglat = [lngAndLat.lng, lngAndLat.lat]
      let marker = new AMap.Marker();
      marker.setPosition(lnglat);
      geocoder.getAddress(lnglat, function (status: any, result: any) {
        console.log('逆向地理编码', result,status);

        if (status === 'complete' && result.info === 'OK') {
          // result为对应的地理位置详细信息
          console.log(result);
          resolve(result)
        }
      })
    })
  })
}

