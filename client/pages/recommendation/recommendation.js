const app = getApp();
var config = require('../../config')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    recData:[],
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: config.service.recommendUrl,
      method: 'POST',
      //data: { str: options.searchType },
      header: {
        //'content-type': 'application/json'
        'content-type': 'application/x-www-form-urlencoded'

      },
      success: function (res) {
        for (var i = 0, len = res.data.length; i < len; i++) {
          res.data[i].score = Math.round(res.data[i].score * 10) / 10;
        }
        that.setData({
          recData: res.data
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
    //填充店铺数据
    //this.setData({storesList: array}) 

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }




  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: '../search/search'
    })
  },
  intoStore: function (e) {
    var value = e.currentTarget.dataset.id;
    console.log(value);
    wx.redirectTo({
      url: '../results/results?searchValue=' + value
    })
  },
  returnIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  }


})
