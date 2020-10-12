// components/tips/tips.js
var name;
var phone;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
    },

    content: {
      type: String,
    },

    src: {
      type: String,
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
    btnCancel: function () {
      this.triggerEvent('closeDialog')
    },

    btnSubmit: function () {
      this.triggerEvent('getAward')
    }
  }
})