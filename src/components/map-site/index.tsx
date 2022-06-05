

import React, { useEffect, useState, useRef, useCallback } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { AllIcon } from "./constant";
import API from "./api";
import Search from "./search";
import SearchContent from "./searchContent";
import AroundList from "./aroundList";

import "./index.less";
import { ArroundList, ReGeoResult, TipItem, TipList } from "./type";
interface PageHomeProps { }

const MapSite: React.FC<PageHomeProps> = props => {
  const viewRef = useRef<any>();
  const refInput = useRef<any>();
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>();
  const [addressInfo, setAddressInfo] = useState<ReGeoResult>();
  const [ifshow, setIfshow] = useState<boolean>(true); // 展示按钮
  const [inputval, setInputval] = useState<string>("");
  const [showSearchCont, setShowSearchCont] = useState<boolean>(false); // 展示搜索内容
  const [searchList, setSearchList] = useState<TipList>([]); // 地理搜索数据
  const [selfCenter, setSelfCenter] = useState<any>([]); // 自己中心坐标[120.154066, 30.290777],
  const [gdCenter, setGdCenter] = useState<any>([]); // 高德获取的当前位置
  const [aroundChoose, setAroundChoose] = useState<boolean>(false); //是否选中周边数据
  const [firstSearch, setFristSearch] = useState<boolean>(false); // 是否刚搜索过**
  const [aroundList, setAroundList] = useState<ArroundList>([]); // 周边列表
  const [selected, setSelected] = useState<any>(); // 最终选中结果
  const serverKey = "c87789fdd54e701c3314ea7474d70efc" // 项目里自己使用企业 mapkey


  const initMap = () => {
    AMap.plugin("AMap.Geolocation", async function () {
      const geolocation = await new AMap.Geolocation({
        noIpLocate: 3,
        enableHighAccuracy: true, // 是否使用高精度定位，默认：true
        timeout: 10000, // 设置定位超时时间，默认：无穷大
        zoomToAccuracy: true, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        showButton: true,
        GeoLocationFirst: false // 优先使用H5定位，默认移动端为true，PC端为false
      });
      let newmap = await new AMap.Map("position", {
        zoom: 15,
      });
      // 中心点坐标
      let marker = await new AMap.Marker({
        icon: AllIcon.markerIcon,
        anchor: "bottom-center",
      });
      newmap.addControl(geolocation);
      newmap.add(marker);
      geolocation.getCurrentPosition(async function (status: string, selected: any) {
        if (status === "complete" && selected && selected.position) {
          const { lng, lat } = selected.position;
          const locationArr = [lng, lat];
          console.log("定位数据", locationArr);
          newmap.setCenter(locationArr);
        }
      });
      // 当前位置
      setMarker(marker);
      setMap(newmap);

    });
  };

  // 移动地图事件
  const showInfoMapmoveend = useCallback(() => {
    const { lng, lat } = map.getCenter();
    marker?.setPosition([lng, lat]);
  }, [marker, map])

  // 地图停止移动
  const showInfoMoveendEnd = useCallback(() => {
    const { lng, lat } = map.getCenter();
    let location = `${lng},${lat}`;
    console.log(aroundChoose, "+++move+++");
    getAround(location);
    getReGeo(location)
    // getStaticmap(location)
    // eslint-disable-next-line
  }, [map]);

  // 点击地图事件
  const handleClick = useCallback((e) => {
    const { lng, lat } = e.lnglat;
    const center = [lng, lat]
    map?.setCenter(center);
  }, [map]);
  // 检测是否拖动
  const showGragStart = () => {
    refInput.current.blur();
    setShowSearchCont(false);
    setAroundChoose(false);
    setFristSearch(false);
    // 自定义上报
  };

  // 初始化map事件
  const initEvent = () => {
    map.on("click", handleClick);
    map.on("mapmove", showInfoMapmoveend);
    map.on("moveend", showInfoMoveendEnd);
    map.on("dragstart", showGragStart);
  };

  // 销毁监听
  const destoryEvent = () => {
    map?.off("click", handleClick);
    map?.off("mapmove", showInfoMapmoveend);
    map?.off("moveend", showInfoMoveendEnd);
    map?.off("dragstart", showGragStart);
  };


  const onFocus = () => {
    setShowSearchCont(true);
  };

  // 顶部输入框搜索
  const handleOnSubmit = (e: any) => {
  };

  // 获取地址数据
  const getIptList = (keywords: string) => {
    if (!keywords) return
    API._getInputtips({ keywords })
      .then((res: any) => {
        if (res && res.info === "OK") {
          setSearchList(res.tips);
        }
      })
  };

  // 选中无坐标地址 type true表示选择了周边/底部搜索触发
  const handleChooseSearch = (item: any, type?: boolean) => {
    console.log('选择搜索', item);
    setSelected(item)
  };

  /*逆地理编码 */
  const getReGeo = (location: string) => {
    if (!location) return;
    API._getReGeo({ location }).then((res: any) => {
      if (res && res.regeocode) {
        console.log('====================================');
        console.log('逆地理编码', res.regeocode.formatted_address);
        console.log('====================================');
        setAddressInfo(res.regeocode);
      }
    });
  }
  /**位置解析 */
  const getGeo = (address: string) => {
    if (!address) return;
    API._getGeo({ address }).then((res: any) => {
      if (res && res.regeocode) {
        console.log('位置解析', res);

      }
    });
  }
  /**静态地图 */
  const getStaticmap = (location: string) => {
    if (!location) return;
    API._getStaticmap({ location, zoom: 15 }).then((res: any) => {
      console.log(res);//没有返回值就是个图片
    });
  }
  /**获取周边数据 */
  const getAround = (location: string) => {
    console.log('获取周边数据', location);
    if (!location) return;
    API._getAround({ location })
      .then((res: any) => {
        if (res.info === "OK" && res.pois) {
          setAroundList(res.pois)
        }
      })
  };
  /**关键字搜索 */
  const getkeywordsSearchList = (keywords: string) => {
    console.log('关键字搜索', keywords, addressInfo);
    if (!keywords) return;
    //限制了地区  citycode 城市编码始终有数据
    API._getkeywordsSearch({ keywords, page_num: 1, page_size: 25, region: addressInfo?.addressComponent.citycode })
      .then((res: any) => {
        if (res.info === "OK" && res.pois && res.pois.length > 0) {
          const newArray = res.pois.map(v => {
            return {
              ...v,
              district: v.pname + v.cityname + v.adname
            }
          })
          setSearchList(newArray)
        } else {
          getIptList(keywords)
        }
      })
  };


  /**跳转坐标 */
  const chooseCenter = useCallback((location: string) => {
    const center = location.split(",")
    map?.setCenter(center);
  }, [map])

  /**保存 */
  const handleSave = () => {
    console.log('保存数据', selected);

  };
  useEffect(() => {
    console.log('-----------------init-------------------');
    initMap();
    return () => {
      map && map?.destroy();
    };
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    console.log("initevent");
    if (map?.on) {
      initEvent();
    }
    return () => destoryEvent();
    // eslint-disable-next-line
  }, [map]);
  return (
    <View className="page-home">
      <Search
        onFocus={onFocus}
        refInput={refInput}
        inputval={inputval}
        showSearchCont={showSearchCont}
        onInput={(e: any) => {
          setInputval(e.detail.value);
          getkeywordsSearchList(e.detail.value);
        }}
        handleOnSubmit={handleOnSubmit}
        onBack={() => {
          setShowSearchCont(false);
          refInput.current.blur();
        }}
        handleEmpty={() => {
          setInputval("");
          setSearchList([]);
        }}
      >
        <SearchContent
          viewRef={viewRef}
          showSearchCont={showSearchCont}
          backClick={() => {
            console.log("click black");
            setShowSearchCont(false);
            refInput.current.blur();
          }}
          searchList={searchList}
          handleChooseSearch={handleChooseSearch}
        />
      </Search>
      <View id="position" style={{ height: showSearchCont ? "100vh" : "60vh" }} />
      {!showSearchCont && (
        <AroundList
          addressInfo={addressInfo}
          selectedId={selected?.id}
          aroundList={aroundList}
          handleChooseSearch={handleChooseSearch}
          handleSave={handleSave}
        />
      )}
      <View className="bottom_button">
        <View className="save" onClick={handleSave}> 确定 </View>
      </View>
    </View>
  );
};

export default MapSite;
