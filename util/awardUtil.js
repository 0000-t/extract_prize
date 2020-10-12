/**
 * 获取广告图片
 */
function getImg() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://47.94.135.125:6081/luckly/advertise/Context',
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

/**
 * 获取奖项
 */
function getAwards() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://47.94.135.125:6081/luckly/raffle/raffleItem',
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

/**
 * 领取奖品
 * @param {string} id 奖品的id
 */
function clickAcquire(id) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'http://47.94.135.125:6081/luckly/raffle/click/' + id,
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

/**
 * 记录用户的抽奖记录
 * @param {string} id 奖品id
 * @param {string} openid 用户的openid
 */
function addRaffle(id, openid) {
  return new Promise((resolve, reject) => {
    wx.request({
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      url: 'http://47.94.135.125:6081/luckly/raffle/addRaffle',
      method: 'POST',
      data: {
        activityPriceId: id,
        userId: openid
      },
      success: res => resolve(res),
      fail: err => reject(err)
    })
  })
}

module.exports = {
  getImg,
  getAwards,
  clickAcquire,
  addRaffle
}


