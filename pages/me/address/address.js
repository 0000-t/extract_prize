// miniprogram/pages/me/address/address.js
const address = require("../../../util/addressUtil.js");
// const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    configuerInfo: "添加个人地址",
    makesure: false,
    item:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('userInfo')) {
      wx.navigateBack({
        delta: 1,
        complete: res => {
          wx.showToast({
            title: '请先登陆,暂无数据',
            icon: 'none',
            duration: 2000,
          })
        }
      })

    } else {
      if (options.restart) {
        this.setData({
          makesure: true,
          configuerInfo: "确认"
        })
      }
    }
  },

  delete(e) {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '删除地址',
      content: '您确定删除吗',
      confirmText: '确定'
    }).then(res => {
      if (res.confirm) {
        wx.showLoading({
          title: '删除中',
        })
        address.DeleteAddress(e.currentTarget.dataset.id)
          .then(res => {
            wx.hideLoading()
            if (res.data) {
              this.onShow()
            } else {
              wx.showToast({
                title: '系统错误请稍后再试~',
                icon: "none",
              });
            }
          }).catch(err => wx.hideLoading())
      }
    })

  },
  radioChange(e){
    this.setData({
      item:e.detail.value
    })
  },
  complie(e) {
    if (this.data.makesure) {
      let Info = this.data.Info
      let info = Info[this.data.item];
      console.log(Info)
      let pages = getCurrentPages();
      let prePage = pages[pages.length -2];
      prePage.setData({
        //把地址信息传到上个页面
        address:info,
      })
      wx.navigateBack({
        delta:1
      })
    } else {
      wx.navigateTo({
        url: '../address/address_detail/address_detail',
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    address.ShowAddress()
      .then(res => {
        wx.hideLoading()
        console.log(res);
        this.setData({
          Info: res.data
        })
      }).catch(err => wx.hideLoading())
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
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})