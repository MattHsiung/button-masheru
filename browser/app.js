var countDown=5
var time=5;
var roundOver=false
var player1={
    player: "chun-li",
    count: 0
}   
var player2={
    player: "chun-li",
    count: 0
}   

function reset(){
    socket.emit('reset')
    location.reload()
}



var messages={
    mash:'<img class="animated msg flash"src="assets/mash.png">',
    ready:'<img class="animated msg flash"src="assets/ready.png">',
    p1:'<div id="p1-wins" class="win-msg text-center big"><h1>Chun-Li Wins!</h1></div>',
    p2:'<div id="p2-wins" class="win-msg text-center big"><h1>Ryu Wins!</h1></div>'
}

var sfx={
    punch: document.createElement("AUDIO"),
    kick: document.createElement("AUDIO"),
    1: document.createElement("AUDIO"),
    2: document.createElement("AUDIO"),
    3: document.createElement("AUDIO"),
    4: document.createElement("AUDIO"),
    5: document.createElement("AUDIO"),
    fight: document.createElement("AUDIO"),
    liWins: document.createElement("AUDIO"),
    ryuWins: document.createElement("AUDIO"),
    ryuLose: document.createElement("AUDIO"),
    liLose: document.createElement("AUDIO")
}

sfx.punch.src='sound/punch.mp3'
sfx.kick.src='sound/kick.mp3'
sfx.fight.src='sound/fight.wav'
sfx.liWins.src='sound/chunli laugh.wav'
sfx.ryuWins.src='sound/hadoken.wav'
sfx.ryuLose.src='sound/dieguy.wav'
sfx.liLose.src='sound/diegirl.wav'
sfx['1'].src='sound/1.mp3'
sfx['2'].src='sound/2.mp3'
sfx['3'].src='sound/3.mp3'
sfx['4'].src='sound/4.mp3'
sfx['5'].src='sound/5.mp3'


$(document).on('ready', startRound())


function startRound(){
    $('#msg').append(messages.ready)
    countDownTimer= setInterval(function(){
        if (countDown <1){
            sfx.fight.play()
            startGame()
            $('#count-down').text('GO!')
            --countDown
        }else{
            sfx[countDown].play()
            $('#count-down').text(countDown--)
        }
    },1000)
}

function startGame(){
socket.on('up', _.debounce(stop,150))
    $('.msg').replaceWith(messages.mash)
    setTimeout(function(){
        $('#msg').hide()
    },2000)
    clearInterval(countDownTimer)

    player1.count=1
    player2.count=1

    socket.on('punchIn', function(player){
        if(roundOver)return
        if(player===1){    
            console.log('player'+player+' is punching')
            if(player1.count)player1.count++
            if(player1.count>=92)gameover(1)    
            $('#p1').removeClass('li-idle');
            $('#p1').addClass('li-punch');
            $('#p2-health').css('right', '-'+ player1.count/2 +'%')
            sfx.kick.load()
            sfx.kick.play()

        }else if(player===2){
            console.log('player'+player+' is punching')
            if(player2.count)player2.count++
            if(player2.count>=92)gameover(2)    
            $('#p2').removeClass('ryu-idle');
            $('#p2').addClass('ryu-punch');
            $('#p1-health').css('left', '-'+ player2.count/2 +'%')
            sfx.punch.load()
            sfx.punch.play()
        }
    })

    $(document).on('keydown', function(e) {
        if(roundOver)return
        if(e.keyCode===65){
            if(player1.count)player1.count++
            if(player1.count>=46)gameover(1)    
            $('#p1').removeClass('li-idle');
            $('#p1').addClass('li-punch');
            $('#p2-health').css('right', '-'+ player1.count +'%')
            sfx.kick.load()
            sfx.kick.play()
        }else if(e.keyCode===76){
            if(player2.count)player2.count++
            if(player2.count>=46)gameover(2)    
            $('#p2').removeClass('ryu-idle');
            $('#p2').addClass('ryu-punch');
            $('#p1-health').css('left', '-'+ player2.count +'%')
            sfx.punch.load()
            sfx.punch.play()
        }
    });
}

function stop(){
    $('#p1').removeClass('li-punch').addClass('li-idle'); 
    $('#p2').removeClass('ryu-punch').addClass('ryu-idle');
}

function gameover(winner){
    stop()
    roundOver = true
    if(winner===1){
        sfx.liWins.play()
        sfx.ryuLose.play()
        $('#p1').removeClass('chunli-idle').addClass('chunli-win');
        $('#p2').removeClass('ryu-idle').addClass('ryu-ko');
        setTimeout(function(){
            $('#p2').css('-webkit-animation-play-state', 'paused')
        }, 1800); 
    }    
    else{ 
        $('#p2').removeClass('ryu-idle').addClass('ryu-win');
        setTimeout(function(){
            $('#p2').css('-webkit-animation-play-state', 'paused')
        }, 700); 
        $('#p1').removeClass('chunli-idle').addClass('chunli-ko');
        setTimeout(function(){
            $('#p1').css('-webkit-animation-play-state', 'paused')
        }, 1800); 
        sfx.ryuWins.play()
        sfx.liLose.play()
    }
    $('#player'+winner+'-area').prepend(messages['p'+winner])
    console.log('game over player '+winner + ' wins!')
    socket.emit('gameOver', winner)

}
$('body').click(reset);

$(document).on('keyup', _.debounce(stop,150))
