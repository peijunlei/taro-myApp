import Taro, { setStorageSync } from '@tarojs/taro'
import { Component, useEffect, useMemo, useRef, useState } from 'react'
import { Input, View } from '@tarojs/components'
import './index.less'
import { getAddress, getLocation, isH5, lngAndLat } from '../../utils'
import MapComponent, { LngAndLat } from '@/components/MapComponent'
import MapSite from '@/components/map-site'

// const amapFile = require('../../../libs/amap-wx.130')

const Index = () => {

  const [address, setAddress] = useState("")
  const [lngAndLat, setLngAndLat] = useState<LngAndLat>()

  useEffect(() => {
    // getLocation().then(result => {
    //   console.log('经纬度', result);
    //   setLngAndLat({ lng: result.lng, lat: result.lat })
    // })

  }, [])
  return (
    <View >
      {/* <MapComponent
        lngAndLat={lngAndLat}
        onRender={(res) => {
          setAddress(res.formattedAddress)
        }}
        onChange={(value) => {
          console.log(value);
        }}
        onInputChange={(e)=>{
          console.log(e);
          
        }}
      /> */}
      <MapSite />
    </View>
  )
}

export default Index;

