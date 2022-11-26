import useSetState from "@/hooks/useSetState";
import { Button, View, Text, Image, Input, Canvas } from "@tarojs/components";
import Taro, { useDidShow, UserInfo } from "@tarojs/taro";
import { useEffect, useMemo, useState } from "react";
import styles from './index.module.scss';


import bgimg from '@/assets/common/weather/cloud.jpg'
import { getRegeo } from "../gaode/api";
import { getWeather3d, getWeatherNow } from "./api";
import Icon from "@/components/Icon";
type Props = {

};


function Weather(props: Props) {

  const [data, setData] = useSetState({
    statusBarHeight: 32,
    backgroundImage: bgimg,
    backgroundColor: '#62aadc',
    paddingTop: 0,
    daily: [],
    current: {
      temp: '0',
      text: '数据获取中...',
      humidity: '0',
      feelsLike: '0',
      icon: '100'
    },
    today: {
      temp: 'N/A',
      weather: '暂无'
    },
    tomorrow: {
      temp: 'N/A',
      weather: '暂无'
    },
    // hourlyData
    hourlyData: [],
    city: '北京',
    weeklyData: [],
    width: 375,
    scale: 1,
    address: '定位中',
    latitude: 40.056974,
    longitude: 116.307689
  })
  const { paddingTop, address, current, daily } = data
  const { backgroundImage, backgroundColor } = data
  function init() {
    Taro.getSystemInfo({
      success: (res) => {
        console.log(res);

        let width = res.windowWidth
        let scale = width / 375
        setData({
          width,
          scale,
          paddingTop: res.statusBarHeight! + 2
        })
      }
    })
    getLocation()
  }
  function getLocation() {
    Taro.getLocation({
      type: 'gcj02',
      success: (res) => {
        let { longitude, latitude } = res
        console.log(res);

        setData({
          latitude,
          longitude
        })
        getAddress(longitude, latitude)
      }

    })
  }
  // 处理逆经纬度
  async function getAddress(longitude, latitude) {

    Taro.showLoading({ title: '定位中' })
    const res = await getRegeo({ location: `${longitude},${latitude}` }) as any
    setData({ address: res.regeocode?.formatted_address || '南京' })
    getWeatherData()
  }

  async function getWeatherData() {
    const { longitude, latitude } = data;
    const location = `${longitude},${latitude}`
    const params = { location }
    try {
      const [res1, res2] = await Promise.all([getWeatherNow(params), getWeather3d(params)]) as any[]
      console.log(res1, res2);
      const now = res1.now;
      const daily = res2.daily
      if (now && daily) {
        setData({ current: now, daily })
      }
    } catch (error) {

    }
    Taro.hideLoading()
  }

  function chooseLocation() {
    Taro.chooseLocation({
      success: (res) => {
        let { latitude, longitude, address, name } = res
        setData({
          longitude: Number(longitude),
          latitude: Number(latitude),
          address: name || address
        })

      }
    })
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <View className={styles.wrapper} style={{ backgroundImage: `url(${backgroundImage})` }}>
      <View className={styles.container} style={{ paddingTop: paddingTop }}>
        <View className={styles.location} onClick={chooseLocation}>
          <Icon type={current.icon} />
          {address}
        </View>
        <View className={styles.now}>
          <View className={styles.current}>
            <View className={styles.temp}>
              <Text>{current.temp}</Text>
              <Text className={styles.du}>℃</Text>
            </View>
            <View className={styles.text}>
              <Icon type={current.icon} />
              <Text className={styles.du}>{current.text}</Text>
            </View>
            <View className={styles.humidity}>
              <Text className={styles.one}>湿度&nbsp;{current.humidity}%</Text>
              <View className={styles.line}></View>
              <Text>体感&nbsp;{current.feelsLike}℃</Text>
            </View>
          </View>
          <View className={styles.future}>
          </View>
        </View>
        {/* <View className="two-days">
          <View className="item">
            <View className="top">
              <Text className="date">今天</Text>
              <Text className="temp">{{ today.temp }}</Text>
            </View>
            <View className="bottom">
              <Text>{{ today.weather }}</Text>
              <icon type="{{ today.icon }}" className="logo"></icon>
            </View>
          </View>
          <View className="item">
            <View className="top">
              <Text className="date">明天</Text>
              <Text className="temp">{{ tomorrow.temp }}</Text>
            </View>
            <View className="bottom">
              <Text>{{ tomorrow.weather }}</Text>
              <icon type="{{ tomorrow.icon }}" className="logo"></icon>
            </View>
          </View>
        </View> */}
      </View>
    </View>

  );
};

export default Weather