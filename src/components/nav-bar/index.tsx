import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useMemo } from 'react';
import { FC } from 'react';
import './index.less';


interface INavBarProps {
  /**是否展示返回 默认true */
  showBack?: boolean;
  /**是否展示搜索框 */
  showSearch?: boolean;
  /**是否展示home图标 默认true*/
  showHome?: boolean;
  /**扩展类名 */
  extraClass?: string;
  /**背景色 */
  background?: string;
  /**导航标题 */
  title?: string;
  /**title 颜色 */
  color?: string;
  /**icon主题色 */
  iconTheme?: "white" | "black";
  /**搜索文本 */
  searchText?: string;
  /**点击home */
  onHome?: () => void;
  /**点击返回 */
  onBack?: () => void;
  /**点击搜索 */
  onSearch?: () => void;
}
const NavBar: FC<INavBarProps> = (
  {
    title,
    background = "#fff",
    showBack = true,
    showHome = true,
    showSearch,
    searchText,
    iconTheme,
    extraClass = "",
    onSearch,
    onHome,
    onBack,
    color = "#333"
  }
) => {

  const navBarInfo = useMemo(() => {
    const systemInfo = Taro.getSystemInfoSync()
    const capsuleInfo = Taro.getMenuButtonBoundingClientRect();
    const { statusBarHeight = 0, windowWidth } = systemInfo
    /**胶囊到状态栏的间隙 */
    const gap = capsuleInfo.top - statusBarHeight
    let right = windowWidth - capsuleInfo.right; //胶囊按钮右侧到屏幕右侧的边距
    const height = statusBarHeight + 2 * gap + capsuleInfo.height;
    return {
      gap,
      height,
      right,
      statusBarHeight,
      capsuleInfo
    }
  }, [])
  console.log('导航栏信息=>', navBarInfo);

  const handleSearchClic = () => {
    onSearch && onSearch()
  }
  const handleHomeClick = () => {
    onHome && onHome()
  }
  const handleBackClick = () => {
    if (onBack && typeof onBack === 'function') {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }
  const navBarCenter = useMemo(() => {

    if (title && !showSearch) return <Text>{title}</Text>;
    if (showSearch) return (
      <View
        className='nav-bar-search'
        onClick={handleSearchClic}
      >
        <View className='nav-bar-search__icon' />
        <View className='nav-bar-search__input'>{searchText}</View>
      </View>
    )
    return null;
  }, [title, showSearch])
  return (
    <View
      className={`nav-bar} ${extraClass}`}
      style={{ height: navBarInfo.height }}
    >
      <View
        className={`nav-bar__inner`}
        style={{
          color,
          background,
          height: navBarInfo.height,
          paddingTop: navBarInfo.statusBarHeight + navBarInfo.gap,
          paddingBottom: navBarInfo.gap,
          paddingRight: navBarInfo.capsuleInfo.width + navBarInfo.right
          
        }} >
        <View
          className='nav-bar__left'
          style={{
            width: navBarInfo.capsuleInfo.width,
            height: navBarInfo.capsuleInfo.height,
            marginLeft: navBarInfo.right
          }} >
          {showBack && !showHome && (
            <View
              onClick={handleBackClick}
              className={`nav-bar__button nav-bar__btn_goback ${iconTheme}`}
            />
          )}
          {!showBack && showHome && (
            <View
              onClick={handleHomeClick}
              className={`nav-bar__button nav-bar__btn_gohome ${iconTheme}`}
            />
          )}
          {showBack && showBack && (
            <View className={`nav-bar__buttons`} style={{ borderRadius: navBarInfo.capsuleInfo.height / 2 }}>
              <View
                onClick={handleBackClick}
                className={`nav-bar__button nav-bar__btn_goback ${iconTheme}`}
              />
              <View
                onClick={handleHomeClick}
                className={`nav-bar__button nav-bar__btn_gohome ${iconTheme}}`}
              />
            </View>
          )}
        </View>
        <View className='nav-bar__center'>
          {navBarCenter}
        </View>
      </View>
    </View>
  );
}


export default NavBar;