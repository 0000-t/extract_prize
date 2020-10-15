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

    placeholder: {
      type: String,
      value: '请输入金额'
    },

    max: {
      type: Number,
      value: 0
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
    inputContent(e) {
      this.data.content = e.detail.value
    },

    btnCancel: function () {
      this.triggerEvent('closeDialog')
    },

    btnSubmit: function () {
      if (this.data.content) {
        let money = +this.data.content
        if (money <= this.data.max) {
          this.triggerEvent('getMoney', { money })
        } else {
          return void wx.showToast({
            title: '输入金额不能大于可提现余额',
            icon: 'none'
          })
        }
      }
      else {
        return void wx.showToast({
          title: '请输入提现金额',
          icon: 'none'
        })
      }
    }
  }
})