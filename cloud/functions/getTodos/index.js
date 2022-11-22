// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
 
  const DB = cloud.database()
  return DB.collection('todos').doc('1caddbb26375103500a0073c2084efe0').remove()
  
}