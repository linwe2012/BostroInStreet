const app = getApp();
var config = require('../../config');
var usrCoSuccess = false;
var ScrWidth = wx.getSystemInfoSync().windowWidth
var allowDel = false;
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
//here is all you need to add if you have a new nav
//globle variables capitalize 1st letter & do not use plural
const NavigationToggle = { history: 0, collection: 1 }
const DelService  = ['delComment', 'delcollsUrl']//delete service name
const DataService = ['usrUrl','usrcollUrl']
const DataName = ['commentData', 'collectionData']
const NavigationClass = ['nav', 'nav']
const Tip = 
  [['▼ 点击评论进入店铺、长按删除评论', '▼ 滑动以删除'],
    ['▼ 点击收藏进入店铺、长按取消收藏', '▼ 滑动以删除']]
const TipStyle = ['','background:#fff3e0;color:#cbae82;']
var StartX
var ToBeDel = [[],[]]
function ClearToBeDel(whichone){
  var m_tobedel = ToBeDel[whichone]
  if(!m_tobedel.length) return;
  var m_service = DelService[whichone]
  wx.request({
    url: config.service[m_service],//这里填写后台给你的搜索接口
    method: 'post',
    data: { ids: JSON.stringify(m_tobedel) },
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      ToBeDel[whichone] = res.data//服务器删除失败的
      console.log(res.data)
    },
    fail: function (e) {
      console.log(e)
    },
  });
}
function CalOpacity(x) {
  if (x < 0) {
    x = -x;
  }
  var a = x / ScrWidth;
  return 1 - a*a*2;
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:'',
    hasUserInfo:false,
    demo_avatar: config.service.imageUrl + 'demo_avatar.jpg',
    panel_bkground: config.service.imageUrl + 'fooddoodle1.jpg',
    commentData:'',
    toast:'Swipe to Delete',
    showtoast:true,
    tips: Tip[0][0],
    tipStyle: '',
    navToggle: 0,
    navClass: ['nav-active', 'nav'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    wx.request({
      url: config.service.usrUrl,//这里填写后台给你的搜索接口
      //method: 'post',
      data: { str: app.globalData['openid'] },
      header: {
        //'content-type': 'application/x-www-form-urlencoded'
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.length > 0) {
          var data = res.data;
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].score = convert[res.data[i].score]
            res.data[i]['txtStyle'] = 'left:0px;opacity:1'
            res.data[i]['ani'] = {}
          }
          that.setData({
            commentData: res.data
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
    wx.request({
      url: config.service.usrcollUrl,//这里填写后台给你的搜索接口
      //method: 'post',
      data: { openid: app.globalData['openid'] },
      header: {
        //'content-type': 'application/x-www-form-urlencoded'
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data);
        if (res.data.length > 0) {
          var data = res.data;
          for (var i = 0; i < res.data.length; i++) {
            res.data[i]['txtStyle'] = 'left:0px;opacity:1';
            res.data[i]['ani'] = {};
          }
          that.setData({
            collectionData: res.data

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
    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: app.globalData.hasUserInfo,
    })
    allowDel = false
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    ClearToBeDel(0)
    ClearToBeDel(1)
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
  intoStore: function (e) {
    var value = e.currentTarget.dataset.itemname;
    console.log(value);
    wx.redirectTo({
      url: '../results/results?searchValue=' + value.replace('&', '%26')
    })
  },
  changenav: function(e){
    ClearToBeDel(0)
    ClearToBeDel(1)
    var whichone = NavigationToggle[e.currentTarget.dataset.name]
    var [...navclass] = NavigationClass;
    navclass[whichone] = 'nav-active';
    this.setData({
      navToggle: whichone,
      navClass: navclass,
      tips: Tip[whichone][0],
      tipStyle: TipStyle[0],
    })
    allowDel = false;
  },
  touchS: function (e) {
    if (e.touches.length == 1 && allowDel) {//I don't know what it is for, checking length makes no sense
      StartX = e.touches[0].clientX;
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1 && allowDel) {
      var MoveX = e.touches[0].clientX - StartX
      var opacity = CalOpacity(MoveX)
      var txtStyle = 'left:'+MoveX+'px;'+'opacity:'+opacity+';'
      var index = e.currentTarget.dataset.index
      var whichone = this.data.navToggle
      var dataname = DataName[whichone]
      var key = dataname + '['+index+'].txtStyle'
      this.setData({
        [key]: txtStyle,
      })
    }
  },
  touchE: function(e){
    if (e.changedTouches.length == 1 && allowDel) {
      var MoveX = (e.changedTouches[0].clientX - StartX) * 2.5;
      var flag = '100vw';
      if (MoveX < 0){
        flag = '-100vw';
        MoveX = -MoveX;
      } 
      var index = e.currentTarget.dataset.index
      var whichone = this.data.navToggle
      var dataname = DataName[whichone]
      var key = dataname +'[' + index + '].ani'
      var txtkey = dataname + '[' + index + '].txtStyle'
      console.log(ToBeDel);
      var ani = wx.createAnimation({
        transformOrigin: "50% 50%",
        duration: 300,
        timingFunction: 'ease',
      })
      if (MoveX < ScrWidth){
        ani.left(0).opacity(1).step()
      }
      else {
        ani.left(flag).opacity(0).step()
        setTimeout(function () {
          var fixani = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 1,
          })
          fixani.left(0).opacity(1).step()
          this.setData({
            [key]: fixani.export(),
            [txtkey]: 'display:none;',
          })
        }.bind(this), 350);
        ToBeDel[whichone].push(this.data[dataname][index].id)
      }
      this.setData({
        [key]: ani.export(),
      })
    }
    
  },
  toggleDel(){
    var tip,tipStyle;
    var which = allowDel?0:1;
    tip = Tip[this.data.navToggle][which]
    tipStyle = TipStyle[which]
    setTimeout(function(){
      allowDel = !allowDel
      this.setData({
        tips:tip,
        tipStyle: tipStyle,
      })
    }.bind(this),400)
  }
})