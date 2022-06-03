import Taro from "@tarojs/taro";

export interface lngAndLat {
  lng: number;
  lat: number;
}
const defaultLngLat: lngAndLat = { lng: 114.24779, lat: 22.71991 };
export const isH5 = TARO_ENV === 'h5'

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

