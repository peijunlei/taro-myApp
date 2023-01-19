// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

  const {
    pageNum = 0, pageSize = 10, ...rest
  } = event;

  console.log(event);
  const db = cloud.database()
  const params = {};
  for (const key in rest) {
    const value = rest[key];
    if (value === null || value === undefined) return

    params[key] = value

  }
  console.log(params);
  //总条数
  const result = await db.collection('todos').where(params).count();

  //查询数据
  const res = await db.collection('todos')
    .where(params)
    .skip(pageNum * pageSize)
    .limit(pageSize)
    .orderBy('createTime', 'desc')
    .get()

  return {
    data: res.data,
    total: result.total,
  }
}