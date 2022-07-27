import useSetState from '@/hooks/useSetState'
import { Input, View, Image, Button, Map } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'

import './index.less'
interface IState {
  lat: number;
  lng: number;
}
const MapPage = () => {
  const [state, setState] = useSetState<IState>({
    lat: 0,
    lng: 0
  })

  const _getLocation = () => {
    console.log(111);
  }
  const getLocation = () => {
    let _locationChangeFn = (res) => {
      setState({ lat: res.latitude, lng: res.longitude }) // 设置经纬度信息
      Taro.setStorageSync("latlng", `${res.latitude},${res.longitude}`)
      console.log(1111);
      Taro.offLocationChange(_locationChangeFn)
    }
    Taro.startLocationUpdate({
      success() {
        Taro.onLocationChange(_locationChangeFn)
      },
      fail(err) {
      }
    })
  }
  const init = () => {
    Taro.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation'] === false) {
          Taro.showModal({
            title: "提示",
            content: "需要授权位置信息!",
            success(res) {
              if (res.confirm) {
                Taro.openSetting({
                  success: function (res) {
                    if (res.authSetting['scope.userLocation']) {
                      Taro.showToast({ title: '授权成功' })
                      getLocation()
                    }
                  },
                  fail(err) {
                    Taro.showToast({ title: err.errMsg })
                  },
                })
              }
            },
          })
        } else {
          getLocation()
        }
      },
    })

    return




  }
  useEffect(() => {
    init()
  }, [])
  return (
    <View className='map_container'>
      <View>经度:{state.lat} </View>
      <View>纬度:{state.lng} </View>
      <Map
        style={{ height: '50vh', width: '100vw' }}
        latitude={state.lat}
        longitude={state.lng}
        showLocation
      />
    </View>
  )
}

export default MapPage;

