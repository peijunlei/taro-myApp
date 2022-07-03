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

  const init = () => {
    Taro.getLocation({
      type: 'gcj02', // gcj02
      success(res) {
        setState({ lat: res.latitude, lng: res.longitude }) // 设置经纬度信息
        Taro.setStorageSync("latlng", `${res.latitude},${res.longitude}`)
        _getLocation() // 获取当前位置点
      },
      fail(e) {
        // 获取失败
        console.log(e.errMsg);
        if (e.errMsg.includes('auth deny')) { // 如果是权限拒绝
          Taro.showModal({ // 显示提示
            content: '你已经拒绝了定位权限，将无法获取到你的位置信息，可以选择前往开启',
            success(res) {
              if (res.confirm) { // 确认后
                Taro.openSetting() // 打开设置页，方便用户开启定位
              }
            }
          })
        }
      }
    })
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

