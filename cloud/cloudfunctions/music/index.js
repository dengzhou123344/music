// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require("tcb-router")
const rp = require('request-promise')
const base_url = 'http://musicapi.xiecheng.live'
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async(event, context) => {
  const app = new TcbRouter({
    event
  })
  app.router("playlist", async(ctx, next) => {
   ctx.body=await db.collection('playlist').skip(event.start).limit(event.count).orderBy('createTime', 'desc').get().then((res) => {
      return res
    })
  })
  app.router('musiclist',async(ctx,next)=>{
    ctx.body = rp(base_url + '/playlist/detail?id=' + parseInt(event.playlistId)).then((res)=>{
      return JSON.parse(res)
    })
  })
  return app.serve()
}