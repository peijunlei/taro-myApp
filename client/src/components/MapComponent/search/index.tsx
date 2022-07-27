import { Input, View } from "@tarojs/components";
import { useState } from "react";
import { FC } from "react";
import './index.less'

interface SearchProps {

}

const Search: FC<SearchProps> = () => {
  const [showCancel, setShowCancel] = useState(false)
  const [keyWords, setKeyWords] = useState('')

  const handleChange = (e) => {
    setKeyWords(e.detail.value)
  }
  return (
    <View className="search">
      <Input
        placeholder="请输入搜索"
        className="input"
        onInput={handleChange}
        onFocus={() => setShowCancel(true)}
        onBlur={() => setShowCancel(false)}
      />
      {
        showCancel && <View className="cancel">取消</View>
      }
      {
        keyWords &&
        <View>
          {searchList.length > 0 ? (
            searchList.map((el: SearchList, ind: number) => (
              <div
                onClick={e => {
                  e.stopPropagation();
                  handleChooseSearch(el, false);
                }}
                className="search_content-box"
                key={ind}
              >
                <div className="name">{el?.name}</div>
                <div className="district">
                  {el?.district}-{el?.address}
                </div>
              </div>
            ))
          ) : (
            <Empty text="暂无数据" />
          )}
        </View>

      }
    </View>
  );
}

export default Search;