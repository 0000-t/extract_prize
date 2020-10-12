// miniprogram/pages/award/award.js
const User = require("../../util/UserUtils.js");
const awardUtil = require('../../util/awardUtil')
let openid = getApp().globalData.openid;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabActive: 0,
    showDialog: false,
    prohibit: false,  //是否开启抽奖
  },

  /**
   * 点击 ‘go’，开始抽奖
   * @param {object} e 
   */
  click(e) {
    if (this.data.award_num > 0) {
      const idx = +e.detail.idx;
      console.log(e.detail)
      this.setData({
        myAward: e.detail.s_awards,
        award_num: --this.data.award_num,
        [`awards[${idx}].count`]: --this.data.awards[idx].count,
        showDialog: true
      })
    } else {
      wx.showModal({
        cancelColor: 'cancelColor',
        confirmText: '去观看',
        confirmColor: '#3399FF',
        title: '您的抽奖机会用完了',
        content: '观看15秒广告，即可获得抽奖机会哟',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../advertise/advertise',
            })
          }
        }
      })
    }
  },

  /**
   * 关闭弹窗
   */
  closeDialog() {
    this.setData({
      showDialog: false
    })

  },

  /**
   * 领取奖品
   */
  getAward() {
    this.closeDialog()  //关闭弹窗

    wx.showLoading({
      title: '领取中',
    })
    const id = this.data.myAward.id;

    //领取奖品
    awardUtil.clickAcquire(id)  //点击领取
      .then(res => {
        return awardUtil.addRaffle(id, openid)   //添加领取记录
      }).then(res => {
        wx.hideLoading()
      }).catch(err => {
        console.log('错误' + err)
        wx.hideLoading()
      })
  },


  /**
   * 缓存奖项到设备
   * @param {array} img 
   */
  setStorageOfImg(img) {
    wx.setStorage({
      data: img,
      key: 'img'
    })
  },

  /**
   * 缓存奖项到设备
   * @param {array} awards 
   */
  setStorageOfAwards(awards) {
    wx.setStorage({
      data: awards,
      key: 'awards'
    })
  },


  /**
   * 从缓存中获取数据
   */
  getDataByStorage() {
    this.setData({
      awards: wx.getStorageSync('awards'),
      imgUrl: wx.getStorageSync('img')
    })
  },


  init(callback) {
    Promise.all([awardUtil.getAwards(), awardUtil.getImg(), User.getUserInfo(openid)])
      .then(res => {
        this.setData({
          prohibit: true,    //开启抽奖
          awards: res[0].data,
          imgUrl: res[1].data,
          award_num: res[2].data.priceAccount
        })

        //关闭弹窗
        wx.hideLoading()

        //设置缓存
        this.setStorageOfAwards(res[0].data)
        this.setStorageOfImg(res[1].data.items)

        callback && callback()
      }).catch(err => {
        wx.hideLoading()

        wx.showModal({
          cancelColor: 'cancelColor',
          title: '网络错误, 点击刷新重试',
          confirmText: '刷新'
        }).then(res => {
          if (res.confirm) {
            this.init(callback)
          }
        }).catch(res => callback && callback())
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从缓存中获取数据
    this.getDataByStorage()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
    })
    //从数据库获取数据
    if (openid) {
      this.init()
    } else {
      getApp().getUserOpenInfo()
        .then(res => {
          openid = res.data.openId;
          console.log(getApp().globalData.openid)
          this.init()
        })
    }
  },

  onPullDownRefresh: function () {
    wx.showLoading({
      title: '刷新中...',
    })

    //请求数据
    this.init(() => wx.stopPullDownRefresh())
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})