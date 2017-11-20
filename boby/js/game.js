var wxx = {
    winWidth : $(window).width(),
    indexPageEl:'#indexPage',//首页
    gamePageEl:'#game',//游戏页面
    musicEl: '#musicMP3',
    protagonistEl:'.per',//主角元素
    sweetEl:'.sweet',//糖果元素
    timeEl:'.timer-num',//倒计时容器
    scoreEl:'.score-num',//得分容器
    goodTextEl:'#good',
    score:0,//得分
    gameTime:50,//游戏时间 s  写数字
    randomSweetInt:500,//出糖果的间隔
    upIng:false,//是否正在跳跃
    goodText:true,//是否开点赞
    musicBtn: true,//是否开启音乐按钮
    musicIsAutoPlay: false,//音乐是否自动播放 
    musicUrl: 'http://sc1.111ttt.com/2017/1/11/11/304112002347.mp3',//音乐地址
    sweetData:[{//糖果类型 随机出
        type:'good',
        result:10, //碰到后的得分
        img:'10分的好糖果'//元素
        },{
            type:'bad',
            result:-10,
            img:'-10分的坏糖果'
        },{
            type:'good',
            result:1,
            img:'1分的好糖果'
        },{
            type:'bad',
            result:-1,
            img:'-1分的坏糖果'
        }],
    upAin:function(dom, cb){//跳跃函数  回调
        $(dom).css({
            "transform":" scale(1.5)",
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
        var $domOne = $(domOne);
        var $domTwo = $(domTwo);

        var domOneX = $domOne.offset().left;//角色的X
        var domOneY = $domOne.offset().top;//角色的Y

        var domTwoX = $domTwo.offset().left;//糖果的X
        var domTwoY = $domTwo.offset().top;//糖果的Y

        var domOneWidth =  $domOne.width(); //角色的宽
        var domTwoWidth =  $domTwo.width(); //糖果的宽

        if(wxx.upIng){//正在跳跃
            cb('false');
            return;
        }   
        if(domTwoX > domOneX - domTwoWidth  && domTwoX <    domOneX +  domOneWidth   ){//碰撞到糖果  左右距离检测
            if( domTwoY >= domOneY - 10 && domTwoY < domOneY + 100 ){//上下距离检测
                cb($domTwo);//执行回调
            }else{  
                cb('false');
            }
        }else{
            cb('false');
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
    gameOver:function(gameTimer, html, title,cb){ //定时器必传  默认不管即可
        var title = title || 'GAME OVER';
        $(wxx.timeEl).html( '0' );
        clearInterval(gameTimer);
        layer.open({
            title: [
                title,
                 'background-color: green; color:#fff;'
            ]
            ,content: html
            ,end:function(){
                cb();
            }
        });   
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
                key = opt.key,
                dom = opt.insertDom,
                left = opt.style.left;

        var $div = $('<div>',{
            'class':className,
            'type':type,
            'result':result,
            'key':key,
            'html':html,
        }).appendTo(dom);
        $div.css({
            left:left
        })
        cb($div);
    },
    className:'',//---------------------这些都是必备的临时变量
    keyframes:10,//多少帧
    sweetRanVar:0,//临时变量
    sweetCount:[],//页面的糖果 用于检测碰撞
    testIndex:'',//定时器
    sweetTimer:'',//每个精灵的计时器 随机变量名
    touchStartY:'',//用于计算跳跃

    playGameFn:function(){//游戏逻辑
        var gameTimer = setInterval(function(){//创建糖果
            wxx.sweetRanVar += 10;

            if(wxx.sweetRanVar >= wxx.randomSweetInt){//在设置里的事件随机出糖果
                var sweetIndex = wxx.sweetCount.length - 1;
                var random = parseInt( Math.random() * 10000 + new Date().getTime()  );//class用
                wxx.gameTime -- ;
                var timer = wxx.gameTime;//倒计时
                if( timer<0 ){//结束游戏
                    wxx.gameOver(gameTimer,  wxx.gameOverHtml(wxx.score),  'GAME OVER', function(){
                        window.location.href =  window.location.href;
                    }) 
                }else{
                    $(wxx.timeEl).text( timer );
                }
                var sweetRandom = parseInt( Math.random() * (wxx.sweetData.length-1) );//随机糖果类型
                var sweetLeftRandom = parseInt(  Math.random() * (wxx.winWidth - $( wxx.sweetEl ).width() )  );
                wxx.className = random.toString();
                wxx.createSweet({//创建糖果
                    className:'sweet ' +  wxx.className,
                    key:sweetIndex,
                    type:wxx.sweetData[sweetRandom].type,
                    result:wxx.sweetData[sweetRandom].result.toString(),
                    style:{
                        left:sweetLeftRandom
                    },
                    html:wxx.sweetData[sweetRandom].img,
                    insertDom:wxx.gamePageEl
                },function($this){
                   wxx.sweetCount.push(wxx.className);
                   wxx.testIndex.random = setTimeout(function(){
                        wxx.sweetCount.splice(sweetIndex, 1);
                        // $('.'+wxx.className).remove();  //浪费内存 
                        clearTimeout( wxx.testIndex.random  )
                    },4000)
                })
                wxx.sweetRanVar  = 0;            
            }

            $.each( wxx.sweetCount, function(i, v){
                wxx.crash(wxx.protagonistEl, '.' + v.toString(), function(sweet){
                    // console.log(sweet);
                    if(sweet == 'false'){//清除定时器即可
                        clearInterval(wxx.sweetTimer.className);
                        return;
                    }
                    wxx.className = '';//清除class

                    var result = $(sweet).attr('result');
                    if(Number(result)  > 0){
                        if(wxx.goodText){
                            $(wxx.goodTextEl).fadeIn('10',function(){//点赞按钮
                                $(wxx.goodTextEl).fadeOut('slow');
                            })
                        }
                    }
                    if( Number(wxx.score) >= 0){     
                        // console.log('执行加分', result)
                        wxx.score = Number(wxx.score) + Number(result) ;
                        // console.log(wxx.score)
                        $(wxx.scoreEl).html( wxx.score );
                    }else{
                        wxx.score = 0;
                        // $(wxx.scoreEl).html(0);
                    }
                    clearInterval(wxx.sweetTimer.className);
                    $(sweet).hide('slow');
                    // $(sweet).remove()
                });
            })
        },10);//10毫秒执行一次轮训
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

var rankingData = [{//排行榜假数据
    name: '老王',
    result: "100分",
    ranking: '1'
  }, {
    name: '小王',
    result: "10分",
    ranking: '1'
  }];

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

$('body').on('click',function(event){//页面的的一些用户事件
    var evType = event.type;
    var target = $(event.target).attr('class');
    switch(evType){
        case 'click':
            switch(target){
                case 'startBtn'://start btn onclick
                    wxx.playGame(function(){
                        wxx.playGameFn();
                    })
                    break;
                case 'ranking-btn'://排行榜
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

//角色动作
$('#game').on('touchstart touchmove touchend', function(event){
    var evType = event.type;
    switch(evType){
        case 'touchstart':
            var touch = event.originalEvent.targetTouches[0]; 
            wxx.touchStartY = touch.pageY;
            break;
        case 'touchmove':
            var touch = event.originalEvent.targetTouches[0]; 
            break;
        case 'touchend':
            var touch = event.originalEvent.changedTouches[0]; 
            var upLen =  wxx.touchStartY - touch.pageY;
            if(upLen > 80){//向上
                // console.log("up") ;
                wxx.upIng = true;
                wxx.upAin(wxx.protagonistEl, function(dom){
                    setTimeout(function(){
                        $(dom).css({
                            "transform":" scale(1)",
                        })
                        wxx.upIng = false;
                    },600);
                }) 
            }else{//向下
                // some code...
            }

            if(touch.pageX > wxx.winWidth / 2){//往右移动
                $(wxx.protagonistEl).css({
                    left:'40%',
                    right:'0rem'
                })
            }else if(touch.pageX < wxx.winWidth / 2){//往左走
                $(wxx.protagonistEl).css({
                    left:'0rem',
                    right:'40%'
                })
            }
            
            break;
    }


})


