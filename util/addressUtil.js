/**
 * 
 * @description 与服务器连接的js文件，与地址相关的东西
 * @package utils/addressUtil.js
 * @way wx.request
 * @服务器ip 
 * 
 */
  const App = getApp();
/**
 * 
 * @param {*} data 
 */
  function InsertAddress(data){
    return new Promise((resolve,reject) => {
      wx.request({
        url: 'http://47.94.135.125:6081/luckly/address',
        method:"POST",
        data:{
          "address":data.address,
          "name":data.name,
          "openId":App.globalData.openid,
          "phone":data.phone,
        },
        success:resolve,
        fail:reject
      })
    });
  };

/**
 * 
 * @param {*} id 
 */
  function DeleteAddress(id){
    return new Promise((resolve,reject) => {
      wx.request({
        url: 'http://47.94.135.125:6081/luckly/address/',
        method:"GET",
        data:{
          "id":id,
        },
        success:resolve,
        fail:reject
      })
    });
  };
  /**
   * 
   * @param {*} openid 
   */
  function ShowAddress(){
    return new Promise((resolve,reject) => {
      wx.request({
        url: 'http://47.94.135.125:6081/luckly/address/getByOpenId',
        method:"GET",
        data:{
          "openId":App.globalData.openid,
        },
        success:resolve,
        fail:reject
      })
    });
  }

module.exports = {ShowAddress,InsertAddress,DeleteAddress};