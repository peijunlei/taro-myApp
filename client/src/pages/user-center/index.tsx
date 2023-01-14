import useSetState from "@/hooks/useSetState";
import { Button, View, Text, Image, Input, Canvas } from "@tarojs/components";
import Taro, { useDidShow, usePullDownRefresh } from "@tarojs/taro";
import { useEffect } from "react";
import styles from './index.module.scss';
import { AirQuality } from './constants'

import bgimg from '@/assets/common/weather/cloud.jpg'
import { getRegeo } from "../../packageA/demo/gaode/api";
import { getWeather3d, getWeatherAir, getWeatherNow } from "./api";
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
      icon: '100',
      windDir: 'N/A',
      windScale: '1'
    },
    tomorrow: {
      temp: 'N/A',
      textDay: '暂无',
      iconDay: '100'
    },
    after_tomorrow: {
      temp: 'N/A',
      textDay: '暂无',
      iconDay: '100'
    },
    air: {
      category: '优',
      aqi: '0',
      level: '1'
    },
    // hourlyData
    hourlyData: [],
    city: '北京',
    weeklyData: [],
    width: 375,
    scale: 1,
    address: '定位中',
    latitude: 0,
    longitude: 0
  })
  const { paddingTop, address, current, tomorrow, after_tomorrow, latitude, longitude, air } = data

  usePullDownRefresh(async () => {

    await refresh(longitude, latitude)
    Taro.stopPullDownRefresh()

  })

  function init() {
    Taro.getSystemInfo({
      success: (res) => {
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
      success: async (res) => {
        let { longitude, latitude } = res
        setData({
          latitude,
          longitude
        })
        refresh(longitude, latitude)
      }
    })
  }


  function refresh(longitude, latitude) {
    return new Promise(async (resolve) => {
      Taro.showLoading({ title: '加载中...', mask: true })
      await getAddress(longitude, latitude);
      await getWeatherData(longitude, latitude)
      await getWeatherAirData(longitude, latitude)
      Taro.hideLoading()
      resolve(true)
    })
  }
  /**
   * 逆经纬度获取地址
   * @param longitude 
   * @param latitude 
   */
  async function getAddress(longitude, latitude) {
    const res = await getRegeo({ location: `${longitude},${latitude}` }) as any
    setData({ address: res.regeocode?.formatted_address || '南京' })
  }

  /**
   * 获取天气信息
   * @param longitude 
   * @param latitude 
   */
  async function getWeatherData(longitude, latitude) {
    const location = `${longitude},${latitude}`
    const params = { location }
    const [res1, res2] = await Promise.all([getWeatherNow(params), getWeather3d(params)]) as any[]
    const now = res1.now;
    const daily = res2.daily as any[]
    if (now && daily && daily.length > 0) {
      setData({
        current: now,
        tomorrow: {
          temp: `${daily[1].tempMin}/${daily[1].tempMax}`,
          iconDay: daily[1].iconDay,
          textDay: daily[1].textDay
        },
        after_tomorrow: {
          temp: `${daily[2].tempMin}/${daily[2].tempMax}`,
          iconDay: daily[2].iconDay,
          textDay: daily[2].textDay
        }
      })
    }
  }
  async function getWeatherAirData(longitude, latitude) {
    const location = `${longitude},${latitude}`
    const params = { location }
    const res = await getWeatherAir(params) as any
    let now = res.now
    if (now) {
      setData({
        air: {
          category: now.category,
          aqi: now.aqi,
          level: now.level
        }
      })
    }
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
        refresh(longitude, latitude)
      }
    })
  }
  useDidShow(() => {

  })
  useEffect(() => {
    init()
  }, [])

  return (
    <View className={styles.wrapper} >
      <View className={styles.container} style={{ paddingTop: paddingTop }}>
        <View className={styles.location} onClick={chooseLocation}>
          {address}
        </View>
        <View className={styles.now}>
          {/* 空气质量 */}
          <View className={styles.air}>
            <View className={styles.level} style={{ backgroundColor: AirQuality[air.level] }}></View>
            <View>{`${air.category} ${air.aqi}`}</View>
          </View>
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
              <Text>{current.windDir}&nbsp;{current.windScale}级</Text>
            </View>
            <View >
              未来有诗和远方
            </View>
          </View>
          <View className={styles.future}>
            <View className={styles.tomorrow}>
              <View className={styles.left}>
                <View>明天</View>
                <View>{tomorrow.textDay}</View>
              </View>
              <View className={styles.right}>
                <View>{tomorrow.temp}℃</View>
                <View>
                  <Icon type={tomorrow.iconDay}></Icon>
                </View>
              </View>
            </View>
            <View className={styles.line}></View>
            <View className={styles.after_tomorrow}>
              <View className={styles.left}>
                <View>后天</View>
                <View>{after_tomorrow.textDay}</View>
              </View>
              <View className={styles.right}>
                <View>{after_tomorrow.temp}℃</View>
                <View>
                  <Icon type={after_tomorrow.iconDay}></Icon>
                </View>
              </View>
            </View>
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