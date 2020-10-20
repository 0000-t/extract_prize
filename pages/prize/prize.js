// miniprogram/pages/account/account.js
const priceUtils = require("../../util/priceUtils");

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
    Info: [],
    isShow: false,
    shop: false,
    quan: false,
  },

  clickTicket(e) {
    let index = +e.currentTarget.dataset.index;
    let priceType = +this.data.Info[index].priceType
    // let priceType=3
    let status = this.data.Info[index].status
    console.log('展示券码', e)
    //判断状态
    if (status == 0) {
      //判断类型
      if (priceType == 3) {
        wx.previewImage({
          urls: [this.data.Info[index].url],
        })
      } else if (priceType == 2) {
        console.log(e);
        wx.navigateTo({
          url: `../me/address/address?restart=1`,
        })
      }
    } else {
      wx.showToast({
        title: status == 1 ? '商品已领取' : '商品已过期',
      })
    }
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


  /**
   * 关闭弹窗
   */
  closeDialog() {
    this.setData({
      isShow: false
    })
  },

  /**
   * 显示弹窗
   */
  showDialog() {
    // wx.showToast({
    //   title: '改功能暂未开放',
    //   icon: 'none'
    // })
    // if (this.data.account <= 0) {
    //   return void wx.showToast({
    //     title: '当前无可提现余额',
    //     icon: 'none'
    //   })
    // }
    // this.setData({
    //   isShow: true
    // })

    wx.showModal({
      cancelColor: 'cancelColor',
      title: '联系客服回收',
      content: "点击'确定'按钮扫码联系客服"
    }).then(res => {
      if (res.confirm) {
        wx.previewImage({
          urls: ['https://www.yinsuzhaopin.com/img/kf.jpg'],
        })
      }
    })
  },

  /**
   * 获取用户输入的金额
   * @param {*} e 
   */
  getMoney(e) {
    let money = e.detail.money
    console.log(money)
    this.applyOfCash(money)
  },

  /**
   * 申请提现
   */
  applyOfCash(money) {
    wx.showLoading({
      title: '提现中, 请稍等',
    })
    priceUtils.applyOfCash(money)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        this.closeDialog()
        if (res.success) {
          wx.showToast({
            title: '提现成功'
          })
        } else {
          throw res
        }
      })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({
          title: '提现失败，请稍后再试',
          icon: 'none'
        })
      })

  },

  /**
   * 获取账户的余额
   */
  getAccount() {
    priceUtils.getAcount()
      .then(res => {
        // console.log(res)
        this.setData({
          account: res.data.account
        })
      })
      .catch(err => console.log('获取账户余额失败', err))
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAccount()
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
      wx.showLoading({
        title: '加载中',
      })
      this.setElemHeight();
      priceUtils.getMyPrice().then(res => {
        this.setData({ Info: res.data })
        console.log(res)
        // res.data.forEach((value, index) => {
        //   switch (value.priceType) {
        //     case '2':
        //       this.setData({ shop: true }); break;
        //     case '1':
        //       this.setData({ quan: true }); break;
        //     default: break;
        //   }
        // })
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
        console.error("失败");
      })
    }
  },

  TabChanges(e) {
    this.setData({
      type: e.detail.name
    })
  },

  changes(e) {
    console.log(e);
    wx.navigateTo({
      url: `../me/address/address?restart=1`,
    })
  },

  onShow: function () {
    // var pages = getCurrentPages();
    // var currpages = pages[pages.length - 1]
    // if (currpages.data.address) {
    //   let province = address.address.split("省")[0];
    //   this.setData({
    //     address,
    //   })
    //   let changes = 0;
    //   //对地址进行处理
    //   for (let i in provinces) {
    //     if (province == provinces[i].name) {
    //       changes = 1;
    //       break;
    //     }
    //   }
    //   if (changes) {
    //     //判断省内或者省外
    //     if (province == "广东") {
    //       //付钱 （微信支付方式）
    //     } else {
    //       //弹出相关窗口（微信二维码）
    //     }
    //     //收费或者是弹出一个小窗口
    //   } else {
    //     wx.showToast({
    //       title: '地址无效请更换地址信息~',
    //       icon: "none",
    //       duration: 2000,
    //     })
    //   }

    // } else {
    //   return;
    // }

  },
  onReachBottom: function () {

  },
})