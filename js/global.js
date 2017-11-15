var defalutSetting = {
        el:'.swiper-container',//页面主容器
        loop:false,//页面是否循环
        pages:[{//每个页面的单独配置  一个对象就是一个页面
            background:'black',//背景
        }]
}


$.ajax({
  type:'get',
  url:'../data.json',
  success:function(res){
    console.log(res);
  },
  error:function(err){
    console.log("请求错误")
  }
})

var mySwiper = new Swiper(defalutSetting.el, {//swiper默认配置 不许改动
    direction: 'vertical',
    loop:defalutSetting.loop,
    watchSlidesProgress: true,
    // pagination: '.swiper-pagination',
    mousewheelControl: true,
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

  // 一个字一个字出现的特效  oneOneOut
  function oneOneOut (dom,effect){//有bug
    $(dom).html('');
    var effect = effect || '';
    var txtArr= $(dom).data('text').split('');
    console.log(txtArr);
    $.each(txtArr,function(i,v){
      console.log(v)
      setTimeout( function(){
        var $span = $("<span class='ani' swiper-animate-effect='"+effect+"'  swiper-animate-duration='0.5s'>"+v+"</span>")
        $(dom).append($span);
      //   var $span = $("<span swiper-animate-effect='"+effect+"' >"+v+"</span>")
      //   $(dom).append($span);
      }, i*150)


    })
  }


  //音乐
  var musicIsPlay = true;
  $('#music').click(function(){
    var audio = $("#musicMP3")[0];  
    if(musicIsPlay){
        $(this).css({
          "animation-play-state":"paused",
          "box-shadow":'0 0 10px pink',
        })
         musicIsPlay = false;
         audio.pause();  
    }else{
      $(this).css({
        "animation-play-state":"running",
        "box-shadow":'0 0 0px pink'
      })
      audio.play();
      musicIsPlay = true;
    }
    
  })  
  