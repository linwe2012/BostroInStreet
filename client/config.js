/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'Protected';

var config = {

  // 下面的地址配合云端 Demo 工作
  service: {
    host,
    // 上传图片接口
    uploadUrl: `${host}/weapp/upload`,

    //拉去店铺结果
    resultUrl: `${host}/weapp/results.php`,

    // 收取评论地址
    commentUrl: `${host}/weapp/recvComment.php`,
	
	  //图片地址
	  imageUrl: `${host}/weapp/assets/img/`,

    //拉去全部店铺
    storeUrl: `${host}/weapp/stores.php`,

    //!!!!保密
    loginUrl: `${host}/weapp/NWdj_zKuXTpcw-iqV_~(I(ZmTwgJXdAH3hk-gwNYbE.php`,

    //!!!!保密
    avatarUpload: `${host}/weapp/VFwjrXp2nuBt1USwmmb.php`,

    //拉取当前用户信息
    usrUrl: `${host}/weapp/usrComment.php`,

    //获取目的地经纬度
    desUrl: `${host}/weapp/des.php`,

    //删除评论
    delComment: `${host}/weapp/delComments.php`,

    //flairsUrl
    flairsUrl: `${host}/weapp/assets/flairs/`,

    //poll info about collection
    collUrl: `${host}/weapp/favQuery.php`,

    //recommendation
    recommendUrl: `${host}/weapp/recommend.php`,

    //获取首页图标
    geticonUrl: `${host}/weapp/geticon.php`,

    //获取收藏的店铺
    usrcollUrl: `${host}/weapp/usrColl.php`,
    //删除收藏的店铺（使用id删除）
    delcollsUrl: `${host}/weapp/delColls.php`,

    //加载更多评论-从id开始以及storeid以及数量
    loadComments: `${host}/weapp/loadComments.php`,
  },

  //Urls exposed to users
  openUrl:{
    host,
    register: `${host}/manage/register.html`
  },

  //keys
  key:{
    amap:{
      weapp: 'Protected',
    }
  }
};

module.exports = config;