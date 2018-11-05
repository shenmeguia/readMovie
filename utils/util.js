// 根据数据返回星星数组的方法 例如[1,1,1,2,0]代表3.5颗星  1表示全星，2表示半星，0表示没星
function convertToStarsArray(stars) {
  var starArr = [];
  // 因为stars是两位数，需要先除10
  var score = stars / 10;
  // 判断是否有小数位
  var decimal = score % 1 !== 0;
  // 整数
  var integer = Math.floor(score);
  for (var i = 0; i < integer; i++) {
    starArr.push(1);
  }
  if (decimal) {
    starArr.push(2);
  }
  // 剩下就是没星添加0
  while (starArr.length < 5) {
    starArr.push(0);
  }
  return starArr;
};

function http(url, callback) {
  wx.request({
    url: url,
    data: {},
    method: 'GET',
    header: {
      'content-type': 'application/json'
    },
    success(res) {
      callback(res.data);
    }
  })
};

function convertToCastString(casts) {
  var castsName = '';
  casts.forEach(function(item) {
    castsName += item.name + '/';
  });
  return castsName.substring(0,castsName.length-1);
};

function convertToCastInfos(casts) {
  var castsArr = [];
  casts.forEach(function(item) {
    var obj = {
      name: item.name,
      img: item.avatars ? item.avatars.large : ''
    }
    castsArr.push(obj);
  });
  return castsArr;
}
module.exports = {
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos
}