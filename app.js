const User = require("./util/UserUtils.js");
//app.js
App({
  onLaunch: function () {
    this.getUserAuthorize()
    this.getUserOpenInfo()
      .then(res => {
        this.globalData.openid = res.data.openId
      })
      .catch(err => {
        console.log(err)
      })
  },

  getUserAuthorize: function () {
    wx.getSetting({
      success: res => {
        console.log(res)
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: res => {
              // console.log(res)
            },
            fail: err => {
              // console.log(err)
            }
          })
        } else {
          wx.getUserInfo({
            success: res => {
              // console.log(res)
            }
          })
        }
      }
    })
  },


  getUserOpenInfo: function () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: res => {
          wx.request({
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            url: 'http://47.94.135.125:6081/luckly/wx/openId',
            data: {
              code: res.code
            },
            method: 'POST',
            success: resolve,
            fail: reject
          })
        }
      })
    })
  },

  globalData: {

  }
})