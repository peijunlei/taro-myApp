import { ScrollView, View, Image } from "@tarojs/components";
import { FC } from "react";
import useData from "../../store";

import styles from './index.module.less'

import selectedIcon from '@/assets/common/selected.svg'
interface PoisListProps {
}
const Item = ({ item }) => {
  const updateCenter = useData(state => state.updateCenter)
  const setAddressId = useData(state => state.setAddressId)
  const selectAddressId = useData(state => state.selectAddressId)
  return (
    <View className={styles.poisItem} onClick={() => {
      const { location } = item
      const lng = location?.split(',')[0];
      const lat = location?.split(',')[1];
      updateCenter(lng, lat)
      setAddressId(item.id)
    }}>
      <View className={styles.left}>
        <View className={styles.name}>{item.name}</View>
        <View className={styles.address}>{`${item.pname}${item.cityname}${item.adname}${item.address}`}</View>
      </View>
      <View className={styles.right}>
        {selectAddressId === item.id && <Image src={selectedIcon} className={styles.selected} />}

      </View>
    </View>
  )
}
const PoisList: FC<PoisListProps> = () => {
  const pois = useData(state => state.pois)

  return (
    <ScrollView scrollY className={styles.scrollView}>

      <View>
        {
          pois?.map(item => <Item key={item.id} item={item} />)
        }
      </View>

    </ScrollView>
  );
}

export default PoisList;