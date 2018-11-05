// 导入数据
var postData = require('../../data/post-data.js').postData;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },
  // 页面显示时需要重新获取数据，因为view是变化的
  onShow: function () {
    this.getData();
  },
  // 获取数据并绑定到data中的方法
  getData: function () {
    // 读取缓存中的view
    var postsView = wx.getStorageSync('post_view');
    postData.forEach(function (item, i) {
      item.view = postsView[i] || 0;
    });
    this.setData({
      post_msg: postData
    });
  },
  onPostTap: function (event) {
    var postid = event.currentTarget.dataset.postid;
    // 打开新页面并通过？传递参数
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid
    })
  },
  onSwiperTap: function(event) {
    var postid = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postid,
    })
  }
})