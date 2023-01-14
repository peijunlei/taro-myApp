import { View } from "@tarojs/components";
import { FC, useState } from "react";
import VirtualList from '@tarojs/components/virtual-list'
import React from "react";
import Taro from "@tarojs/taro";

interface VirtualListPageProps {

}
function buildData(offset = 0) {
  return Array(50).fill(0).map((_, i) => i + offset);
}
const Row = React.memo(({ id, index, style, data }) => {
  return (
    <View id={id} className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
      Row {index} : {data[index]}
    </View>
  );
})

const VirtualListPage: FC<VirtualListPageProps> = () => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(() => buildData(0))
  const itemSize = 100
  const height = Taro.getSystemInfoSync().screenHeight
  const listReachBottom = () => {
    Taro.showLoading()
    // 如果 loading 与视图相关，那它就应该放在 `this.state` 里
    // 我们这里使用的是一个同步的 API 调用 loading，所以不需要
    setLoading(true)
    setTimeout(() => {
      setData(data.concat(buildData(data.length)))
      setLoading(false)
      Taro.hideLoading()
    }, 1000)
  }
  return (
    <VirtualList
      renderBottom={<View>没有更多了</View>}
      height={height} /* 列表的高度 */
      width='100%' /* 列表的宽度 */
      itemData={data} /* 渲染列表的数据 */
      itemCount={data.length} /*  渲染列表的长度 */
      itemSize={itemSize} /* 列表单项的高度  */
      onScroll={({ scrollDirection, scrollOffset }) => {
        if (!loading &&
          // 只有往前滚动我们才触发
          scrollDirection === 'forward' &&
          // 5 = (列表高度 / 单项列表高度)
          // 100 = 滚动提前加载量，可根据样式情况调整
          scrollOffset > ((data.length - 14) * itemSize) && data.length <= 150
        ) {
          listReachBottom()
        }
      }}
    >
      {Row}
    </VirtualList>
  );
}

export default VirtualListPage;