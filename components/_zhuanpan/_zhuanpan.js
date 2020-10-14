// components/zhuanpan/zhuanpan.js
//创建并返回内部 audio 上下文 innerAudioContext 对象
const start = wx.createInnerAudioContext();
const mid = wx.createInnerAudioContext();
const stop = wx.createInnerAudioContext();

let timer = null;
let selectedAward = [];

Component({
   options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
   },

   /**
    * 组件的属性列表
    * 用于组件自定义设置   组件的对外属性
    */
   properties: {
      percentage: {
         type: Boolean, // 概率开关，默认随机 false
         value: true
      },

      musicflg: {
         type: Boolean, // 转盘声音开关，默认false
         value: false
      },

      fastJuedin: {
         type: Boolean, // 快速转动转盘的开关，默认true
         value: true
      },

      repeat: {
         type: Boolean, // 重复抽取开关，默认false
         value: false
      },

      prohibit: {
         type: Boolean,
         value: false
      },

      size: {
         type: Object, // 转盘大小，宽高单位rpx
         value: {
            w: 659, // 注意宽要比高小1rpx
            h: 660
         }
      },

      // 限制：最多17个选项， 单个选项最多填10-13个字, 选项名称最多21个字
      awardsConfig: { // 默认的当前转盘选项 
         type: Array,
         value: [
            {
               id: 0,
               prize: "请刷新",
               percentage: 1
            }
         ],
         observer(newValue) {
            const colors = ['#F5C956', '#F5A721']
            const len = newValue.length;
            for (let i = 0; i < len; i++) {
               newValue[i].color = i % 2 == 0 ? colors[0] : colors[1];
               if (newValue[i].count <= 0) newValue[i].percentage = 0
            }
            console.log(newValue)
            this.initAdards();
         }
      },

      num: {
         type: Number,
         value: 0,
      },

   },

   /**
    * 私有数据,组件的初始数据
    * 可用于模版渲染   
    */
   data: {
      animationData: {}, // 转盘动画
      zhuanflg: false,   // 转盘是否可以点击切换的标志位
      fastTime: 7600,    // 转盘快速转动的时间
      slowTime: 3900,    // 转盘慢速转动的时间
      block1: 'block',   // 转盘中心的图片标志位，用来显示隐藏
      block2: 'none',
      block3: 'none',
      block4: 'none',
   },

   // 组件生命周期函数，在组件实例进入页面节点树时执行
   attached: function () {
      start.src = 'https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/start.mp3'; // 转盘开始转动的音乐
      mid.src = 'https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/mid.mp3';     // 快速决定时，转盘开始转动的音乐
      stop.src = 'https://gamesdata.oss-cn-hangzhou.aliyuncs.com/xiaojueding/stop.mp3';   // 转盘停止转动的音乐

      // this.initAdards();
   },

   /**
    * 组件的方法列表
    * 更新属性和数据的方法与更新页面数据的方法类似
    */
   methods: {
      /*
       * 公有方法
       */
      //判断值是否为空
      isNull(str) {
         if (str == null || str == undefined || str == '') {
            return true;
         } else {
            return false;
         }
      },

      refresh() {
         wx.showToast({
            title: '请刷新后重试',
            icon: 'none'
         })
      },

      //初始化数据
      initAdards() {
         var that = this, awardsConfig = that.data.awardsConfig;
         var t = awardsConfig && awardsConfig.length;  // 选项长度
         var e = 1 / t, i = 360 / t, r = i - 90;

         for (var g = 0; g < t; g++) {
            awardsConfig[g].item2Deg = g * i + 90 - i / 2 + "deg";//当前下标 * 360/长度 + 90 - 360/长度/2
            awardsConfig[g].afterDeg = r + "deg";
         }

         that.setData({
            turnNum: e, // 页面的单位是turn
            awardsConfig: awardsConfig,
         })

         that._change();//向父组件传出当前转盘的初始数据
      },

      //重置转盘
      reset() {
         var that = this, awardsConfig = that.data.awardsConfig;
         console.log(awardsConfig);
         var animation = wx.createAnimation({
            duration: 1,
            timingFunction: "ease"
         });
         that.animation = animation;
         animation.rotate(0).step(), that.data.runDegs = 0;

         that.setData({
            animationData: animation.export(),
            block3: 'none',
            block4: 'block'
         })

         // for (let x in awardsConfig) {
         //    awardsConfig[x].opacity = '1';
         // }

         !!selectedAward.length && (awardsConfig[selectedAward[0]].color = selectedAward[1])

         that.setData({
            block1: 'block',
            block2: 'none',
            block3: 'none',
            block4: 'none',
            awardsConfig: awardsConfig,
         })
         //    that._myAwards(true);
      },


      //修改奖品的数量和根据数量设置概率
      setAwardNumAndPercentage(award) {
         if (--award.count == 0) award.percentage = 0
      },


      /*
      * 内部私有方法建议以下划线开头
      * triggerEvent 用于触发事件,过triggerEvent来给父组件传递信息的
      * 写法： this.triggerEvent('cancelEvent', { num: 1 })  // 可以将num通过参数的形式传递给父组件
      */

      // GO转盘开始转动
      _zhuan() {
         //判断是否还有抽奖次数
         if (this.isNotLogin()) return
         if (this.awardNumIsNull()) return

         var that = this;
         var awardsConfig = that.data.awardsConfig;

         //>>> 是无符号移位运算符
         var r = Math.random() * awardsConfig.length >>> 0, runNum = 8;


         /*=============不重复抽取=============*/
         if (that.data.repeat) {
            r = that._queryRepeat(r);
         } else {
            wx.removeStorageSync('repeatArr');

            //开启概率 percentage这属性必须要传个ture
            if (that.data.percentage) {
               r = +that._openpercentage();
               console.log(r)
            }
         }

         if (r <= 0 && r != r) {
            console.log('抽奖概率为零了')
            return void wx.showToast({
               title: '抽奖活动暂停，请稍后再试',
               icon: 'none'
            })
         }

         console.log('当前答案选项的下标==', r);
         setTimeout(function () {

            //转盘开始转动音乐
            that.data.musicflg ? that.data.fastJuedin ? mid.play() : start.play() : '';

            //要转多少度deg
            that.data.runDegs = that.data.runDegs || 0, that.data.runDegs = that.data.runDegs + (360 - that.data.runDegs % 360) + (2160 - r * (360 / awardsConfig.length));

            var animation = wx.createAnimation({
               duration: that.data.fastJuedin ? that.data.slowTime : that.data.fastTime,
               timingFunction: "ease"
            });
            that.animation = animation;

            //这动画执行的是差值 
            //如果第一次写rotate（360） 那么第二次再写rotate（360）将不起效果
            animation.rotate(that.data.runDegs).step(), 0 == r && (that.data.runDegs = 0);

            that.setData({
               animationData: animation.export(),
               block1: 'none',
               block2: 'block',
               block3: 'none',
               zhuanflg: true,
               idx: r
            })

            that._setatZhuan(true);
         }, 0);

         timer = setTimeout(function () {
            // for (let x in awardsConfig) {
            //    if (x != r) {
            //       // awardsConfig[x].opacity = '0.3';
            //    } else {
            //       selectedAward = [x, awardsConfig[x].color];
            //       // awardsConfig[x].opacity = '1';
            //       awardsConfig[x].color = '#FFBA03'
            //    }
            // }

            //转盘停止后的音乐
            !that.data.musicflg ? '' : stop.play();

            that.setData({
               animationData: {},
               s_awards: awardsConfig[r],//最终选中的结果
               awardsConfig: awardsConfig,
               block1: 'none',
               block2: 'none',
               block3: 'block',
               zhuanflg: false,
            })

            that._myAwards(false);
            that.setAwardNumAndPercentage(awardsConfig[r]);
            that._setatZhuan(false);
         }, that.data.fastJuedin ? that.data.slowTime : that.data.fastTime);
      },


      // 开启概率 
      // 传 1-100 的数 来设置选项的权重  
      // 传入0的话就永远摇不到这个选项
      _openpercentage() {
         var that = this, awards = that.data.awardsConfig, arr = [];
         //5, 5, 20, 10 ,30 ,30, 0
         for (let i in awards) {
            if (awards[i].percentage != 0) {
               for (var x = 0; x < awards[i].percentage; x++) {
                  //把当前的概率数字 以当前选项下标的形式 都添加都空数组中，然后随机这个数组
                  arr.push(i);
               }
            }
         }
         var s = Math.floor(Math.random() * arr.length);
         return arr[s];
      },


      awardNumIsNull() {
         if (this.data.num > 0) {
            return false
         } else {
            wx.showModal({
               cancelColor: 'cancelColor',
               confirmText: '去观看',
               confirmColor: '#3399FF',
               title: '您的抽奖机会用完了',
               content: '观看15秒视频，即可获得抽奖机会哟',
               success: res => {
                  if (res.confirm) {
                     wx.navigateTo({
                        url: '../advertise/advertise',
                     })
                  }
               }
            })
            return true
         }
      },

      isNotLogin() {
         if (!wx.getStorageSync('userInfo')) {
            wx.showToast({
               title: '请登录',
               icon: 'none'
            })
            return true;
         }
         return false;
      },


      //初始化数据时向外传的参
      _change() {
         this.triggerEvent('myData', this.data.awardsConfig);// 向父组件传出当前决定的数组数据
      },

      //当前转盘的结果   e:转盘什么时候能点击的标志位
      _myAwards() {
         this.triggerEvent('myAwards', {
            s_awards: this.data.s_awards,
            idx: this.data.idx
         })
      },

      //转盘开始转动或者结速转动后的要传的值
      _setatZhuan(e) {
         this.triggerEvent('startZhuan', e); // 向父组件传出当前决定的数组数据
      },

   }
})