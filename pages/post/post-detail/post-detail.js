// 导入数据
var postData = require('../../../data/post-data.js').postData;
// 获取到小程序 App 实例(实例包含全局变量)
var app = getApp();
Page({
  data:{
    isPlayMusic: false
  },
  onLoad: function (options) {
    var postId = options.id;//上个页面传递过来的参数
    this.setData({
      postId:postId
    });
    // 获取对应id的数据
    var postInfo = postData[postId];
    // 数据绑定到data中
    this.setData({
      postInfo: postInfo
    });
    // 阅读数量的变化并存入缓存中
    var postsView = wx.getStorageSync('post_view');
    if(postsView) {
      var targetView = postsView[postId];
      if (targetView) {
        targetView++;
        postsView[postId] = targetView;
      }else {
        postsView[postId] = 1;
      }
      wx.setStorageSync('post_view', postsView);
    }else {
      var postsView = {};
      postsView[postId] = 1;
      wx.setStorageSync('post_view', postsView);
    }
    // 进入页面获取收藏的缓存
    var postsCollection = wx.getStorageSync('post_collected');
    if(postsCollection) {
      var targetCollection = postsCollection[postId] || false;
      this.setData({
        collected:targetCollection
      });
    }else {
      var postsCollection = {};
      postsCollection[postId] = false;
      wx.setStorageSync('post_collected', postsCollection);
    }

    // 获取全局变量中音乐播放的标识，如果是true，说明音乐之前就是播放状态，再次进入页面还应该是播放状态
    // 还必须是对应id的页面
    if (app.globalData.g_isPlayMusic && app.globalData.g_currentPage == postId) {
      this.setData({
        isPlayMusic: true
      });
    }

    // 监听音乐播放暂停
    var self = this;
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.onPlay(function () {
      // 设置全局变量中音乐播放的标识为true
      app.globalData.g_isPlayMusic = true;
      // 记录当前播放音乐的页面
      app.globalData.g_currentPage = self.data.postId;
      self.setData({
        isPlayMusic: true
      })
    });
    // 暂停
    backgroundAudioManager.onPause(function () {
      // 设置全局变量中音乐播放的标识为false
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentPage = null;
      self.setData({
        isPlayMusic: false
      })
    });
    //播放完毕停止 
    backgroundAudioManager.onStop(function () {
      // 设置全局变量中音乐播放的标识为false
      app.globalData.g_isPlayMusic = false;
      app.globalData.g_currentPage = null;
      self.setData({
        isPlayMusic: false
      })
    });
  },
  // 收藏切换
  onCollectionTap: function(event) {
    var postsCollection = wx.getStorageSync('post_collected');
    var targetCollected = postsCollection[this.data.postId];
    targetCollected = !targetCollected;
    postsCollection[this.data.postId] = targetCollected;
    // 点击切换后添加相应提示并执行数据的变化
    this.onShowToast(targetCollected, postsCollection);
    
  },
  onShowModal: function (targetCollected, postsCollection) {
    var self = this;
    // 显示模态对话框(showModal)
    wx.showModal({
      title: '收藏',
      content: targetCollected ? '收藏改文章？' : '取消收藏该文章？',
      success(res) {
        // 点击确定后执行
        if (res.confirm) {
          // 更新缓存
          wx.setStorageSync('post_collected', postsCollection);
          // 设置collected
          self.setData({
            collected: targetCollected
          });
        }
      }
    })
  },
  onShowToast: function (targetCollected, postsCollection) {
    // 更新缓存
    wx.setStorageSync('post_collected', postsCollection);
    // 设置collected
    this.setData({
      collected: targetCollected
    });
    // 显示消息提示框(showToast)
    wx.showToast({
      title: targetCollected ? '收藏成功' : '取消成功',
      icon:'success'
    })
  },
  // 分享
  onShareTap: function () {
    var list = ['分享到朋友圈', '分享到空间', '分享到微博', '分享给微信好友'];
    // 显示操作菜单(showActionSheet)
    wx.showActionSheet({
      itemList: list,
      itemColor: '#333',
      success(res) {
        wx.showToast({
          title: list[res.tapIndex],
        })
      }
    })
  },
  // 音乐播放切换
  onMusicTap: function(event) {
    // getBackgroundAudioManager() 背景音频
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    // 获取对应id的数据
    var targetData = postData[this.data.postId];
    if(this.data.isPlayMusic) { 
      // 暂停播放
      backgroundAudioManager.pause();
      this.setData({
        isPlayMusic: false
      });
    }else {
      backgroundAudioManager.title = targetData.music.title;
      backgroundAudioManager.singer = targetData.music.singer;
      backgroundAudioManager.coverImgUrl = targetData.music.coverTmgUrl;
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src = targetData.music.src;
      this.setData({
        isPlayMusic: true
      });
    }
  }
})