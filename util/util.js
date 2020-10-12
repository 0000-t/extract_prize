function setInviter(options) {
  if (options.inviterId) {
    wx.setStorage({
      key: 'inviterId',
      data: options.inviterId
    })
  }
}


function delInviterByStorage() {
  wx.removeStorage({
    key: 'inviterId',
  })
}

module.exports = {
  setInviter,
  delInviterByStorage
}