/**
* 顶部二维码、消息和用户展开效果
**/

//二维码
$('#QR-Code').hover(function() {
	$(this).find('.QR-Code-area').toggle();
})

//消息
$('#message').hover(function() {
	$(this).find('.message-area').show();
},function() {
	$(this).find('.message-area').hide();
});

//用户名
$('#user').hover(function() {
	$(this).find('.user-area').show();
},function() {
	$(this).find('.user-area').hide();
});
