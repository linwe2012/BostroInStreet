//index.js
const app = getApp();
var amapFile = require('../../libs/amap-wx.js')
var config = require('../../config')
var searchType;
const ColorRef = {
  'default':'#29b6f6',
  score: '#ab47bc',
  hot: '#ec407a',
  distance: '#00acc1',
}
Page({
  data: {
    sortdefault:'sort__item__active',
    sortscore:'sort__item',
    sortdistance: 'sort__item',
    sorthot: 'sort__item',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    storesList: []
    //searchValue: '',
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  // 搜索页面跳回
  onLoad: function (options) {
    var that=this;
    if (options && options.searchType) {
      searchType = options.searchType;
      wx.request({
        url: config.service.storeUrl,
        method: 'POST',
     
        data: { str: options.searchType,
        openid: app.globalData.openid},
        header: {
          //'content-type': 'application/json'
          'content-type': 'application/x-www-form-urlencoded'
        
        },
        success: function (res) {
           console.log(res.data);      
          that.setData({
            storesList:res.data
          })
          for (var i = 0, len = that.data.storesList.length; i < len; i++) {
            var key = 'storesList[' + i + '].score';
            var score = Math.round(that.data.storesList[i].score * 10) / 10;
            that.setData({
              [key]: score
            });
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
    //填充店铺数据
    
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
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: ColorRef['default']
    })
  },
  onHide: function(){
    wx.setNavigationBarColor({
      frontColor: 'white',
      backgroundColor: '#e8e8e8'
    })
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
    var mvalue = e.currentTarget.dataset.itemname;
    var value = mvalue.replace('&','%26')
    console.log(value);
    wx.redirectTo({
      url: '../results/results?searchValue=' + value
    })
  },
  returnIndex: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  sortStore: function(e){
    var that=this;
    var value = e.currentTarget.dataset.name;
    var color = ColorRef[value]
    wx.setNavigationBarColor({
      frontColor:'#ffffff',
      backgroundColor: color
    })
    this.setData({
      nav_bgcolor: color,
    })

    //改变按钮选中
    if(value=='default'){
      that.setData({
        sortdefault: 'sort__item__active',
        sortscore: 'sort__item',
        sortdistance: 'sort__item',
        sorthot: 'sort__item',
      })
    }else if(value=='score'){
      that.setData({
        sortdefault: 'sort__item',
        sortscore: 'sort__item__active',
        sortdistance: 'sort__item',
        sorthot: 'sort__item',
      })
    }else if(value==='hot'){
      that.setData({
        sortdefault: 'sort__item',
        sortscore: 'sort__item',
        sortdistance: 'sort__item',
        sorthot: 'sort__item__active',
      })
    }else{
      that.setData({
        sortdefault: 'sort__item',
        sortscore: 'sort__item',
        sortdistance: 'sort__item__active',
        sorthot: 'sort__item',
      })
    }
    //改变排序
    if (value === 'default') { 
      console.log(searchType);
      wx.request({
        url: config.service.storeUrl,
        method: 'POST',
        data: { str: searchType },
        header: {
          //'content-type': 'application/json'
          'content-type': 'application/x-www-form-urlencoded'

        },
        success: function (res) {
          console.log(res.data);
          if (res.data.length == 0) {
            // that.setData({
            //    centent_Show: false,
            //  });
          }
          that.setData({
            storesList: res.data
          })
          for (var i = 0, len = that.data.storesList.length; i < len; i++) {
            var key = 'storesList[' + i + '].score';
            var score = Math.round(that.data.storesList[i].score * 10) / 10;
            that.setData({
              [key]: score
            });
          }
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });
    }else if(value==='score'){
      console.log(searchType);
      wx.request({
        url: config.service.storeUrl,
        method: 'POST',
        data: { str: searchType },
        header: {
          //'content-type': 'application/json'
          'content-type': 'application/x-www-form-urlencoded'

        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            storesList: res.data
          })
          for (var i = 0, len = that.data.storesList.length; i < len; i++) {
            var key = 'storesList[' + i + '].score';
            var score = Math.round(that.data.storesList[i].score * 10) / 10;
            that.setData({
              [key]: score
            });
          }
          var list = that.data.storesList;
          console.log(list.length);
          for(var i=0;i<list.length-1;i++){
            var max=list[i];
            var index=i;
            for(var j=i+1;j<list.length;j++){
              if (list[j].score>max.score){
                max = list[j];
                index=j;
              }
            }
            var temp=list[index];
            list[index]=list[i];
            list[i]=temp;
          }
          that.setData({
            storesList:list,
          })
         
          
         
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });
    }else if(value==='hot'){
      console.log(searchType);
      wx.request({
        url: config.service.storeUrl,
        method: 'POST',
        data: { str: searchType },
        header: {
          //'content-type': 'application/json'
          'content-type': 'application/x-www-form-urlencoded'

        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            storesList: res.data
          })
          for (var i = 0, len = that.data.storesList.length; i < len; i++) {
            var key = 'storesList[' + i + '].score';
            var score = Math.round(that.data.storesList[i].score * 10) / 10;
            that.setData({
              [key]: score
            });
          }
          var list = that.data.storesList;
          console.log(list.length);
          for (var i = 0; i < list.length - 1; i++) {
            var max = list[i];
            var index = i;
            for (var j = i + 1; j < list.length; j++) {
              if (list[j].comments > max.comments) {
                max = list[j];
                index = j;
              }
            }
            var temp = list[index];
            list[index] = list[i];
            list[i] = temp;
          }
          console.log(list);
          that.setData({
            storesList: list,
          })
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });
    }else{
      console.log(searchType);
      wx.request({
        url: config.service.storeUrl,
        method: 'POST',
        data: { str: searchType },
        header: {
          //'content-type': 'application/json'
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res.data);
          that.setData({
            storesList: res.data
          })
          for (var i = 0, len = that.data.storesList.length; i < len; i++) {
            var key = 'storesList[' + i + '].score';
            var score = Math.round(that.data.storesList[i].score * 10) / 10;
            that.setData({
              [key]: score
            });
          }
          var list = that.data.storesList;
          console.log(list.length);
          //获取距离
            wx.getLocation({
              type: 'gcj02', //返回可以用于wx.openLocation的经纬度
              success: function (result) {
                var fromlatitude = result.latitude
                var fromlongitude = result.longitude
                wx.request({
                  url: config.service.getdisUrl,
                   data: {
                     fromlat: fromlatitude,
                     fromlon: fromlongitude,
                     str: searchType,
                   },
                  header: {
                    //'content-type': 'application/x-www-form-urlencoded'
                    'content-type': 'application/json'
                  },
                  success: function(data){
                    for (var i = 0; i < list.length; i++){
                      list[i].distance=data.data[i].distance
                    }
                    
                    //按照距离排序
                    for (var i = 0; i < list.length - 1; i++) {
                      var min = list[i];
                      var index = i;
                      for (var j = i + 1; j < list.length; j++) {
                        if (Number(list[j].distance) < Number(min.distance)) {
                          min = list[j];
                          index = j;
                        }
                      }
                      var temp = list[index];
                      list[index] = list[i];
                      list[i] = temp;
                    }
                    console.log(list);
                    that.setData({
                      storesList: list,
                    })

                  }

                })
                

 
              }
            });
          
          
          
          
        },
        fail: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        },
      });
    }

  }

})
