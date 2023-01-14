import useSetState from '@/hooks/useSetState'
import { Input, View, Image, Button, Map, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useMemo, useState } from 'react'
import debounce from 'lodash/debounce';
import Search from './components/search'
import markIcon from './img/mark.png'
import styles from './index.module.less'
import useData from './store'
import { factor } from '@/components/poster/free-poster/utils';
import { getAround, getPoisList, getRegeo } from './api';
import PoisList from './components/pois-list';
import isArray from 'lodash/isArray';
interface IState {
  citycode: string;
  cityName: string;
  adcode: string;
}
const MapPage = () => {
  const [state, setState] = useSetState<IState>({
    citycode: "",
    cityName: "",
    adcode: ""
  })

  const { keywords, setKeywords, setPoisList, updateCenter, lng, lat } = useData()
  const formatCode = useMemo(() => {
    if (!state.adcode) return []
    const arr = [state.adcode.substring(0, 2) + "0000", state.adcode.substring(0, 4) + "00", state.adcode]
    return arr
  }, [state.adcode])
  const getLocation = () => {
    Taro.getLocation({
      type: "gcj02",
      async success(result) {
        const res = await getRegeo({ location: `${result.longitude},${result.latitude}` }) as any
        updateCenter(result.longitude, result.latitude)
        const { citycode, city, adcode, province } = res.regeocode.addressComponent
        setState({ citycode, cityName: isArray(city) ? province : city, adcode }) // 设置经纬度信息
      },
      fail(err) {
        Taro.showToast({ title: err.errMsg })
      },
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

  const handleSearch = async (val: string) => {
    if (!val.trim()) return
    setKeywords(val)
    const res = await getPoisList({ keywords: val, region: state.cityName })
    console.log(res);
    setPoisList((res as any).pois)


  }
  useEffect(() => {
    init()
    console.log(keywords);
  }, [])

  return (
    <View className={styles.container}>
      <View className={styles.header}>
        <Search onChange={debounce((e) => handleSearch(e), 1000)} onConfirm={handleSearch} />
      </View>

      <Map
        className={styles.map}
        latitude={lat}
        longitude={lng}
        showLocation
        onRegionChange={async (e) => {
          if (e.causedBy === 'drag' && e.type === 'end') {
            const location = `${e.detail.centerLocation.longitude},${e.detail.centerLocation.latitude}`
            const res = await getAround({ location }) as any
            setPoisList(res.pois)
          }
        }}
      >
        <View>
          <Image src={markIcon} className={styles.mark}></Image>
        </View>
      </Map>
      <PoisList />
    </View >
  )
}

export default MapPage;

