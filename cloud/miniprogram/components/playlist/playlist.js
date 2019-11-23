// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist:{
      type:Object
    }
  },
  observers:{
    ['playlist.playCount'](count) {
      this.setData({
        _count: this._tranNumber(count, 2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    gotomusicList(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    },
    _tranNumber(num,point){
      let numstr =num.toString().split('.')[0]
      if(numstr.length<6){
        return numstr
      }else if(numstr.length>=6&&numstr.length<=8){
        let decimal =numstr.substring(numstr.length-4,numstr.length-4+point)
        return parseFloat (parseInt(num / 10000)+"."+decimal)+"万"
      }else if(numstr.length>8){
        let decima = numstr.substring(numstr.length - 8, numstr.length - 8+point)
        return parseFloat(parseInt(num / 100000000) + "." + decima)+'亿' 
      }
    }
  }
})
