var allData = {
  "state":"0",
  "data":[
      {
          "a":"独木造高楼， 没瓦没砖头， 人在水下走， 水在人上流（打一用具）",
          "b":"雨伞"
      },
      {
          "a":"他有你没有，地有天没有（打一字）",
          "b":"也"
      },
      {
          "a":"运动会上都有（打一字）",
          "b":"云"
      },
      {
          "a":"大雨下在横山上（打一字）",
          "b":"雪"
      },
      {
          "a":"天黑之前闲不着（打三字常用语）",
          "b":"白忙活"
      },
      {
          "a":"早不说晚不说（打一字）",
          "b":"许"
      },
      {
          "a":"一个黑孩， 从不开口， 要是开口， 掉出舌头。  （打一植物果实）",
          "b":"瓜子"
      },
      {
          "a":"两只小口袋， 天天随身带， 要是少一只， 就把人笑坏。 （打一物）",
          "b":"袜子"
      },
      {
          "a":"人脱衣服， 它穿衣服， 人脱帽子， 它戴帽子。 （打一物）",
          "b":"衣帽架"
      },
      {
          "a":"弟兄七八个， 围着柱子坐， 只要一分开， 衣服就扯破。 （打一植物）",
          "b":"蒜/大蒜"
      },
      {
          "a":"颜色白如雪， 身子硬如铁， 一日洗三遍， 夜晚柜中歇。  （打一生活用品）",
          "b":"碗"
      },{
          "a":"白嫩小宝宝， 洗澡吹泡泡， 洗洗身体小， 再洗不见了 （打一生活用品）",
          "b":"香皂"
      },{
          "a":"身穿绿衣裳， 肚里水汪汪， 生的子儿多， 个个黑脸膛。 （打一植物）",
          "b":"西瓜"
      },{
          "a":"像只大蝎子， 抱起似孩子， 抓挠肚肠子， 唱出好曲子。 （打一乐器）",
          "b":"琵琶"
      },{
          "a":"一个老头， 不跑不走； 请他睡觉， 他就摇头。 (打一物)",
          "b":"不倒翁"
      },{
          "a":"驼背公公， 力大无穷； 爱驮什么， 车水马龙。 (打一物)",
          "b":"桥"
      },{
          "a":"头戴红帽子， 身披五彩衣， 从来不唱戏， 喜欢吊嗓子。 (打一动物)",
          "b":"公鸡"
      },{
          "a":"先修十字街， 在修月花台， 身子不用动， 口粮自动来。 (打一动物)",
          "b":"蜘蛛"
      },
      
      {
          "a":"陕西人十分好（打一字）",
          "b":"附"
      },{
          "a":"画中人（打一字）",
          "b":"佃"
      },{
          "a":"弹丸之地（打一字）",
          "b":"尘"
      },{
          "a":"铁公鸡（打一成语）",
          "b":"一毛不拔"
      },{
          "a":"一块变九块（打一成语）",
          "b":"四分五裂"
      }
  ]
}

var wxx = {
  el: '.swiper-container',//页面主容器
  musicEl: '#musicMP3',
  url: './',//服务器地址
  direction: 'vertical',//页面滚动方向
  topicNum: '5',//题数  同时也是页数
  onlyExternal: true,//是否 不可 拖动
  loop: false,//页面是否循环
  musicBtn: true,//是否开启音乐按钮
  report: true,//是否开启投诉按钮
  arrow: true,//是否开启箭头动画
  musicIsAutoPlay: true,//音乐是否自动播放 
  musicUrl: 'http://sc1.111ttt.com/2017/1/11/11/304112002347.mp3',//音乐地址
  reportUrl: 'http://www.cyberpolice.cn/wfjb/frame/impeach/chooseImpeachAnonymous.jsp',//投诉网址
  music: function (musicDom, $this) {//音乐按钮
    var audio = $(musicDom)[0];
    $this.addClass('musicBtn');
    if (wxx.musicIsAutoPlay === true) {
      $this.css({
        "animation-play-state": "paused",
        "box-shadow": '0 0 10px pink',
      })
      wxx.musicIsAutoPlay = false;
      audio.pause();
    } else {
      $this.css({
        "animation-play-state": "running",
        "box-shadow": '0 0 0px pink'
      })
      audio.play();
      wxx.musicIsAutoPlay = true;
    }
  },
  ajax: function (apiName, params, cb) {
    $.ajax({
      type: 'get',
      data: JSON.stringify(params),
      url: wxx.url + apiName,
      success: function (res) {
        cb(res)
      },
      error: function (err) {
        console.log("请求错误")
      }
    })
  },
  swiper: function () {
    var mySwiper = new Swiper(wxx.el, {//swiper默认配置 不许改动
      direction: wxx.direction ? wxx.direction : 'vertical',
      onlyExternal: wxx.onlyExternal ? wxx.onlyExternal : false,//无法拖动
      loop: wxx.loop ? wxx.loop : false,
      watchSlidesProgress: true,
      mousewheelControl: true,//是否可以鼠标控制
      onInit: function (swiper) {
        swiperAnimateCache(swiper);//隐藏动画元素 
        swiperAnimate(swiper);//初始化完成开始动画
      },
      onSlideChangeEnd: function (swiper) {
        swiperAnimate(swiper); //每个slide切换结束时也运行当前slide动画
      },
      onTransitionEnd: function (swiper) {
        swiperAnimate(swiper);
      },
      onProgress: function (swiper) {//设置滑动时的渐出渐入
        for (var i = 0; i < swiper.slides.length; i++) {
          var slide = swiper.slides[i];
          var progress = slide.progress;
          var translate = progress * swiper.height / 4;
          scale = 1 - Math.min(Math.abs(progress * 0.4), 1);
          var opacity = 1 - Math.min(Math.abs(progress / 2), 0.5);
          slide.style.opacity = opacity;
          es = slide.style;
          es.webkitTransform = es.MsTransform = es.msTransform = es.MozTransform = es.OTransform = es.transform = 'translate3d(0,' + translate + 'px,-' + translate + 'px) scaleY(' + scale + ')';
        }
      },
      onSetTransition: function (swiper, speed) {//动画速度
        for (var i = 0; i < swiper.slides.length; i++) {
          es = swiper.slides[i].style;
          es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = speed + 'ms';
        }
      },
    })
    return mySwiper;
  },
  wSwiper: null,
  oneOneOut: function (dom, text) {//// 一个字一个字出现的特效  oneOneOut  有bug  维修中...
    var arr = text.split('');
    var div = $(dom)
    for (var i = 0; i < arr.length; i++) {
      (function (m) {
        var str = '';
        var random = parseInt(Math.random() * 255)
        var random2 = parseInt(Math.random() * 255)
        var random3 = parseInt(Math.random() * 255)
        var random4 = parseInt(Math.random() * 60 + 13)
        var random5 = parseInt(Math.random() * 100 + 900)
        var random6 = parseInt(Math.random() * 100 + 1800)
        setTimeout(function () {
          document.documentElement.scrollTop = document.documentElement.scrollHeight;
          document.body.scrollTop = document.body.scrollHeight;
          str += '<span style="transform:translateZ(' + random6 + 'px); font-size:' + random4 + 'px; font-weight=' + random5 + '; color:rgb(' + random3 + ',' + random + ',' + random2 + ');">';
          str += arr[m];
          str += '</span>';
          div.append(str);
        }, 100 + m * 150)
      })(i)
    }
  },
  getUrlParam: function (k) {//获取地址栏参数，k键名
    var m = new RegExp("(^|&)" + k + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(m);
    if (r != null) return decodeURI(r[2]); return null;
  },
  randomArr: function (n, maxNum) {//传入个数  最大随机数
    var array = new Array(); // 定义存放生成随机数的数组 
    for (var i = 0; ; i++) { // 循环N次生成随机数 
      if (array.length < n) {
        generateRandom(n);
      } else {
        break;
      }
    }
    function generateRandom(count) {  // 生成随机数的方法 
      var rand = parseInt(Math.random() * maxNum); //这个是从几到几的随机数
      for (var i = 0; i < array.length; i++) {
        if (array[i] == rand) {
          return false;
        }
      }
      array.push(rand);
    }
    return array;
  },
  wAlert: function (text, btnLabel, cb) {//提示弹窗
    return layer.open({
      content: text
      , btn: btnLabel
      , end: cb
    });
  },
  createRankingDom: function (data, cb) {
    var html = '<ul class="ranking-ul">';
    html += '<li>';
    html += '<div>';
    html += '<span class="ranking-ranking"><b>名次</b></span>';
    html += '<span class="ranking-name"><b>姓名</b></span>';
    html += '<span class="ranking-result"><b>得分</b></span>';
    html += '</div>';
    html += '</li>';
    $.each(data, function (i, v) {
      html += '<li>';
      html += '<div>';
      html += '<span class="ranking-ranking">';
      html += v.ranking
      html += '</span>';
      html += '<span class="ranking-name">';
      html += v.name
      html += '</span>';
      html += '<span class="ranking-result">';
      html += v.result
      html += '</span>';
      html += '</div>';
      html += '</li>';
    })
    html += '<ul>';
    cb(html);
  }
}
wxx.useCode = wxx.getUrlParam("code");


// -----------------------首页操作
console.log(wxx.useCode);
if (wxx.useCode) {
  $('.startBtnDiv span').html("开始游戏");
} else {
  $('.startBtnDiv span').html("未授权");
  window.location.href = 'http://www.baidu.com'
  $('.startBtnDiv span').css({
    background: "#ccc"
  })
}

// console.log(allData)
$('.startBtnDiv span').click(function () {
  // wxx.ajax('./data.json', {}, function (res) {
    var res= allData;
    var userState = res.state;
    console.log(res);
    if (userState == '0') {
      playGame(res.data, function () {
        $("#indexPage").hide();
      })
    } else if (userState == '1') {//答过题了
      // window.location.href = './'
      $('.startBtnDiv span').html("你已经答过题了哟！");
    }
  // })
})

var rankingData = [{
  name: '老王',
  result: "100分",
  ranking: '1'
}, {
  name: '小王',
  result: "10分",
  ranking: '1'
}];

$('.ranking-btn').click(function () {
  wxx.createRankingDom(rankingData, function (html) {
    layer.open({
      title: [
        '排行榜',
        'background-color: #FF4351; color:#fff;'
      ]
      , content: html
    });
  })
})

// -----------------------开始游戏
function playGame(res, cb) {
  var randomNumberArr = wxx.randomArr(wxx.topicNum, res.length);//取随机题的索引
  var $swiperContainer = $('<div class="swiper-container"></div>');
  var $swiperWrapper = $('<div class="swiper-wrapper"></div>');
  $swiperContainer.append($swiperWrapper);

  $.each(randomNumberArr, function (i, v) {
    var topic = res[v];

    var $section = $('<section class="swiper-slide pageOne"></section>')//每个页面
    $section.css({
      "background": " url('../img/bg.jpg') no-repeat",
      "background-size": " 100% 100% "
    })

    var $topic = $('<div>', {
      'html': '<div>' + topic.a + '</div>',
      'class': 'ani',
      "swiper-animate-effect": "zoomIn",
      "swiper-animate-duration": "1s",
      "swiper-animate-delay": "0s",
    }).appendTo($section);
    $topic.css({
      'width': '4.5rem',
      'text-align': 'justify',
      'margin': 'auto',
      'margin-top': '3.5rem',
      // 'color':'white',
      'font-size': '.5rem',
    })

    var userTopic = '';
    var $input = $('<input />', {
      placeholder: "请输入你的答案",
      'class': 'ani',
      "swiper-animate-effect": "lightSpeedIn",
      "swiper-animate-duration": "0.3s",
      "swiper-animate-delay": ".5s",
      "focus": function () {

      },
      "blur": function () {
        $('.swiper-slider').css({
          transform: 'translateY(0rem)'
        })
      }
    }).appendTo($section);
    $input.css({
      'width': '6rem',
      'height': '1rem',
      'position': 'absolute',
      'bottom': '2.3rem',
      'left': 0, 'right': 0,
      'margin': 'auto',
      'line-height': 1,
      'padding-left': '.2rem',
      'border-radius': '.3rem',
      'border': '1px solid rgba(0, 0, 0, 0.3)'
    })

    var $btn = $('<div>', {
      'html': '<div>提交</div>',
      'class': 'ani',
      "swiper-animate-effect": "rotateIn",
      "swiper-animate-duration": "0.3s",
      "swiper-animate-delay": "1s",
      'click': function () {
        userTopic = $input.val();

        if (userTopic == '') {
          wxx.wAlert('请输入答案！', '我知道了。', function (index) {
            layer.close(index);
          })
        } else if (userTopic == topic.b) {
          wxx.wAlert('恭喜，答对了！', '确定。', function (index) {
            layer.close(index);
            setTimeout(function () {
              if(wxx.wSwiper.isEnd){//最后一页
                wxx.wAlert('回首页', '确定。', function (index) {
                  window.location.href = window.location.href 
                })
              }else{
                wxx.wSwiper.slideNext();
              }
              
            }, 500);
          })
        } else {

          wxx.wAlert('回答错误！', '我知道了。', function (index) {
            layer.close(index);
            setTimeout(function () {
              if(wxx.wSwiper.isEnd){//最后一页
                // window.location.href = '/index.html';
                if(wxx.wSwiper.isEnd){//最后一页
                  wxx.wAlert('所有题目以答完', '确定。', function (index) {
                    window.location.href = window.location.href 
                  })
                }
              }else{
                wxx.wSwiper.slideNext();
              }
            }, 500)
          })

        }
      }
    }).appendTo($section);
    $btn.css({
      'width': '5rem',
      'height': '1rem',
      'color': '#feeecc',
      'text-align': 'center',
      'line-height': '1rem',
      'font-size': '.6rem',
      'letter-spacing': '.2rem',
      'background': '#db0a13',
      'position': 'absolute',
      'bottom': '.6rem',
      'left': 0, 'right': 0,
      'margin': 'auto',
      'border-radius': '.3rem',
      'border': '1px solid rgba(0, 0, 0, 0.3)'
    })

    if (wxx.arrow) {
      var $arrow = $('<img src="img/arrow.png" id="array">');
      $section.appendTo($arrow);
    }
    $swiperWrapper.append($section);
  })//每个页面 over

  //每个页面都有的部分
  if (wxx.report === true) {
    var $report = $('<div id="report" >投诉</div>');
    $report.click(function () {
      window.location.href = wxx.reportUrl
    })
    $("body").append($report)
  }

  var isautoplay = "autoplay";
  wxx.musicIsAutoPlay ? isautoplay = "autoplay" : isautoplay = '';
  if (wxx.musicBtn === true) {
    var $music = $('<div id="music" class="' + (wxx.musicIsAutoPlay ? 'musicBtn' : '') + '" >  <audio preload="load" id="musicMP3"  ' + isautoplay + '  src=" ' + wxx.musicUrl + ' "></audio></div>');
    $music.click(function () {//音乐"#musicMP3"
      wxx.music(wxx.musicEl, $(this));
    })
    $("body").append($music)
  }



  $("#wzm").append($swiperContainer);
  cb();
  wxx.wSwiper = wxx.swiper();
}







