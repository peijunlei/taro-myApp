// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  console.log('event', event);
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: event.openId,
      page: event.page,
      lang: 'zh_CN',
      data: event.data,
      templateId: event.templateId
    })
    return result
  } catch (err) {
    return err
  }
}