import React, { Component } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import { View } from '@tarojs/components';
import { pxTransform } from '@tarojs/taro';

class MapComponent extends Component<any, any> {
    map: any;
    constructor(props) {
        super(props);
    }
    // 2.dom渲染成功后进行map对象的创建
    componentDidMount() {
        AMapLoader.load({
            key: 'c87789fdd54e701c3314ea7474d70efc', //需要设置您申请的key
            version: "2.0",
            plugins: ['AMap.ToolBar', 'AMap.Driving'],
            AMapUI: {
                version: "1.1",
                plugins: [],

            },
            Loca: {
                version: "2.0.0"
            },
        }).then((AMap) => {
            this.map = new AMap.Map("mapcontainer", {
                viewMode: "3D",
                zoom: 5,
                center: [105.602725, 37.076636],
            });
        }).catch(e => {
            console.log(e);
        })
    }
    render() {
        // 1.创建地图容器
        return (
            <View id="mapcontainer" className="map" style={{ height: '50vh', width: "100%" }} />
        );
    }

}
export default MapComponent;


