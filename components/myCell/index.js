// components/tabList/tabList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
    },
    icon: {
      type: String,
    },
    url: {
      type: String,
    },

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    Click: function () {
      if (!wx.getStorageSync('userInfo')) {
        wx.showToast({
           title: '请登录',
           icon: 'none'
        })
        return false;
     }
      this.data.url && wx.navigateTo({
        url: this.data.url,
      })
      this.triggerEvent('click');
    }
  }
})