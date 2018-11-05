var app = getApp();
import {Movie} from 'class/movie.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var movieId = options.id;
    var movieUrl = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    var movie = new Movie(movieUrl);
    var self = this;
    movie.getMovieData(function(movie) {
      self.setData({
        movie:movie
      })
    })
  },
  // 点击图片全屏预览图片
  onPreviewImage:function(event) {
    var img = event.currentTarget.dataset.img;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  }
})