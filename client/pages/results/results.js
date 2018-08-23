const app = getApp();
var config = require('../../config.js');
const convert = {
  '0': '☆☆☆☆☆',
  '1': '★☆☆☆☆',
  '2': '★☆☆☆☆',
  '3': '★★☆☆☆',
  '4': '★★☆☆☆',
  '5': '★★★☆☆',
  '6': '★★★☆☆',
  '7': '★★★★☆',
  '8': '★★★★☆',
  '9': '★★★★★',
  '10': '★★★★★',
}
const note_detail = {
  'a':{
    itempic: config.service.flairsUrl + 'img_halloween_crop.jpg',
    itemname: 'Report Abuse',
    itemintro: 'Email deverloper: 2379703485@qq.com.'
  },
  'b':{
    itempic: config.service.flairsUrl + 'img_code_crop.jpg',
    itemname: 'Privacy Policy',
    itemintro: "Still Haven't Go Public, Have We?"
  },
  'c':{
    itempic: config.service.flairsUrl + 'img_lunch_crop.jpg',
    itemname: 'How to Register',
    itemintro: 'Visit ' + config.openUrl.register +' , where you can fill in the form. It may take a while to check your store to avoid spam or stuff that violates our TOS.'
  },
  '+':{
    itempic: config.service.flairsUrl + 'img_xmas_crop.jpg',
    itemname: 'Eastern Egg',
    itemintro: "Glad you find it. To be honest, I haven't got an clue what it should be. So far I have only written the acknowlegement. \n\nHere is the Acknowledgement: \n-Thanks @st.kyh, \nshe set up the framework and have done most of the work. \n-Merci, @jooies \nfor your excellent filebox system for us to manage files on server. \n-Finally, Danke Tencent, \nyour crappy, buggy, incomplete JS engine & html & css language has forced us to google a lot.\nBy @leon" 
  }
}
var visitTime = 0;
const level = ['Please rate first', '糟糕透顶', '不喜欢', "还行吧", '喜欢', '超喜欢', 'Thanks for rating'];
var needPullInfo = true;
var submitcnt_next = '继续';
var submitcnt_submit = '提交';
var submitcolor_after = '#444'
var status = 1;//处在第一页，展示五角星
var submit_text = '';//用户的评价
var fav_txt=['收藏','已收藏','稍后']
var ani_nav_emphsz = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 300,
})
var ani_nav_restore = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 300,
})
var ani_content = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 300,
  timingFunction: 'ease'
})
function createNavAni() {
  ani_nav_emphsz.export();
  ani_nav_restore.export();
  ani_nav_emphsz.backgroundColor('#2979ff').scale(1.3).step();
  ani_nav_restore.backgroundColor('#ccc').scale(1).step();
}
var glob_opts;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: 0,
    storenameclass: 'storename',
    storeData: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo: '',
    hasUserInfo: false,
    visitTime,
    flag: 0,
    submitcolor: '#aaa',
    reviewSuportToggle: false,
    reviewSupport: '',
    reviewBackDisplay: 'none',
    reviewtitle: 'Rate this store',
    ani_content: {},
    ani_topup: {},
    reviewIptFocusBottom: '1px solid rgba(0,0,0,.12)',
    submitBtnContent: submitcnt_submit,
    finalscore: '',
    showPopup: false,
    showNav: false,
    ani_popup: {},
    ani_mask: {},
    ani_nav_1: {},
    ani_nav_2: {},
    popupImg: '',
    popupTitle:'',
    popupIntro:'',
    esaterneggTapCnt: 0,
    coll_txt: '收藏',
    favToggle:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    visitTime++;
    var that = this;
    glob_opts = options;
    if (options && options.searchValue) {
      var search = options.searchValue.replace("%26", "&")
      console.log(search)
      wx.request({
        url: config.service.resultUrl,//这里填写后台给你的搜索接口
        method: 'post',
        data: {
          str: search,
          openid: app.globalData.openid,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
          //'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res.data);
          if (res.data[0].id) {
            for(var i=0,len=res.data[3].length;i<len;i++){
              res.data[3][i].score = convert[res.data[3][i].score];
            }
            var fav_txt_idx = (res.data[0].fav)?1:0;
            that.setData({
              storeData: res.data,
              favToggle: res.data[0].fav,
              coll_txt: fav_txt[fav_txt_idx],
            })
            for (var i = 0, len = that.data.storeData[2].length; i < len; i++) {
              var key = 'storeData[2][' + i + '].score';
              that.setData({
                [key]: convert[that.data.storeData[2][i].score]
              });
            }
            var score = Math.round(that.data.storeData[0].score * 10) / 10
            that.setData({
              'storeData[0].score':score,
            })
          }else{
            wx.redirectTo({
              url: '../search/search?fail=' + "true" + '&searchValue=' + options.searchValue
            })
          }
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log(app.globalData.hasUserInfo)
    //console.log(app.globalData.userInfo)
    //一定要在这里，每次展示页面时刷新，因为拉取信息是异步的
    if (needPullInfo && app.globalData.hasUserInfo && app.globalData.userInfo  && app.globalData.openid) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: app.globalData.hasUserInfo
      })
      needPullInfo = false;
    }
    if (!needPullInfo){
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: app.globalData.hasUserInfo
      })
    }
    //还原所有数据,组件复位
    createNavAni();
    var nav_tobe_restore = 'ani_nav_' + status;
    ani_content.left('0').step();
    this.setData({
      ani_content: ani_content.export(),
      reviewBackDisplay: 'none',
      submitBtnContent: submitcnt_submit,
      [nav_tobe_restore]: ani_nav_restore,
    })
    var ani_topup = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 100,
      delay: 0
    });
    ani_topup.top('0').scale(1).step();
    this.setData({
      ani_topup: ani_topup.export(),
      ani_nav_1: {},
      ani_nav_2: {},
      showNav: false,
    })
    this.setData({
      visitTime: visitTime,
    });
    status = 1;
    submit_text = '';
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  pullOpenid: function(){
    app.globalData.pullOpenid();
    if (!app.globalData.userInfo) {
      app.globalData['userInfo'] = {
        nickName: 'Anonymous',
      }
    }
  },
  scrollTopFun: function (e) {
    that = this;
    console.log(e.detail.scrollTop);
    if (e.detail.scrollTop > 130) {
      that.setData({
        storenameclass: 'storename-fix'
      });
    }
  },
  wxSearchTab: function () {
    wx.redirectTo({
      url: '../search/search'
    })
  },
  returnIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //商店分类
  searchType: function (e) {
    var searchType = e.currentTarget.id;
    wx.redirectTo({
      url: '../stores/stores?searchType=' + searchType
    })
  },
  findRoute: function (e) {
    var storename = e.currentTarget.dataset.storename;
    console.log(storename);
    wx.redirectTo({
      url: '../map/map?storename=' + storename,
    }) 
  },
  toggleColl: function (e) {
    var that = this;
    var op = (this.data.favToggle)?'del':'add';
    that.setData({
      coll_txt: fav_txt[2],
    })
    wx.request({
      url: config.service.collUrl,
      data: {
        openid: app.globalData['openid'],
        storeid: this.data.storeData[0].id,
        option: op,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var toggle = res.data[0]
        that.setData({
          favToggle: toggle,
          coll_txt: fav_txt[toggle],
        })
      }
    })
    
  },
  star: function (e) {
    var s = e.target.dataset.id;
    var rate = s * 1;
    createNavAni();
    var nav_tobe_emphsz = 'ani_nav_' + 1;
    this.setData({
      flag: rate, submitcolor: submitcolor_after, submitBtnContent: submitcnt_next,
      reviewSupport: level[rate], reviewSuportToggle: true, showNav: true,
      [nav_tobe_emphsz]: ani_nav_emphsz.export(),
    })
  },
  reviewIptFocusFun: function () {
    this.setData({
      reviewIptFocusBottom: '2px solid #2979ff'
    })
  },
  reviewCnfmFun: function (e){
    this.reviewIptBlurFun(e);
    this.submitBtnFun();
  },
  reviewIptBlurFun: function (e) {
    this.setData({
      reviewIptFocusBottom: '1px solid rgba(0,0,0,.12)'
    })
    submit_text = e.detail.value;
  },
  submitBtnFun: function () {
    if (status === 1 && this.data.flag >= 1) {
      status = 2;//准备提交
      this.setData({
        submitBtnContent: submitcnt_submit
      })
      createNavAni();
      var nav_tobe_emphsz = 'ani_nav_' + status;
      var nav_tobe_restore = 'ani_nav_' + (status - 1);
      ani_content.left('-750rpx').step();
      this.setData({
        ani_content: ani_content.export(),
        reviewBackDisplay: '',
        [nav_tobe_emphsz]: ani_nav_emphsz.export(),
        [nav_tobe_restore]: ani_nav_restore.export(),
      })
    }
    else if (this.data.flag === 0) {
      this.setData({
        reviewSupport: level[0], reviewSuportToggle: true
      })
    }
    else if (status == 2 && submit_text != '') {
      var that = this;
      //提交数据
      wx.request({
        url: config.service.commentUrl,
        method: 'POST',
        data: {
          openid: app.globalData.openid, 
          nick: app.globalData.userInfo.nickName,
          storeid: that.data.storeData[0].id, 
          rate: that.data.flag * 2, 
          comment: submit_text 
        },
        header: {
          //'content-type': 'application/json'
          'content-type': 'application/x-www-form-urlencoded'

        },
        success: function (res) {
          console.log(res.data);
          that.onLoad(glob_opts);
          if (res.data.length == 0) {
          }
        }
      })
      //动画
      var stars = this.data.flag * 2 + '';
      var txtbottom = level[6];
      ani_content.left('-1500rpx').step();
      var ani_topup = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 700,
        timingFunction: "ease",
        delay: 0
      });
      ani_topup.top('-65rpx').scale(1.2).step()
      this.setData({
        ani_content: ani_content.export(),
        reviewBackDisplay: 'none',
        reviewSupport: level[6],
        submitcolor: '#aaa',
        reviewtitle: convert[stars],
        ani_topup: ani_topup.export()
      })
    }
  },
  backBtnFun: function () {
    if (status === 2) {
      var nav_tobe_emphsz = 'ani_nav_' + (status - 1);
      var nav_tobe_restore = 'ani_nav_' + status;
      createNavAni();
      ani_content.left('0').step();
      this.setData({
        ani_content: ani_content.export(),
        reviewBackDisplay: 'none',
        submitBtnContent: submitcnt_next,
        [nav_tobe_emphsz]: ani_nav_emphsz.export(),
        [nav_tobe_restore]: ani_nav_restore.export(),
      })
      status = 1;
    }
  },
  loadMoreComments: function(){
    let that = this
    wx.request({
      url: config.service.loadComments,//这里填写后台给你的搜索接口
      method: 'post',
      data: {
        storeid: that.data.storeData[0].id,
        lastCommentId: that.data.storeData[2][that.data.storeData[2].length-1].id,
        amount: 50,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var newCmt = that.data.storeData[2]
        for(var i=0,len=res.data.length;i<len;i++){
          res.data[i].score = convert[res.data[i].score]
        }
        newCmt = newCmt.concat(res.data)
        that.setData({
          'storeData[2]': newCmt,
        })
      },
      fail: function (e) {
         wx.showToast({
           title: '网络异常！',
           duration: 2000
         });
       },
    })
  },
  preventTouchMove: function () { },
  itemtap: function (e) {
    var ani_popup = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 1,
    })
    this.data.esaterneggTapCnt ++;
    var indextxt = e.currentTarget.dataset.id
    var index = indextxt * 1
    if (indextxt === '+' && this.data.esaterneggTapCnt < 3)
      return
    if(!isNaN(index))
      var item = this.data.storeData[1][index];
    else
      var item = note_detail[indextxt];
    this.animation = ani_popup;
    ani_popup.scale(0.7).opacity(0).step();
    this.setData({
      showPopup: true,
      ani_popup: ani_popup.export(),
      popupImg: item.itempic,
      popupTitle: item.itemname,
      popupIntro: item.itemintro,
    })
    var ani_mask = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 150,
    })
    this.animation = ani_mask;
    ani_mask.opacity(0.7).step();
    ani_popup = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 200,
      timingFunction: "ease",
    })
    this.animation = ani_popup;
    ani_popup.scale(1).opacity(1).step();
    this.setData({
      ani_popup: ani_popup.export(),
      ani_mask: ani_mask.export(),
    })
  },
  closePopup: function () {
    var ani_popup = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 100,
      timingFunction: "ease",
    })
    this.animation = ani_popup;
    ani_popup.scale(0.6).opacity(0).step();
    var ani_mask = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 200,
    })
    this.animation = ani_mask;
    ani_mask.opacity(0).step();
    this.setData({
      ani_popup: ani_popup.export(),
      ani_mask: ani_mask.export(),
    })
    setTimeout(function () {
      this.setData({
        showPopup: false,
      })
    }.bind(this), 180)
  },
})