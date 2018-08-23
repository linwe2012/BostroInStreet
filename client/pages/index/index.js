//index.js
const app = getApp();
var config = require('../../config')
var avatarUploaded = false;
var pullOpenid =  function(){
  wx.login({
    success: function (res) {
      var code = res.code;
      console.log(code);
      if (code) {
        wx.request({
          url: config.service.loginUrl,//服务器的地址，现在微信小程序只支持https请求，所以调试的时候请勾选不校监安全域名
          data: {
            code: code,
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data);
            wx.setStorageSync('openid', res.data.openid);
            //wx.setStorageSync('name', res.data.name);//将获取信息写入本地缓存，暂时不需要这些信息
            //wx.setStorageSync('imgUrl', res.data.imgurl);
            //wx.setStorageSync('sex', res.data.sex);
            app.globalData['openid'] = res.data.openid;
            uploadAvatar();
          }
        })
      } else {
        console.log('fetch code failed')
      }
    },
    fail: function (error) {
      console.log('login failed ' + error);
    }
  })
}
function afterPullUserInfo(info){
  app.globalData['hasUserInfo'] = true
  app.globalData['userInfo'] = info
  uploadAvatar();
}
app.globalData.pullOpenid = pullOpenid;
function uploadAvatar(){
    if (app.globalData.openid && !avatarUploaded && app.globalData.userInfo) {
    var avatarUrl = app.globalData.userInfo.avatarUrl
    console.log('type '+typeof avatarUrl+' uploadAvatar::avatarUrl:' + avatarUrl)
    avatarUploaded = true;
    wx.request({
      url: config.service.avatarUpload,
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: app.globalData.openid,
        avatarUrl: avatarUrl,
      },
      success:function(res){
        console.log(res);
      }
    })
  }
}
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //searchValue: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../users/users'
    })
  },
  // 搜索页面跳回
  onLoad: function (options) {
    let that = this
    if (options && options.searchValue) {
      this.setData({
        searchValue: "搜索：" + options.searchValue
      });
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      afterPullUserInfo(app.globalData.userInfo);
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(res);
        app.globalData['userInfo'] = res.userInfo;
        afterPullUserInfo(res.userInfo);
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
          afterPullUserInfo(res.userInfo);
        }
      })
    }
    try {
      var openid = wx.getStorageSync('openid')
      if (openid) {
        app.globalData['openid'] = openid;
        console.log('get openid from storage: '+openid);
        uploadAvatar();
      }
      else{
        pullOpenid();
      }
    } catch(e) {
       // Do something when catch error
      pullOpenid();
    }
    wx.request({
      url: config.service.geticonUrl,
      success: function (res) {
        that.setData({
          icon: res.data,
        })
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    });
    afterPullUserInfo(res.userInfo);
  },

  // 搜索入口  
  wxSearchTab: function () {
    wx.redirectTo({
      url: '../search/search'
    })
  },
  //商店分类
  searchType: function(e){
    var searchType=e.currentTarget.id;
    wx.redirectTo({
      url: '../stores/stores?searchType=' + searchType
    })
  }


})
  
