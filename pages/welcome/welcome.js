Page({
  jump:function() {
    // 跳转到 tabBar 页面
    wx.switchTab({
      url: '../post/post',
    })
  }
})