// components/mySwiper/mySwiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgUrl: {
      type: Array,
    },
    mode: {
      type: String,
      value: 'aspectFill'
    }
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
    scanImg(e) {
      let idx = +e.currentTarget.dataset.index;
      wx.previewImage({
        urls: [this.data.imgUrl[idx]],
      }).then(res => {
        console.log(res)
      })
    }
  }
})
