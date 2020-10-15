// miniprogram/pages/me/myRecord/myRecord.js
var getPriceInfo = require("../../../util/priceUtils.js").getPriceInfo;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end: true,
    rows: 10,
    page: 1,
    total: 1,
    bottomText: "已经到底啦~",
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
      this.getServersInfo(1, 10);
    }
  },
  getServersInfo(page, rows) {
    var that = this;
    getPriceInfo(page, rows).then(res => {
      console.log(res);
      //获取总页数
      //将数据搞进
      let Info = this.data.Info;
      Info.push(...res.data.items);
      for (let i = 0, len = Info.length; i < len; i++) {
        Info[i].createTime = Info[i].createTime.substring(0, 10);
      }
      that.setData({
        total: res.data.totalPage == null ? 2 : 0,
        Info,
      })
    }).catch(err => {
      console.error(err);
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //刷新按钮
    console.log("到底了！");
    let page = this.data.page + 1;
    if (page <= this.data.total) {
      this.setData({
        page: page,
        end: false,
        bottomText: "正在加载中~~"
      });
      this.getServersInfo(page, this.data.rows);
    } else {
      this.setData({
        end: true,
        bottomText: "已经没有啦！",
      })
    }
  },

})