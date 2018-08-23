var WxSearch = require('../../wxSearchView/wxSearchView.js');
Page({
  data: {
    searchMsg: '',
    displaySearchMsg:false,
  },
  onLoad: function (options) {
    // 2 搜索栏初始化
    var that = this;
    var msg = ''
    var displaymsg = false
    if (options && options.fail){
      msg = '⚠ 我们找不到' + options.searchValue+'，请试试搜索热点吧'
      displaymsg = true
    }
    this.setData({
      searchMsg: msg,
      displaySearchMsg: displaymsg,
    })
    WxSearch.init(
      that,  // 本页面一个引用
      ['奈雪', 'LadyM', "乐乐茶", "神隐拉面", '喜茶'], // 热点搜索推荐，[]表示不使用
      ['奈雪', 'LadyM', '乐乐茶', "神隐拉面"],// 搜索匹配，[]表示不使用
      that.mySearchFunction, // 提供一个搜索回调函数
      that.myGobackFunction //提供一个返回回调函数
    );
    
  },

  // 3 转发函数，固定部分，直接拷贝即可
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 4 搜索回调函数  
  mySearchFunction: function (value) {
    // do your job here
    // 示例：跳转
    wx.redirectTo({
      url: '../results/results?searchValue=' + value.replace('&', '%26')
    })
  },

  // 5 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 示例：返回
    // 
    wx.switchTab({
      url: '../index/index',
      success: function (e) {
        var page = getCurrentPages().pop();
        console.log(page);
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  }

})