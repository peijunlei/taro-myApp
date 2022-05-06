import Taro from "@tarojs/taro"

/**
* 微信授权
*/
const authList = {
  userInfo: {
    apiName: ['getUserInfo'],
    authTitle: '需要使用你的用户信息',
    authContent: '需要使用你的用户信息，请确认授权'
  },
  userLocation: {
    apiName: ['getLocation', 'chooseLocation'],
    authTitle: '请求授权当前位置',
    authContent: '需要获取您的地理位置，请确认授权'
  },
  address: {
    apiName: ['chooseAddress'],
    authTitle: '需要使用你的通讯地址',
    authContent: '需要使用你的通讯地址，请确认授权'
  },
  invoiceTitle: {
    apiName: ['chooseInvoiceTitle'],
    authTitle: '需要使用你的发票抬头',
    authContent: '需要使用你的发票抬头，请确认授权'
  },
  invoice: {
    apiName: ['chooseInvoice'],
    authTitle: '需要获取你的发票',
    authContent: '需要获取你的发票，请确认授权'
  },
  werun: {
    apiName: ['getWeRunData'],
    authTitle: '需要获取你的微信运动数据',
    authContent: '需要获取你的微信运动数据，请确认授权'
  },
  writePhotosAlbum: {
    apiName: ['saveImageToPhotosAlbum', 'saveVideoToPhotosAlbum'],
    authTitle: '请求授权相册',
    authContent: '需要使用你的相册，请确认授权'
  },
}
/**
* @description: 返回值中只会出现小程序已经向用户请求过的权限
*/
export const getTaroSetting = (key: string) => {
  if (typeof key !== 'string' || !authList[key]) return Promise.reject('请检查授权的key')
  return new Promise(resolve => {
    Taro.getSetting({
      success: async res => {
        const result = res.authSetting
        console.log('授权信息',result);
        
        // 用户拒绝过
        if (result[`scope.${key}`] === false) {
          // 引导去授权页
          _showModal(key).then(() => {
            //@ts-ignore
            resolve()
          })
        } else {
          //  已授权，或者还未询问过授权
          // @ts-ignore
          resolve();
        }
      },
      fail: () => {
        Taro.showToast({
          title: '拒绝授权',
          icon: 'none',
        })
      }
    })
  })
}
/**
* @description: 引导去授权设置页面
* @param {String} 权限名称
* @return {Boolean} 是有拥有权限
*/
const _showModal = key => {
  console.log(authList[key].authContent)
  return new Promise(function (resolve) {
    Taro.showModal({
      title: authList[key].authTitle,
      content: authList[key].authContent,
      success: function (res) {
        if (res.confirm) {
          Taro.openSetting({
            success: async dataAu => {
              // 异步，进入授权页面授权后返回判断
              if (dataAu.authSetting[`scope.${key}`] === true) {
                Taro.showToast({
                  title: '授权成功',
                  icon: 'none'
                })
                // @ts-ignore
                resolve()
              } else {
                Taro.showToast({
                  title: '授权失败',
                  icon: 'none',
                })
              }
            }
          })
          // 用户点击取消
        } else if (res.cancel) {
          Taro.showToast({
            title: '取消授权',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  })
}
