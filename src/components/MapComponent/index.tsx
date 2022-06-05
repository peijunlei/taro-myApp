import { FC, useEffect, CSSProperties, useRef, useState } from "react"
import { View, Text, Input } from "@tarojs/components";
import './index.less'
import { AllIcon, getQuery } from "@/utils";
import Search from "./search";
export interface LngAndLat {
  /**经度 */
  lng: number;
  /**维度 */
  lat: number;
}
interface MapComponentProps {
  lngAndLat?: LngAndLat;
  className?: string;
  style?: CSSProperties;
  fullScreen?: boolean;
  onRender?: (address?: any) => void;
  onChange?: (value: Array<number>) => void;
  onInputChange?: (value: any) => void;
}
const defaultLngLat: LngAndLat = { lng: 118.795331, lat: 32.061615 };
const MapComponent: FC<MapComponentProps> = ({
  lngAndLat,
  className,
  onRender,
  onChange,
  onInputChange,
  fullScreen = false,
  style = {
    width: '100%',
    height: '50vh'
  }
}) => {
  const mapRef = useRef<any>()
  const markerRef = useRef<any>();
  const geocoderRef = useRef<any>();

  //默认位置 
  // const [selfCenter, setSelfCenter] = useState([lngAndLat.lng, lngAndLat.lat]); // 自己中心坐标[120.154066, 30.290777],
  const [fScreen, setFullScreen] = useState(fullScreen)
  const _initMap = (lngAndLat: LngAndLat) => {
    const center = [lngAndLat.lng, lngAndLat.lat]
    // 初始化地图
    mapRef.current = new AMap.Map("map-container", {
      zoom: 16,
      center//中心点坐标
    });
    // 中心点坐标
    markerRef.current = new AMap.Marker({ position: center });
    mapRef.current.add(markerRef.current);
    AMap.plugin('AMap.Geocoder', function () {
      geocoderRef.current = new AMap.Geocoder({});
    })
    regeoCode(center)
    mapRef.current.on('click', function (e) {
      const lnglat = [e.lnglat.lng, e.lnglat.lat]
      onChange?.(lnglat)
      regeoCode(lnglat)
    })
  };
  const regeoCode = (lnglat) => {
    markerRef.current.setPosition(lnglat);
    mapRef.current.add(markerRef.current);
    geocoderRef.current.getAddress(lnglat, function (status, result) {
      console.log('逆向地理编码=>', result);
      if (status === 'complete' && result.regeocode) {
        onRender?.(result.regeocode)
      }
    });
  }
  useEffect(() => {
    lngAndLat && _initMap(lngAndLat);
    return () => {
      mapRef.current?.destroy();
    };
  }, [lngAndLat])
  return (
    <View className="map-component">
      {
        !lngAndLat && <View className="loading">定位中... </View>
      }
      <Search />
      <View id='map-container' style={fScreen ? { ...style, width: "100%", height: "100vh" } : style} className={className} />
      <View className="full-screen" onClick={() => setFullScreen(!fScreen)}>{fScreen ? "小屏" : "全屏"}</View>
    </View>
  );
};

export default MapComponent;

