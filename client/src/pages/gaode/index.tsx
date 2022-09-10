import useSetState from '@/hooks/useSetState'
import { Input, View, Image, Button, Map, CoverView, CoverImage, MapProps } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import debounce from 'lodash/debounce';
import Search from './components/search'
import markIcon from './img/mark.png'
import styles from './index.module.less'
import useData from './store'
import { factor } from '@/components/poster/free-poster/utils';
import { getAround, getPoisList, getRegeo } from './api';
import PoisList from './components/pois-list';
interface IState {
  citycode: string
}
const MapPage = () => {
  const [state, setState] = useSetState<IState>({
    citycode: ""
  })

  const { keywords, setKeywords, setPoisList, updateCenter,lng,lat } = useData()

  const getLocation = () => {
    Taro.getLocation({
      type: "gcj02",
      async success(result) {
        const res = await getRegeo({ location: `${result.longitude},${result.latitude}` }) as any
        updateCenter(result.longitude, result.latitude)
        setState({ citycode: res.regeocode.addressComponent.citycode }) // 设置经纬度信息
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
    const res = await getPoisList({ keywords: val, region: state.citycode })
    console.log(res);
    setPoisList((res as any).pois)


  }
  useEffect(() => {
    init()
    console.log(keywords);

  }, [])
  return (
    <View className={styles.container}>
      <Search onChange={debounce((e) => handleSearch(e), 1000)} />
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
    </View>
  )
}

export default MapPage;

