/**
 * 
 * @description 关于微信支付的相关内容
 * @package utils/WXPay.js
 * @way wx.request，wxwx.requestPayment({
   nonceStr: 'nonceStr',
   package: 'package',
   paySign: 'paySign',
   timeStamp: 'timeStamp',
 })
 * @服务器ip
 * 
 */

 /**
  * @description 将openid传入后台，以及商品id ， （？money）
  * @param data 数组
 */
function sendUserPayInfo(data){
  return new Promise((resolve,reject)=>{
    wx.request({
      url: 'url',
      method:"",
      data:{openid:data.openid,},
      dataType:"json",
      header:{},
      success:resolve,
      fail:reject,
    })
  })
}

module.exports ={sendUserPayInfo,};