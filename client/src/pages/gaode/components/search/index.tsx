import { Input, View, Image } from "@tarojs/components";
import { FC } from "react";
import styles from './index.module.less'
import searchIcon from '@/assets/common/search.svg'


interface SearchProps {
  onChange?: (val: string) => void;
  onConfirm?: (val: string) => void;
}

const Search: FC<SearchProps> = ({ onChange, onConfirm }) => {
  return (
    <View className={styles.search_wrap}>
      <View className={styles.search}>
        <Image src={searchIcon} className={styles.search_icon} />
        <Input
          placeholder="请输入"
          className={styles.input}
          onInput={(e) => onChange?.(e.detail.value)}
          onConfirm={(e) => {
            onConfirm?.(e.detail.value)}}
        />
      </View>
    </View>

  );
}

export default Search;