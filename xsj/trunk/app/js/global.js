var wxx = {
  el: '.swiper-container',//页面主容器
  url: './',//服务器地址
  direction: 'vertical',//页面滚动方向
  topicNum: '5',//题数
  onlyExternal: true,//是否 不可 拖动
  loop: false,//页面是否循环
  music: true,//是否开启音乐按钮
  musicUrl: 'http://sc1.111ttt.com/2017/1/11/11/304112002347.mp3',//音乐地址
  musicIsAutoPlay: true,//音乐是否自动播放
  report: true,//是否开启投诉按钮
  arrow: true,//是否开启箭头动画
  musicIsPlay: true,//判断音乐播放状态
  reportUrl: 'http://www.cyberpolice.cn/wfjb/frame/impeach/chooseImpeachAnonymous.jsp',//投诉网址
  music: function (musicDom, $this) {//音乐按钮
    var audio = $(musicDom)[0];
    if (wxx.musicIsPlay) {
      $this.css({
        "animation-play-state": "paused",
        "box-shadow": '0 0 10px pink',
      })
      wxx.musicIsPlay = false;
      audio.pause();
    } else {
      $this.css({
        "animation-play-state": "running",
        "box-shadow": '0 0 0px pink'
      })
      audio.play();
      wxx.musicIsPlay = true;
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
  wSwiper:null,
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
  }
}

wxx.ajax('./data.json', {}, function (res) {
  // var  topicArr = [];//随机抽出的题
  var randomNumberArr = wxx.randomArr(wxx.topicNum, res.length);//取随机题的索引
  var $swiperContainer = $('<div class="swiper-container"></div>');
  var $swiperWrapper = $('<div class="swiper-wrapper"></div>');
  $swiperContainer.append($swiperWrapper);

  $.each(randomNumberArr, function (i, v) {
    var topic = res[v];
    console.log(topic);
    var $section = $('<section class="swiper-slide pageOne"></section>')//每个页面
    $section.css({
      "background": " url('../img/bg.jpg') no-repeat",
      "background-size": " 100% 100% "
    })

    var $topic = $('<div>', {
      'html': '<div>' + topic.a + '</div>',
      'class':'ani',
      "swiper-animate-effect" : "zoomIn", 
      "swiper-animate-duration" : "1s" ,
      "swiper-animate-delay" : "0s",
    }).appendTo($section);
    $topic.css({
      'width':'4.5rem',
      'text-align':'justify',
      'margin':'auto',
      'margin-top':'3rem',
      // 'color':'white',
      'font-size':'.5rem',
    })

    var userTopic = '';
    var $input = $('<input />',{
      placeholder:"请输入你的答案" ,
      'class':'ani',
      "swiper-animate-effect" : "lightSpeedIn", 
      "swiper-animate-duration" : "0.5s" ,
      "swiper-animate-delay" : "1s", 
    }).appendTo($section);
    $input.css({
      'width':'6rem',
      'height':'1rem',
      'position':'absolute',
      'bottom':'2.3rem',
      'left':0,'right':0,
      'margin':'auto',
      'border-radius':'.3rem',
      'border':'1px solid rgba(0, 0, 0, 0.3)'
    })
    
    var $btn = $('<div>',{
      'html':'<div>提交</div>',
      'class':'ani',
      "swiper-animate-effect" : "rotateIn", 
      "swiper-animate-duration" : "0.7s" ,
      "swiper-animate-delay" : "1.5s", 
      'click':function(){
        userTopic = $input.val();
        if(userTopic == topic.b){
          alert('回答正确！')
        }else{
          alert('回答错误！')
        }
          wxx.wSwiper.slideNext();
      }
    }).appendTo($section);
    $btn.css({
        'width':'5rem',
        'height':'1rem',
        'color':'#feeecc',
        'text-align':'center',
        'line-height':'1rem',
        'font-size':'.6rem',
        'letter-spacing':'.2rem',
        'background':'#db0a13',
        'position':'absolute',
        'bottom':'.6rem',
        'left':0,'right':0,
        'margin':'auto',
        'border-radius':'.3rem',
        'border':'1px solid rgba(0, 0, 0, 0.3)'
    })

    if (wxx.arrow) {
      var $arrow = $('<img src="img/arrow.png" id="array">');
      $section.appendTo($arrow);
    }
    $swiperWrapper.append($section);
  })//每个页面 over

  if (wxx.report) {
    var $report = $('<div id="report" >投诉</div>');
    $report.click(function(){
      window.location.href= wxx.reportUrl
    })
    $swiperWrapper.append($report)
  }
  if (wxx.music) {
    var $music = $('<div id="music" >  <audio id="musicMP3"  autoplay src=" ' + wxx.musicUrl + ' "></audio></div>');
    $music.click(function () {//音乐"#musicMP3"
      wxx.music("#musicMP3", $(this));
    })
    $swiperWrapper.append($music)
  }

  $("#wzm").append($swiperContainer);
  wxx.wSwiper = wxx.swiper();
})






