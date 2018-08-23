var config = require('../../config.js')
var amapFile = require('../../libs/amap-wx.js');
var storename;
var longitude;
var latitude;
var steps = [];
Page({
  data: {
    markers: [{
      iconPath: "../../icon/mapicon_navi_s.png",
      id: 0,
      latitude: 39.989643,
      longitude: 116.481028,
      width: 23,
      height: 33
    }, {
      iconPath: "../../icon/mapicon_navi_e.png",
      id: 0,
      latitude: 39.90816,
      longitude: 116.434446,
      width: 24,
      height: 34
    }],
    distance: '',
    duration: '',
    polyline: []
  },
  onLoad: function (options) {
    var that = this;
    storename = options.storename;
    console.log(storename);
    wx.request({
      url: config.service.desUrl,//这里填写后台给你的搜索接口
      //method: 'post',
      data: { str: storename },

      header: {
        //'content-type': 'application/x-www-form-urlencoded'
        'content-type': 'application/json'
      },
      success: function (res) {
        var desaddr = res.data.addr;
        var deslongitude = res.data.longitude;
        var deslatitude = res.data.latitude;
        longitude = deslongitude;
        latitude = deslatitude;
        that.setData({
          'markers[1].longitude': deslongitude,
          'markers[1].latitude': deslatitude
        })
        var key = config.key.amap.weapp;
        var myAmapFun = new amapFile.AMapWX({ key: config.key.amap.weapp });
        wx.getLocation({
          type: 'gcj02', //返回可以用于wx.openLocation的经纬度
          success: function (result) {
            var fromlatitude = result.latitude
            var fromlongitude = result.longitude
            that.setData({
              'markers[0].longitude': fromlongitude,
              'markers[0].latitude': fromlatitude
            })
            //连接字符串
            var arr1 = new Array(); arr1.push(fromlongitude); arr1.push(fromlatitude); var fromstr = arr1.join(",");
            var arr2 = new Array(); arr2.push(deslongitude); arr2.push(deslatitude); var desstr = arr2.join(",");
            myAmapFun.getRidingRoute({
              origin: fromstr,
              destination: desstr,
              success: function (data) {
                var points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                  steps = data.paths[0].steps;
                  that.setData({
                    "steps": data.paths[0].steps,
                  })
                  console.log(steps);
                  for (var i = 0; i < steps.length; i++) {
                    var poLen = steps[i].polyline.split(';');
                    for (var j = 0; j < poLen.length; j++) {
                      points.push({
                        longitude: parseFloat(poLen[j].split(',')[0]),
                        latitude: parseFloat(poLen[j].split(',')[1])
                      })
                    }
                  }
                }
                that.setData({
                  polyline: [{
                    points: points,
                    color: "#0091ff",
                    width: 6
                  }]
                });
                if (data.paths[0] && data.paths[0].distance) {
                  that.setData({
                    distance: data.paths[0].distance + '米'
                  });
                }

                if (data.paths[0] && data.paths[0].duration) {
                  that.setData({
                    duration: '时间约' + Math.round(parseInt(data.paths[0].duration) / 60) + '分'
                  });
                }

              },
              fail: function (info) {
                console.log('fail')
              }
            })
          }
        })

      },
      fail: function () {
        console.log('des.php fail');
      }
    })


  },
  goDetail: function () {
    console.log(steps)
    steps = JSON.stringify(steps);
    wx.navigateTo({
      url: '../navigation_detail/navigation_detail?steps=' + steps
    })
  },
  goToCar: function (e) {
    wx.redirectTo({
      url: '../map/map?storename=' + storename
    })
  },
  goToBus: function (e) {
    wx.redirectTo({
      url: '../navigation_bus/navigation_bus?storename=' + storename
    })
  },
  goToRide: function (e) {
    wx.redirectTo({
      url: '../navigation_ride/navigation_ride?storename=' + storename
    })
  },
  goToWalk: function (e) {
    wx.redirectTo({
      url: '../navigation_walk/navigation_walk?storename=' + storename
    })
  },
  returnStore: function (e) {
    wx.redirectTo({
      url: '../results/results?searchValue=' + storename,
    })
  }
})