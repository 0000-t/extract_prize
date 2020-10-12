// miniprogram/pages/me/myInfo/myInfo.js
const language = require("../../../util/language.js").getChina;
const address = require("../../../util/addressUtil.js").ShowAddress;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let user = wx.getStorageSync('userInfo');
    if (!user) {
      wx.navigateBack({
        delta:1,
        complete :res => {
          wx.showToast({
            title: '请先登陆,暂无数据',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    } else {
      user.city = language(user.city);
      user.province = language(user.province);
      this.setData({
        user
      });
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