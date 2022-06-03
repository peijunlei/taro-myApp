import Taro, { setStorageSync } from '@tarojs/taro'
import { Component, useEffect, useMemo, useRef, useState } from 'react'
import { View } from '@tarojs/components'
import './index.less'
import { getAddress, getLocation, isH5, lngAndLat } from '../../utils'

const amapFile = require('../../../libs/amap-wx.130')
const WX_KEY = "a3a5045135be795588b12339c79090a4"
const WEB_KEY = "d44a341bc63aee604518e1d2c15a6255"
const Index = () => {

  const [address, setAddress] = useState("")

  const initMap = async (lngAndLat: lngAndLat) => {
    const map = new AMap.Map('container', {
      zoom: 16,//级别
      center: [lngAndLat.lng, lngAndLat.lat],//中心点坐标
    });
    AMap.plugin('AMap.Geocoder', function () {
      var geocoder = new AMap.Geocoder({});
      var marker = new AMap.Marker();;
      const lnglat = [lngAndLat.lng, lngAndLat.lat]
      regeoCode(lnglat)
      map.on('click', function (e) {
        const lnglat = [e.lnglat.lng, e.lnglat.lat]
        regeoCode(lnglat)
      })
      function regeoCode(lnglat) {
        map.add(marker);
        marker.setPosition(lnglat);
        geocoder.getAddress(lnglat, function (status, result) {
          console.log('逆向地理编码', result, status);
          if (status === 'complete' && result.regeocode) {
            setAddress(result.regeocode.formattedAddress)
          } else {
          }
        });
      }
    })
  }
  useEffect(() => {
    getLocation().then(result => {
      console.log('经纬度', result);
      initMap(result)
    })

  }, [])
  return (
    <View >
      <View id='container' style={{ width: "100%", height: "50vh" }}></View>
      <View>当前位置:{address}</View>
    </View>
  )
}

export default Index;

