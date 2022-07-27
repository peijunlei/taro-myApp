// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: cloud.getWXContext().OPENID,
      page: event.page,
      lang: 'zh_CN',
      data: event.data,
      templateId: event.templateId,
      miniprogramState: "devoloper"
    })
    return result
  } catch (err) {
    return err
  }
}