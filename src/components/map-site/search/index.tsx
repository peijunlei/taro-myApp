/*
 * @Author: baby张
 * @Date: 2021-08-25 17:28:00
 * @LastEditTime: 2021-11-15 16:45:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /xn-map/src/components/Search/index.tsx
 */
import { View, Image, Form, Input, CommonEventFunction, InputProps } from "@tarojs/components";
import React, { FocusEvent, ReactNode, useEffect, useState } from "react";
import { AllIcon } from "../constant";
import { getQuery } from "../utils";
import "./index.less";

interface SearchProps {
  inputval?: string;
  onInput: CommonEventFunction<InputProps.inputEventDetail>;
  refInput: any;
  showSearchCont: boolean;
  onFocus: CommonEventFunction<InputProps.inputForceEventDetail>
  handleOnSubmit: (event: any) => void;
  onBack: () => void;
  children: ReactNode;
  handleEmpty: () => void;
}
function Search({
  inputval,
  onInput,
  refInput,
  showSearchCont,
  onFocus,
  handleOnSubmit,
  onBack,
  handleEmpty,
  children
}: SearchProps) {
  const [descVisible, setDescVisible] = useState(true);


  return (
    <View className={"search" + (showSearchCont && inputval ? " noradius" : "")}>
      <View className="search-left">
        <Form
          className="inputform"
          onSubmit={handleOnSubmit}
        >
          <View className="ipt-wrapper">
            <Image
              className="search-icon"
              src={AllIcon.searchIcon}
            />
            <Input
              className="search-input"
              ref={refInput}
              onFocus={onFocus}
              value={inputval}
              onInput={onInput}
              placeholder="请搜索地址名称"
            />
            <Image
              onClick={handleEmpty}
              className="search-close"
              src={AllIcon.closeIcon}
            />
          </View>
        </Form>

      </View>
      {showSearchCont && (
        <View className="search-right" onClick={onBack}> 取消  </View>
      )}
      {inputval && children}
    </View>
  );
}

export default Search;
