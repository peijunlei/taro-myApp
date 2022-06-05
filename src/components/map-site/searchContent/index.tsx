/*
 * @Author: baby张
 * @Date: 2021-08-26 11:22:51
 * @LastEditTime: 2021-11-15 16:46:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xn-map/src/components/searchContent/index.tsx
 */
import React from "react";
import classnames from "classnames";
import Empty from "../empty";
import "./index.less";
import { View } from "@tarojs/components";
import { TipItem, TipList } from "../type";

interface SearchContentProps {
  className?: string;
  showSearchCont: Boolean;
  backClick: () => void;
  searchList: TipList;
  handleChooseSearch: (e: any) => void;
  viewRef: any;
}

function SearchContent({
  showSearchCont,
  backClick,
  className,
  searchList,
  handleChooseSearch,
  viewRef,
}: SearchContentProps) {
  return (
    <View
      ref={viewRef}
      style={{
        display: showSearchCont ? "block" : "none"
      }}
      className={classnames("search_content", className, {
        search_content_radius: showSearchCont
      })}
      onClick={e => {
        e.stopPropagation();
        backClick();
      }}
    >
      {searchList.length > 0 ? (
        searchList.map((item, i: number) => (
          <View
            key={i}
            onClick={e => {
              e.stopPropagation();
              console.log('inputtips点击', item);
              handleChooseSearch(item);
            }}
            className="search_content-box"
          >
            <View className="name">{item?.name}</View>
            <View className="district">
              {item?.district}-{item?.address}
            </View>
          </View>
        ))
      ) : (
        <Empty text="暂无数据" />
      )}
    </View>
  );
}

export default SearchContent;
