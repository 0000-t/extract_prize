import serverAddress from './serverAddress.js'

/**
 * 
 * @description 与服务器连接的js文件，与奖品相关的东西
 * @package utils/pirceUtil.js
 * @way wx.request
 * @服务器ip 
 * 
 */
/**
 * 
 * @param {page  rows   openid }
 * @日志相关获取  
 */
function getPriceInfo(page, rows) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverAddress + '/raffle/queryByUser',
      method: "GET",
      data: {
        "userId": getApp().globalData.openid,
        "page": page,
        "rows": rows
      },
      dataType: "json",
      // header:{},
      success: resolve,
      fail: reject,
    })
  })
}
/**
 * 
 * @param { openid }
 * @奖品信息获取 
 */
function getMyPrice() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverAddress + '/prize/getPrizeByOpenId',
      method: "GET",
      data: {
        "opendId": getApp().globalData.openid
      },
      dataType: "json",
      // header:{},
      success: resolve,
      fail: reject,
    });
  })
}

/**
 * 提现
 */
function applyOfCash(money) {
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: serverAddress + '/wx/transfer',
      method: 'POST',
      data: {
        openId: getApp().globalData.openid,
        money
      },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取可提取的余额
 */
function getAcount() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: serverAddress + '/user/' + getApp().globalData.openid,
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  getPriceInfo,
  getMyPrice,
  applyOfCash,
  getAcount,
}