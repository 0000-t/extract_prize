// miniprogram/pages/me/address/address.js
const address = require("../../../util/addressUtil.js");
const provinces = require("../../../util/language").province2;

// const App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    configuerInfo: "添加个人地址",
    makesure: false,
    currentClick: -1,
    Info: [{
      name: "wsl",
      address: "111",
      phone: "12333"
    }]
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
      console.log(options);
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

  radioChange(e) {
    console.log(e)
    let now = +e.detail.value;
    let last = this.data.currentClick
    this.setData({
      currentClick: now == last ? '-1' : now
    })
  },

  //新增地址
  add_address() {
    wx.navigateTo({
      url: '../address/address_detail/address_detail',
    })
  },

  complie(e) {
    if (this.data.makesure) {
      let Info = this.data.Info
      console.log(Info)
      let info = Info[this.data.currentClick];
      let province = info.address != undefined ? info.address.split("省")[0] : 1;
      console.log(province);
      let changes = 0;
      //对地址进行处理
      for (let i in provinces) {
        if (province == provinces[i].name) {
          changes = 1;
          break;
        }
      }
      if (changes) {
        //判断省内或者省外
        if (province == "广东") {
          //付钱 （微信支付方式）
          console.log("1")
          //付钱成功后的回调函数内容

          wx.showModal({
            cancelColor: 'cancelColor',
            title: '改功能还没开放，请稍后再试'
          }).then(res => {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1
              })
            }
          })

          // let pages = getCurrentPages();
          // let prePage = pages[pages.length - 2];
          // prePage.setData({
          //   //把地址信息传到上个页面
          //   address: info,
          // })
          // wx.navigateBack({
          //   delta: 1
          // })

        } else {
          wx.showModal({
            cancelColor: 'cancelColor',
            confirmText: '继续',
            title: '提示',
            content: '由于您选择的是省外地址，需要扫面二维码添加客服微信处理，是否继续',
          }).then(res => {
            if (res.confirm) {
              wx.previewImage({
                urls: ['https://7461-tao-2000-1301105216.tcb.qcloud.la/k.jpg?sign=e66dfae96fd2813d46ab3aee9df3e32b&t=1602907821'],
              }).then(res => {
                console.log('https://7461-tao-2000-1301105216.tcb.qcloud.la/k.jpg?sign=e66dfae96fd2813d46ab3aee9df3e32b&t=1602907821')
                wx.setStorageSync('close', true)
              })
            }
          })

          // wx.showToast({
          //   title: '请选择省内地址',
          //   icon: "none",
          //   duration: 2000
          // })
        }
        //收费或者是弹出一个小窗口
      } else {
        wx.showToast({
          title: '请选择正确的地址~',
          icon: "none",
          duration: 5000,
        })

      }
    } else {
      this.add_address()
    }
  },

  isClosePage() {
    console.log(wx.getStorageSync('close'))
    if (wx.getStorageSync('close')) {
      wx.navigateBack({
        delta: 1
      }).then(res => {
        wx.setStorageSync('close', false)
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
    this.isClosePage()
    //显示个人的地址
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