// miniprogram/pages/me/address/address_detail/address_detail.js
const address = require("../../../../util/addressUtil.js").InsertAddress;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Info: {},
    infoList: [{
      id: "name",
      title: "姓名",
      type: "text",
      max: 10
    },
    {
      id: "phone",
      title: "手机号",
      type: "number",
      max: 11
    },
    {
      id: "address",
      title: "地址",
      type: "text",
      max: 30
    },
    ],
    bindText: "确认添加",
  },
  changeInfo: function (e) {
    let Info = this.data.Info;
    switch (e.currentTarget.id) {
      case "name":
        Info.name = e.detail.value;
        break;
      case "phone":
        Info.phone = e.detail.value;
        break;
      default:
        Info.address = e.detail.value;
        break;
    }
    this.setData({
      Info
    })
  },
  complie(e) {
    wx.showLoading({
      title: '添加中，请稍后',
    })
    let Info = this.data.Info;
    if (Info.name == undefined
      || Info.address == undefined
      || Info.phone == undefined) {
      wx.hideLoading()
      wx.showToast({
        title: '要把信息填写完整哦~',
        icon: "none"
      })
      return;
    }

    let reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/;

    if (reg.test(Info.phone)) {
      address(Info)
        .then(res => {
          wx.hideLoading()
          if (res.data) wx.navigateBack()
        })
        .catch(res => wx.hideLoading())
    } else {
      wx.showToast({
        title: '手机号填写不正确~',
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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