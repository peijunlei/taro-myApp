/*
 * @Author: baby张
 * @Date: 2021-11-15 16:11:33
 * @LastEditTime: 2021-11-15 16:46:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 */
import React from "react";
import Empty from "../empty";
import { AllIcon } from "../constant";
import { View, Image } from "@tarojs/components";
import { AroundItem, ArroundList, ReGeoResult } from "../type";
import "./index.less";

interface BottomSearchProps {
  aroundList: ArroundList;
  handleChooseSearch: (el: any, type: boolean) => void;
  handleSave: () => void;
  selectedId: string;
  addressInfo?: ReGeoResult
}
function AroundList({
  aroundList,
  handleChooseSearch,
  handleSave,
  selectedId,
  addressInfo
}: BottomSearchProps) {
  return (
    <View className="aroundList">
      <View className="aroundList-content" id="bottomSearch">
        <View className="aroundList-content-box"  >
          <View className="left_name">
            <View className="name"> 当前位置:</View>
            <View className="address">{addressInfo?.formatted_address}</View>
          </View>
          {
            addressInfo &&
            <Image
              className="chooseicon"
              src={AllIcon.chooseIcon}
            />
          }
        </View>
        {aroundList.length > 0 ? (
          aroundList.map((item: AroundItem) => (
            <View
              key={item.id}
              className="aroundList-content-box"
              onClick={() => handleChooseSearch(item, true)}
            >
              <View className="left_name">
                <View className="name">  {item.name}  </View>
                <View className="address">{item.address}</View>
              </View>
              {selectedId === item.id && (
                <Image
                  className="chooseicon"
                  src={AllIcon.chooseIcon}
                />
              )}
            </View>
          ))
        ) : (
          <Empty text="暂无数据" />
        )}
      </View>

    </View>
  );
}

export default AroundList;
