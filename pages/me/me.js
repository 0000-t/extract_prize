const language = require("../../util/language.js");
var User = require("../../util/UserUtils.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "./../../images/man-top.png",
    controller: true,
  },

  getUserInfoByBtn(e) {
    let openid = getApp().globalData.openid;
    let userinfo = e.detail.userInfo;
    console.log(userinfo);
    //看看openid服务器里有没有
    User.getUserInfo(openid)
      .then(user => {
        console.log(user);
        if (user.data == "") {
          User.sendOpenidtoServers(userinfo.nickName, openid)
        };
        this.setData({
          avatarUrl: userinfo.avatarUrl,
          controller: false,
          name: userinfo.nickName,
          exit:true,
        });
        wx.setStorage({
          data: userinfo,
          key: 'userInfo',
          success: res => {
            console.log(res);
          }
        })
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userinfo = wx.getStorageSync('userInfo');
    if (userinfo) {
      this.setData({
        name: userinfo.nickName,
        controller: false,
        avatarUrl: userinfo.avatarUrl,
        exit:true
      })
    }
  },
  exitToLogin(e){
    //清除缓存
    wx.removeStorage({
      key: 'userInfo',
      success:res=>{
        wx.showModal({
          title:"正在退出登录",
          content:"您确定要退出登录吗~",
          success:res=>{
            if(res.confirm){
              this.setData({
                avatarUrl:"./../../images/man-top.png",
                controller:true,
                exit:false,
              })
            } else{
              return ;
            }
          }
        })
        
      }
    })
    console.log("tuichu");
  }
})