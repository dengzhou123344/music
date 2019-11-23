// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
var rp = require('request-promise');
const URL = 'http://musicapi.xiecheng.live/personalized'
// 云函数入口函数
const MAX_LIMIT = 100
exports.main = async(event, context) => {
  // const list = await db.collection('playlist').get()
  const countResult = await db.collection('playlist').count()
  const total = countResult.total
  const batchTimes = Math.ceil(total / MAX_LIMIT)
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    let promise = db.collection('playlist').skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data: []
  }
  if (tasks.length > 0) {
    list=(await Promise.all(tasks)).reduce((acc, cur) => {
      return {
        data: acc.data.concat(cur.data)
      }
    })
  }

  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })

  console.log(list)
  const newdate = []
  for (let j = 0, len1 = playlist.length; j < len1; j++) {
    let flag = true
    for (let m = 0, len2 = list.data.length; m < len2; m++) {
      if (playlist[j].id === list.data[m].id) {
        flag = false
        break
      }
    }
    if (flag) {
      newdate.push(playlist[j])
    }
  }
  for (let i = 0, len = newdate.length; i < len; i++) {
    await db.collection('playlist').add({
      data: {
        ...newdate[i],
        createTime: db.serverDate()
      }
    }).then((res) => {
      console.log("成功")
    }).catch((err) => {
      console.error('失败')
    })
  }
  return newdate.length
}