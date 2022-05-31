import { Component, useEffect, useMemo, useState } from 'react'
import { View, Button, Text, ScrollView, Image, Input, Map, MapProps } from '@tarojs/components'

import './index.less'
import Taro, { useDidShow } from '@tarojs/taro'
import { getTaroSetting } from '../../utils'

const amapFile = require('../../../libs/amap-wx.130')
const WX_KEY = "a3a5045135be795588b12339c79090a4"
const WEB_KEY = "d44a341bc63aee604518e1d2c15a6255"
const Index = () => {
  const [list, setList] = useState([])
  const [address, setAddress] = useState()
  const [keywords, setKeywords] = useState('新华汇')
  const [location, setLocation] = useState(() => {
    return Taro.getStorageSync("lngAndLat")
  })
  const markers = useMemo(() => {
    return list.map((v: any) => {
      const marker: MapProps.marker = {
        id: parseInt(v.typecode),
        longitude: typeof (v.location) === "string" ? (v.location as string).split(",")[0] as unknown as number : 0,
        latitude: typeof (v.location) === "string" ? (v.location as string).split(",")[1] as unknown as number : 0,
        iconPath: "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fbpic.136pic.com%2Fkimg%2F924%2F2015%2F10%2F25%2Ffa5e15480c2a1ee52ac606bf054fdc11.jpg&refer=http%3A%2F%2Fbpic.136pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1654569702&t=548d701d0aa8620909a538b473229064",
        width: 20,
        height: 20,
      }
      return marker
    })
  }, [list])

  const getTips = async () => {
    if (!keywords.trim()) return Taro.showToast({ title: '不可为空', icon: 'none' })

    const _keywords = keywords
    console.log('_keywords', _keywords);

    new amapFile.AMapWX({ key: WX_KEY }).getInputtips({
      keywords: _keywords,
      location,
      success(data) {
        console.log('getInputtips', data);
        setList(data.tips)
      },
      fail(info) {
        console.log(info);
      }
    })
  }

  const getWebTips = async () => {
    if (!keywords.trim()) return Taro.showToast({ title: '不可为空', icon: 'none' })

    Taro.request({
      url: "https://restapi.amap.com/v5/place/text",
      data: {
        key: WEB_KEY,
        location,
        keywords,
        page_size: 30,
      },
      method: "GET",
      header: { "content-type": "application/json" },
      success: function (res) {
        console.log('getWebKeywordsSearchV2', res.data);
        setList(res.data.pois)
      },
      fail: function (err) {
        console.log(err);
      }
    })
  }
  /**获取经纬度 */
  const getLocation = () => {
    getTaroSetting('userLocation').then(() => {
      Taro.getLocation({
        type: "gcj02",
        success(result) {
          console.log(result);
          const lngAndLatStr = result.longitude + "," + result.latitude
          Taro.setStorageSync('lngAndLat', lngAndLatStr)
          getRegeo(lngAndLatStr)
        },
        fail(res) {
          console.log(res);
          Taro.showToast({ title: '失败', icon: 'none' })
        },
      })
    })
  }

  /**获取当前位置详细信息 */
  const getRegeo = (location) => {
    const AMapWxFun = new amapFile.AMapWX({ key: WX_KEY })
    AMapWxFun.getRegeo({
      location,
      iconPath: "./location.png",
      success: function (res) {
        setAddress(res[0])
        Taro.showToast({ title: '获取位置成功', icon: 'none' })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
  useDidShow(() => {
    getLocation()
  })
  useEffect(() => {
    getRegeo(location)
  }, [location])
  return (
    <View className='map_container'>
      <View>
        当前位置:{address?.name}
      </View>
      <View className='search'>
        <Input
          className='ipt'
          value={keywords}
          onInput={(e) => setKeywords(e.detail.value)}
        />
        <View onClick={getTips} className="btn">搜索</View>
      </View>

      {/* <Button onClick={getWebTips}>获取提示web</Button> */}
      {/* <Button onClick={getRegeo}>获取当前位置详细信息</Button> */}

      <Map
        style={{
          width: "100%",
          height: 400
        }}
        className="map"
        longitude={(location as string).split(",")[0] as unknown as number}
        latitude={(location as string).split(",")[1] as unknown as number}
        markers={markers}
        onTap={(e) => {
          const locationStr = e.detail.longitude + "," + e.detail.latitude
          console.log('当前经纬度', locationStr);
          setLocation(locationStr)
        }}
      ></Map>
      {/* {
        url && <Image src={url} />
      } */}

      <ScrollView>
        {
          list.map((v, i) =>
            <View
              style={{
                fontSize: 10,
                backgroundColor: "hotpink"
              }}
            >
              {i + 1} - {v.district ? v.district + v.address + v.name : v.pname + v.cityname + v.adname + v.address + v.name}
            </View>
          )
        }
      </ScrollView>
    </View>
  )
}

export default Index;

