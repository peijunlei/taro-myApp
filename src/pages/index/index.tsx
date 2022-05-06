import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Button, Text } from '@tarojs/components'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'
import Taro from '@tarojs/taro'
import { getTaroSetting } from '../../utils'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {
  a?: number
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps


const mapStateToProps = ({ counter }) => ({
  counter
})
const mapDispatchToProps = (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
})

class Index extends Component<IProps, PageState> {
  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() { }

  componentDidMount() {

    this.openMap()

    console.log(this.state?.a);

  }

  componentDidHide() { }
  openMap = () => {
    getTaroSetting('userLocation').then(() => {
      // 已经授权或还未授权，下面的代码也可以根据需求提取到公共文件中
      Taro.getLocation({
        type: 'wgs84',
        success: res => {
          console.log(res);
        },
        fail: err => {
          console.log(err);
          Taro.showToast({
            title: '频繁调用会增加电量损耗',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }).catch(err => {
      console.log(err);
    })
  }
  openMap2 = () => {
    getTaroSetting('userInfo').then(() => {
      // 已经授权或还未授权，下面的代码也可以根据需求提取到公共文件中
     Taro.getUserInfo({
       success:(res)=>{
        console.log(res);
        
       },
       fail(res) {
         console.log(res);
         
       },
     })
    }).catch(err => {
      console.log(err);
    })
  }
  render() {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.dec}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <Button className='dec_btn' onClick={() => {
          this.openMap()
        }}>获取位置</Button>
        <Button className='dec_btn' onClick={this.openMap2}>授权获取用户信息</Button>

        <View><Text>{this.props.counter.num}</Text></View>
        <View><Text>Hello, World</Text></View>
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)

