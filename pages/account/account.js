// miniprogram/pages/account/account.js
var getPriceInfo = require("../../util/priceUtils");
Page({
  /* content:
        "activityPriceId": 0,
        "createBy": "string",
        "createTime": "2020-09-11T01:58:04.072Z",
        "id": 0,
        "updateBy": "string",
        "updateTime": "2020-09-11T01:58:04.072Z",
        "userId": 0

      content2:
      "createBy": "string",
      "createTime": "2020-09-11T02:08:47.313Z",
      "id": 0,
      "name": "string",
      "type": "string",
      "updateBy": "string",
      "updateTime": "2020-09-11T02:08:47.313Z",
      "warnAcount": 0
  */

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    end: true,
    bottomText: "正在加载下一页",
    Info:[],
  },

  setElemHeight() {
    wx.getSystemInfo({
      success: result => {
        this.setData({
          tab_nav_height: result.windowHeight - 54 - 20 //54为tab的高度，20为magin的上下间距
        })
      },
    })
  },
  TabChanges(e) {
    this.setData({
      type: e.detail.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('userInfo')) {
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
      
    }else {
      this.setElemHeight();
      getPriceInfo.getMyPrice().then(res => {
        this.setData({Info:res.data})
        console.log(res)
      }).catch(err => {
        console.error("失败");
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})