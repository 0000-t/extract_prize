//获取应用实例
const app = getApp().globalData

let endCountTime = null; //停止计时器
let watchTime = 0 //观看视屏的时间
let videoPath = 1 //请求的视频页
let videoCount = 0 //页面视频总数
let full = false

Page({
  /**
   * 页面的初始数据
   */
  data: {
    changeIndex: 0,
  },
  
  //划动切换
  slide(e) {
    let current_num = e.detail.current;
    this.setData({
      changeIndex: current_num
    })
    if (!full && current_num >= this.data.video.length - 2) {
      this.getVideoByPathAndRows(++videoPath, 5)
      console.log('刷新了')
    }
  },

  /**
   * 播放视频是触发该函数 
   */
  // playVideo() {
  //   endCountTime && clearInterval(endCountTime)
  //   this.countTime()
  // },

  /**
   * 视频停止播放时触发
   */
  // endVideo() {
  //   endCountTime && clearInterval(endCountTime)
  //   console.log('调用了')
  // },

  /**
   * 计算观看视频时长
   */
  // countTime() {
  //   endCountTime = setInterval(() => {
  //     if (++watchTime % 15 == 0) { //观看视频累计15秒
  //       watchTime = 0

  //       console.log('15秒了')
  //       this.addAwardCount() //增加抽奖次数
  //     }
  //     console.log(watchTime)
  //   }, 1000);
  // },

    /**
   * 将视频数据写入缓存
   */
  setStorageOfVideoData(data) {
    wx.setStorage({
      data: data,
      key: 'videoData',
    })
  },


  /**
   * 在缓存中获取视频数据
   */
  getVideoDataInStorage() {
    const videoData = wx.getStorageSync('videoData');
    if (videoData) {
      this.setData({
        videoData //同步获取缓存中的数据
      })
    }
  },

  /**
   * 发送增加抽奖次数请求
   */
  addAwardCount() {
    wx.request({
      url: 'http://47.94.135.125:6081/luckly/wx/share?openId=' + app.openid,
      success: res => {
        console.log('添加次数成功', res, app.openid)
      },
      fail: res => {
        console.log('添加次数接口报错', res)
      }
    })
  },

  /**
   * @param {Number} vpath 页码
   * @param {Number} vrows 每页的数量
   * @return {Promise} 返回一个promise对象
   */
  getVideoByPathAndRows(vPath, vRows) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://47.94.135.125:6081/luckly/advertise/pageVedio?page=${vPath}&rows=${vRows}`,
        success: res => {
          //1..将数据添加到videoData的尾部
          const items = res.data.items;
          this.data.videoData.push(...items)
          //3.渲染到页面
          this.setData({
            videoData: this.data.videoData
          })
          //判断数据库中是否还有数据
          full = videoPath == res.data.totalPage && true, 
          
          //4.成功回调
          resolve(items)
        },
        fail(err) {
          //失败回调
          reject(err)
        }
      })
    })
  },

  init(callback) {
    //1.向服务器请求数据
    //2.将数据写入缓存
    videoPath = videoCount = 0;
    this.data.videoData = []
    this.getVideoByPathAndRows(++videoPath, 5).then(videoData => {
      //写入缓存
      this.setStorageOfVideoData(videoData)  
      //关闭刷新
      callback && callback()
    }).catch(err => {
      wx.showToast({
        title: '服务器维护中',
        icon: 'none'
      })
      //关闭刷新
      callback && callback()
    })
  },

  onLoad: function (options) {
    this.getSystemInfo()
    //1.在缓存中获取数据
    this.getVideoDataInStorage()

    this.init()
  },

  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        // 获取屏幕高度
        // this.globalData.screenHeight = res.screenHeight
        // // 获取状态栏高度
        // this.globalData.statusBarHeight = res.statusBarHeight
        // 通过操作系统 确定自定义导航栏高度
        let navBarHeight;  
        if (res.system.substring(0, 3) == "iOS") {
          navBarHeight = 42
        } else {
          navBarHeight = 44
        }
        this.setData({
          screenHeight: res.screenHeight,
          statusBarHeight: res.statusBarHeight,
          navBarHeight
        })
        // console.log(res)
      }
    })
  },

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    this.init(() => wx.stopPullDownRefresh())
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //1.判断数据库是否还有数据
    if (this.data.full) return

    //2.向服务器请求数据并添加到页面中
    this.getVideoByPathAndRows(++videoPath, 5)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.endVideo()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.endVideo()
  },
})