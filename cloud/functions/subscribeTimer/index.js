// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  cloud.callFunction({
    name: "subscribe",
    data: {
      openId: 'oEQXQ5aPUQOtUYb3cz-mxWWcdwhc',
      page: '/pages/todo/index',
      templateId: '7yK6xGoEWLCx8TbG_OEyH9iRe53HjOogeMllq7a11tI',
      data: {
        "time1": {
          "value": '2022-12-12'
        },
        "thing2": {
          "value": "学习云开发"
        },
        "time3": {
          "value": '2022-12-13'
        },
      }
    }
  }).then(res => {
    return res
  })
}