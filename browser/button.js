var me;

window.onload = function() {
    $(".button").bind('touchstart', function(){
        socket.emit('punch')
        $('#btn').removeClass('button-up');
        $('#btn').addClass('button-down');
    }).bind('touchend', function(){
        socket.emit('end')
        $('#btn').removeClass('button-down');
        $('#btn').addClass('button-up');
    });
}

socket.on('over', function(winner){
	console.log('received')
	if(winner===me){
		// $('#btn').append('<h1 class="win-msg giga">You win!</h1>')
	}else{
		// $('#btn').append('<h1 class="win-msg giga">You lose!</h1>')

	}
})

function reset(){
   // location.reload()
}

socket.on('reset', reset)

socket.on('you', function(player){
	me = player
	$('#btn').append('<h1 class="big">P'+player+'</h1>')
})
