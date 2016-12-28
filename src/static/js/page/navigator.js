/**
* 顶部二维码、消息和用户展开效果
**/
$('#QR-Code').hover(function() {
	$(this).find('.QR-Code-area').toggle();
})

//消息
$('#message').on('click',function(e) {
	$(this).find('.message-area').show();
	$(document).one("click",function() {
        $('#message').find('.message-area').hide();
   	});
    e.stopPropagation();
})
$('#message').find('.message-area').on("click",function(e) {
    e.stopPropagation();
});
$('#message').on('mouseleave',function() {
	$('#message').find('.message-area').hide();
})

//用户名
$('#user').on('click', function(e) {
	$(this).find('.user-area').show();
	$(this).find('.iconfont').html('&#xe66c;');
	$(document).one("click",function() {
        $('#user').find('.user-area').hide();
        $('#user').find('.iconfont').html('&#xe621;');
   	});
    e.stopPropagation();
})
$('#user').find('.user-area').on("click",function(e) {
    e.stopPropagation();
});
$('#user').on('mouseleave',function() {
	$('#user').find('.user-area').hide();
	$('#user').find('.iconfont').html('&#xe621;');
})