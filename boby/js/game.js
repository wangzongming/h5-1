var wxx = {
    winWidth : $(window).width(),
    protagonistEl:'.per',
    sweetEl:'.sweet',
    score:0,

    sweetData:[{
        type:'good',
        result:10,
        img:'10分的好糖果'
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
    upAin:function(dom, cb){
        $(dom).css({
            "transform":" scale(1.5)",
        })
        cb(dom);
    },
    crash:function(domOne, domTwo, cb){//碰撞检测
        var $domOne = $(domOne);
        var $domTwo = $(domTwo);
        // console.log( $domTwo )

        var domOneX = $domOne.offset().left;//角色的X
        var domOneY = $domOne.offset().top;//角色的Y

        var domTwoX = $domTwo.offset().left;//糖果的X
        var domTwoY = $domTwo.offset().top;//糖果的Y

        var domOneWidth =  $domOne.width(); //角色的宽
        var domTwoWidth =  $domTwo.width(); //糖果的宽

        console.log(wxx.upIng);
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
    upIng:false,//是否正在跳跃
    sweetTimer:'',//每个精灵的计时器
    touchStartY:'',//用于计算跳跃
}

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

$('#indexPage .startBtn').on('click', function(){
    $('#indexPage').fadeOut();
    $('#game').fadeIn();
    playGame();
})


function playGame(){ //游戏场景
    var gameTimer = setInterval(function(){//创建糖果
        var random = parseInt( Math.random() * 10000 + new Date().getTime()  );//class用
        // console.log(random)
        var timer = Number($('.timer-num').text()) - 1;//倒计时
        if( timer<0 ){//结束游戏
            $('.timer-num').text( '0' );
            clearInterval(gameTimer);
            layer.open({
                title: [
                'GAME OVER',
                'background-color: green; color:#fff;'
                ]
                ,content: '得分：' + wxx.score
                ,end:function(){
                    window.location.href =  window.location.href;
                }
            });   
        }else{
            $('.timer-num').text( timer );
        }

        var sweetRandom = parseInt( Math.random() * (wxx.sweetData.length) );//随机糖果类型
        var sweetLeftRandom = parseInt(  Math.random() * (wxx.winWidth - $('.sweet').width() ));

        console.log(sweetLeftRandom);
        var className = random.toString();
        var $div = $('<div>',{
            'class':'sweet ' + className,
            'type':wxx.sweetData[sweetRandom].type,
            'result':wxx.sweetData[sweetRandom].result,
            'html':wxx.sweetData[sweetRandom].img,
            'click':function(){
                console.log($(this))
            }
        }).appendTo('#game');
        $div.css({
            left:sweetLeftRandom
        })

        wxx.sweetTimer.className = setInterval(function(){
            wxx.crash(wxx.protagonistEl, '.'+className, function(sweet){
                if(sweet == 'false'){//清除定时器即可
                    // console.log('dddd')
                    clearInterval(wxx.sweetTimer.className);
                    return;
                }

                var result = $(sweet).attr('result');
                if(wxx.score>=0){
                    wxx.score = wxx.score + Number(result) ;
                    $('.score-num').html(wxx.score);
                }else{
                    wxx.score = 0;
                    $('.score-num').html(0);
                }
                clearInterval(wxx.sweetTimer.className);
                $(sweet).hide('slow');
            });
        },400)
    },1000);
}


//用户操作
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
            // console.log(upLen)
            if(upLen > 80){//向上
                console.log("up") ;
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
                    left:'50%',
                    right:'0rem'
                })
            }else if(touch.pageX < wxx.winWidth / 2){//往左走
                $(wxx.protagonistEl).css({
                    left:'0rem',
                    right:'50%'
                })
            }
            
            break;
    }


})


