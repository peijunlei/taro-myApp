import { Component, useEffect } from 'react'
import { Provider } from 'react-redux'

import { getCurrentPages } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { store } from './store'
import './app.less'
import { fetchTodoList } from './pages/todo/todoSlice'
import useGlobalState from './hooks/useGlobalState'
declare const wx: any;

const App = (props) => {
  const [navBarHeight, setNavBarHeight] = useGlobalState("navBarHeight", 0)
  useEffect(() => {
  }, [])
  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
}

export default App;
