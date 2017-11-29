var wxx = {
    winWidth : $(window).width(),
    indexPageEl:'#indexPage',//首页
    gamePageEl:'#game',//游戏页面
    musicEl: '#musicMP3',
    protagonistEl:'.per',//主角元素
    sweetEl:'.sweet',//糖果元素
    sweetSpeed:4,//多长时间走完 s
    timeEl:'.timer-num',//倒计时容器
    scoreEl:'.score-num',//得分容器
    goodTextEl:'#good',
    score:0,//得分
    gameTime:20,//游戏时间 s  写数字
    randomSweetInt:1500,//出糖果的间隔
    upIng:false,//是否正在跳跃
    goodText:true,//是否开点赞
    musicBtn: true,//是否开启音乐按钮
    musicIsAutoPlay: true,//音乐是否自动播放 
    musicUrl: 'http://sc1.111ttt.com/2017/1/11/11/304112002347.mp3',//音乐地址
    sweetData:[{//糖果类型 随机出
        type:'good',
        result:10, //碰到后的得分
        background:"./img/tou.png",
        img:'10分的好糖果'//元素
        },{
            type:'bad',
            result:-10,
            background:"./img/dasuan.png",
            img:'-10分的坏糖果'
        },{
            type:'good',
            result:1,
            background:"./img/rou.png",
            img:'1分的好糖果'
        },{
            type:'bad',
            result:-1,
             background:"./img/tudou.png",
            img:'-1分的坏糖果'
        }],
    upAin:function(dom, cb){//跳跃函数  回调
        $(dom).css({
            width:"1.3rem",
            height:"1.3rem",
            bottom:'76%'
            // "transform":" scale(1.2) translate3d(0, -.8rem, 50px)"
        })
        cb(dom);
    },
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
    crash:function(domOne, domTwo, cb){//碰撞检测  回调
        if(!domTwo){
            return;
        }
        var $domOne = $(domOne);
        var $domTwo = $(domTwo);

        var domOneX = $domOne.offset().left;//角色的X
        var domOneY = $domOne.offset().top;//角色的Y

        if(!$domTwo.offset()){
            return;
        }
        var domTwoX = $domTwo.offset().left;//糖果的X
        var domTwoY = $domTwo.offset().top;//糖果的Y

        var domOneWidth =  $domOne.width(); //角色的宽
        var domTwoWidth =  $domTwo.width(); //糖果的宽

        if(wxx.upIng){//正在跳跃
            cb(false);
            return;
        }   
        if(domTwoX > domOneX - domTwoWidth  && domTwoX <    domOneX +  domOneWidth   ){//碰撞到糖果  左右距离检测
            if( domTwoY >= domOneY - 40 && domTwoY < domOneY + 50 ){//上下距离检测
                cb($domTwo);//执行回调
            }else{  
                cb(false);
            }
        }else{
            cb(false);
        }
    },
    playGame:function(cb){//开始游戏 点击后触发  回调
        $(wxx.indexPageEl).fadeOut('slow',function(){
            $(wxx.gamePageEl).fadeIn('slow', function(){
                cb();
            });
        });
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
    gameOver:function(gameTimer, html, title, cb){ //定时器必传  默认不管即可
        var title = title || 'GAME OVER';
        $(wxx.timeEl).html( '0' );
        clearInterval(gameTimer);
        cb(html);

        // layer.open({
        //     title: [
        //         title,
        //          'background-color: green; color:#fff;'
        //     ]
        //     ,content: html
        //     ,end:function(){
        //         cb();
        //     }
        // });   
    },
    getUrlParam: function (k) {//获取地址栏参数，k键名
        var m = new RegExp("(^|&)" + k + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(m);
        if (r != null) return decodeURI(r[2]); return null;
    },
    gameOverHtml:function(score){
        var html = '';
              html  += '得分：' + score;//游戏结束时的html内容
                //some code ....
        return html;
    },
    createSweet:function(opt,cb){//创建糖果  回调
        var className = opt.className,
                type = opt.type,
                result = opt.result,
                html = opt.html,
                // key = opt.key,
                dom = opt.insertDom,
                background = opt.style.background,
                left = opt.style.left;

        var $div = $('<div>',{
            'class':className,
            'type':type,
            'result':result,
        }).appendTo(dom);

        $div.css({
            left:left,
            background:'url('+background+')no-repeat left top / 100% 100%',
        })
        cb($div);
    },
    className:'',//---------------------这些都是必备的临时变量
    keyframes:40,//刷新频率
    sweetRanVar:0,//临时变量
    testIndex:'',//定时器
    sweetTimer:'',//每个精灵的计时器 随机变量名
    touchStartY:'',//用于y位置
    touchStartX:'',//触摸x位置
    randomClass: function(){
        return parseInt( Math.random() * 10000 + new Date().getTime()  )
    },
    timeout_geme:0,
    playGameFn:function(){//游戏逻辑
        var gameTimer = setInterval(function(){//创建糖果
            wxx.sweetRanVar += (1000 / wxx.keyframes);
            wxx.timeout_geme += (1000 / wxx.keyframes);//倒计时
            if(wxx.timeout_geme >= 1000){
                wxx.gameTime -- ;
                wxx.timeout_geme = 0;
                var timer = wxx.gameTime;//倒计时
                if( timer < 0 ){//结束游戏
                    wxx.gameOver(gameTimer,  wxx.gameOverHtml(wxx.score),  'GAME OVER', function(html){
                        var ranking = JSON.parse( localStorage.getItem("ranking")) || [];
                        ranking.push({
                            score : wxx.score  
                        })
                        localStorage.setItem("ranking", JSON.stringify(ranking) );

                        layer.open({
                            title: [
                                "游戏结束",
                                 'background-color: green; color:#fff;'
                            ]
                            ,content: html
                            ,end:function(){
                                window.location.href =  window.location.href;
                            }
                        });   

                        //刷新页面
                        // window.location.href =  window.location.href;
                    }) 
                }else{
                    $(wxx.timeEl).text( timer );
                }

            }
            if(wxx.sweetRanVar >= wxx.randomSweetInt){//在设置里的事件随机出糖果
                var sweetRandom = parseInt( Math.random() * (wxx.sweetData.length-1) );//随机糖果类型
                var sweetLeftRandom = parseInt(  Math.random() * (wxx.winWidth - Number(wxx.winWidth / 2 /2) )  ) + 50;
                wxx.className = wxx.randomClass().toString();
                wxx.createSweet({//创建糖果
                    className:'sweet ' +  wxx.className,
                    type:wxx.sweetData[sweetRandom].type,
                    result:wxx.sweetData[sweetRandom].result.toString(),
                    style:{
                        background:wxx.sweetData[sweetRandom].background,
                        left:sweetLeftRandom
                    },
                    html:wxx.sweetData[sweetRandom].img,
                    insertDom:wxx.gamePageEl
                },function($this){})
                wxx.sweetRanVar  = 0;            
            }


            if(wxx.className ){
                if( $('.' + wxx.className).offset() ){
                    var tgLeft = $('.' + wxx.className).offset().left;
                    if(tgLeft < wxx.winWidth / 2 / 2 ){
                        $('.' + wxx.className).css({
                            left : '+=1.5'
                        })
                    }else if(tgLeft > wxx.winWidth / 2 +  wxx.winWidth / 2 / 2){
                        $('.' + wxx.className).css({
                            left : '-=2.5'
                        })
                    }
                }
            }

            if(wxx.className){
                wxx.crash(wxx.protagonistEl, '.'  + wxx.className.toString(), function(sweet){//碰撞检测
                    if(sweet){
                        var result = Number( $(sweet).attr('result') );
                        $(sweet).addClass('remove');
                        $(sweet).attr('result',0)
                        // $(sweet).remove();

                        if(result > 0){//如果得分
                            if(wxx.goodText){
                                $(wxx.goodTextEl).fadeIn('10',function(){//点赞按钮
                                    $(wxx.goodTextEl).fadeOut('slow');
                                })
                            }
                        }
                        wxx.score = wxx.score + result ;
                        $(wxx.scoreEl).html( wxx.score );
                    }else{
                        // console.log("未得分")
                    }
                })
            }
        },1000 / wxx.keyframes);//10毫秒执行一次轮训
    },
    createRankingDom: function (data, cb) {
        var html = '<ul class="ranking-ul" style="max-height:400px;overflow-y:scroll;">';
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
      },
      overscroll : function(els){
        for (var i = 0; i < els.length; ++i) {
            var el = els[i];
            el.addEventListener('touchstart', function () {
                var top = this.scrollTop
                    , totalScroll = this.scrollHeight
                    , currentScroll = top + this.offsetHeight;
                //If we're at the top or the bottom of the containers
                //scroll, push up or down one pixel.
                //
                //this prevents the scroll from "passing through" to
                //the body.
                if (top === 0) {
                    this.scrollTop = 1;
                } else if (currentScroll === totalScroll) {
                    this.scrollTop = top - 1;
                }
            });
            el.addEventListener('touchmove', function (evt) {
                //if the content is actually scrollable, i.e. the content is long enough
                //that scrolling can occur
                if (this.offsetHeight < this.scrollHeight)
                    evt._isScroller = true;
            });
        }
      }
}

$('.ranking-btn').html('7777');
!function(){//自动配置页面
    var isautoplay = "autoplay";
    wxx.musicIsAutoPlay ? isautoplay = "autoplay" : isautoplay = '';
    if (wxx.musicBtn === true) {
        var $music = $('<div id="music" class="' + (wxx.musicIsAutoPlay ? 'musicBtn' : '') + '" >  <audio preload="load" id="musicMP3"  ' + isautoplay + '  src=" ' + wxx.musicUrl + ' "></audio></div>');
            $music.click(function () {//音乐"#musicMP3"
            wxx.music(wxx.musicEl, $(this));
        })
        $("body").append($music)
    }
}()

//样式问题
$(window).resize(function(){
    wxx.winWidth =  $(window).width();
    $('body').css({
        height:$(window).height()
    })
})
$('body').css({
    height:$(window).height()
})


$('body, div, span').on('click scroll',function(event){//页面的的一些用户事件
    var evType = event.type;
    var target = $(this).attr('class');

    switch(evType){
        case 'click':
            switch(target){
                case 'startBtn'://start btn onclick
                    wxx.playGame(function(){
                        wxx.playGameFn();
                    })
                    break;
                case 'ranking-btn'://排行榜
                    var score = JSON.parse(localStorage.getItem("ranking"));
                    var rankingData = [];
                    var sortArr = [];
                    $.each(score, function(i, v){
                        sortArr.push(v.score)
                    }) 
                    sortArr.sort(function(a, b){
                        return b - a;
                    })  
                    $.each(sortArr, function(i, v){
                        rankingData.push({
                            name:"me",
                            result: v +"分",
                            ranking:i+1
                        })
                    })

                    wxx.createRankingDom(rankingData, function (html) {
                            layer.open({
                            title: [
                                '排行榜',
                                'background-color: #FF4351; color:#fff;'
                            ]
                            , content: html
                            });
                    })
                    break;
            }
            break;
    }
})

//禁止body的滚动事件
document.body.addEventListener('touchmove', function (evt) {
    //In this case, the default behavior is scrolling the body, which
    //would result in an overflow.  Since we don't want that, we preventDefault.
    if (!evt._isScroller) {
        evt.preventDefault();
    }
});
//给class为.scroll的元素加上自定义的滚动事件
wxx.overscroll(document.querySelectorAll('.scroll'));

//角色动作
$('#game').on('touchstart touchmove touchend', function(event){
    var evType = event.type;
    switch(evType){
        case 'touchstart':
            var touch = event.originalEvent.targetTouches[0]; 
            wxx.touchStartY = touch.pageY;
            wxx.touchStartX = touch.pageX;
            break;
        case 'touchmove':
            var touch = event.originalEvent.targetTouches[0]; 
            var x = touch.pageX -  wxx.touchStartX;//移动的x轴距离
            var perLeft = $(wxx.protagonistEl).offset().left; //任务X轴位置
            var touchX = perLeft + x
            var targetX = wxx.winWidth / 1.65;

            if(touchX    > targetX){//往右移动
                $(wxx.protagonistEl).css({
                    'transform':'translateX(1.5rem)'
                })
            }else if(touchX > ( wxx.winWidth / 2)  - 80 && touchX < ( wxx.winWidth  / 2) + 80){//往中间
                $(wxx.protagonistEl).css({
                    'transform':'translateX(-50%)'
                })
            }else if(touchX < targetX ){//往左走
                $(wxx.protagonistEl).css({
                    'transform':'translateX(-2.5rem)'
                })
            }
            break;
        case 'touchend':
            var touch = event.originalEvent.changedTouches[0]; 
            var upLen =  wxx.touchStartY - touch.pageY;
            if(upLen > 80){//向上
                wxx.upIng = true;
                wxx.upAin(wxx.protagonistEl, function(dom){
                    setTimeout(function(){
                        $(dom).css({
                            width:"1rem",
                            height:"1rem",
                            bottom:'70%'
                            // "transform":" scale(1)",
                        })
                        wxx.upIng = false;
                    },600);
                }) 
            }else{//向下
                // some code...
            }
            break;
    }


})


