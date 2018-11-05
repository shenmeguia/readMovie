var app = getApp();
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movies: [],
    category: '',
    requestUrl: '',
    totalCount: 0,
    isFirst: true //用来标记是不是第一次加载数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      category: category
    });
    var apiUrl = '';
    switch (category) {
      case '正在热映':
        apiUrl = app.globalData.doubanBase + '/v2/movie/in_theaters?count=10';
        break;
      case '即将上映':
        apiUrl = app.globalData.doubanBase + '/v2/movie/coming_soon?count=10';
        break;
      case '豆瓣top250':
        apiUrl = app.globalData.doubanBase + '/v2/movie/top250?&count=10';
        break;
    };
    this.setData({
      requestUrl: apiUrl
    });
    util.http(apiUrl, this.processDoubanData);
  },
  // 数据处理和绑定方法
  processDoubanData: function (movieData) {
    var movies = [];//每次加载的数据
    var subjects = movieData.subjects;
    subjects.forEach(function (item) {
      var temp = {
        title: item.title,
        average: item.rating.average,
        coverageUrl: item.images.large,
        movieId: item.id,
        stars: util.convertToStarsArray(item.rating.stars)
      };
      movies.push(temp);
    });
    var totalMovies = [];//总共的数据
    // 判断是不是第一次加载数据，不是第一次需要累加所有的数据
    if (this.data.isFirst) {
      totalMovies = movies;
      this.data.isFirst = false;
    } else {
      totalMovies = this.data.movies.concat(movies);
    }
    this.setData({
      movies: totalMovies
    });
    // 请求数据的start每请求一次加十
    if(movies != '') {
      this.data.totalCount += 10;
    }
    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 500);
  },
  // 在页面准备完成动态设置当前页面的标题
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.category,
    })
  },
  // 滚动到底部加载更多
  onReachBottom: function () {
    // 滚动到底就再请求一次数据
    util.http(this.data.requestUrl + '&start=' + this.data.totalCount, this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    this.data.movies = [];
    this.data.isFirst = true;
    this.data.totalCount = 0;
    util.http(this.data.requestUrl, this.processDoubanData);
  },
  // 跳转电影详情页面
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  }
})