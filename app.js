App({
  // 自定义的全局变量
  // 全局的 getApp() 函数可以用来获取到小程序 App 实例
  globalData:{
    g_isPlayMusic: false,//音乐播放暂停标识
    g_currentPage: null, //当前播放音乐的页面(页面的id)
    doubanBase:'http://t.yushu.im' //豆瓣api默认前缀
  }
})
