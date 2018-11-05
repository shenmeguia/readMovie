var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    movieShow: true,
    searchShow: false,
    searchValue: '',
    totalCount: 0,
    isFirst: true
  },
  onLoad: function(event) {
    // 正在热映接口
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters?start=0&count=3';
    // 即将上映接口
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon?start=0&count=3';
    // top250接口
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250?start=0&count=3';
    this.getMovieListData(inTheatersUrl, 'inTheaters');
    this.getMovieListData(comingSoonUrl, 'comingSoon');
    this.getMovieListData(top250Url, 'top250');
  },
  // 获取数据方法      参数typekey区分不同接口
  getMovieListData: function(url, typekey) {
    var self = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        self.processDoubanData(res.data, typekey);
      }
    })
  },
  // 数据处理和绑定方法
  processDoubanData: function(movieData, typekey) {
    var movies = [];
    var subjects = movieData.subjects;
    subjects.forEach(function(item) {
      var temp = {
        title: item.title,
        average: item.rating.average,
        coverageUrl: item.images.large,
        movieId: item.id,
        stars: util.convertToStarsArray(item.rating.stars)
      };
      movies.push(temp);
    });
    var totalMovies = [];
    if (!this.data.isFirst && typekey == 'searchResult') {
      totalMovies = this.data.searchResult.movies.concat(movies);
    } else if (this.data.isFirst && typekey == 'searchResult') {
      this.data.isFirst = false;
      totalMovies = movies;
    } else {
      totalMovies = movies;
    }
    var readyData = {};
    // 根据接口类型保存对应的数据
    readyData[typekey] = {
      categoryTitle: typekey == 'inTheaters' ? '正在热映' : (typekey == 'comingSoon' ? '即将上映' : '豆瓣top250'),
      movies: totalMovies
    }
    this.setData(readyData);
    if (typekey == 'searchResult' && movies != '') {
      this.data.totalCount += 10;
    }
    setTimeout(function() {
      wx.hideNavigationBarLoading();
    }, 500);
  },
  // 更多跳转
  openMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },
  // 搜索框聚焦事件 显示搜索页面隐藏电影页面
  onBindFocus: function() {
    this.setData({
      movieShow: false,
      searchShow: true
    });
  },
  // 关闭搜索页
  onCloseSearch: function() {
    this.setData({
      movieShow: true,
      searchShow: false,
      searchValue: '',
      searchResult: {}
    });
  },
  // 搜索事件
  onBindConfirm: function(event) {
    var value = event.detail.value;
    this.setData({
      searchValue: value,
      totalCount: 0,
      searchResult: {},
      isFirst: true
    });
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + value + '&count=10&start=' + this.data.totalCount;
    this.getMovieListData(searchUrl, 'searchResult');
  },
  // 上拉加载更多
  onBindScrollLower: function() {
    if (this.data.searchValue == '') {
      return;
    }
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + this.data.searchValue + '&count=10&start=' + this.data.totalCount;
    this.getMovieListData(searchUrl, 'searchResult');
    wx.showNavigationBarLoading();
  },
  // 跳转电影详情页面
  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
  }
})