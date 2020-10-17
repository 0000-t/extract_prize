import serverAddress from './serverAddress.js'

/**
 * 
 * @description 与服务器连接的js文件，与用户相关的东西
 * @package utils/UserUtil.js
 * @way wx.request
 * @服务器ip 
 * 
 */
/**
 * 
 * @param { openid }
 * @openid的传入  
 */
function sendOpenidtoServers(nickName,Openid) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverAddress + '/user',
      method: "POST",
      data: {
        "createTime": "2020-09-16T14:54:20.056Z",
        "nickName": nickName,
        "openId": Openid,
      },
      dataType: "json",
      success: resolve,
      fail: reject,
    })
  })
}
/**
 * 
 * @param { openid }
 * @查找openid对应的用户  
 */
function getUserInfo(Openid) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverAddress + '/user/' + Openid,
      method: "GET",
      dataType: "json",
      success: resolve,
      fail: reject,
    })
  })
}
module.exports = {getUserInfo,sendOpenidtoServers};