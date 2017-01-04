//测试鼠标移上提示框
$('.tips-area').hover(function() {
	$(this).find('.tips-content').toggle();
})

$('.panel-count-number-box').find('.tips').hover(function() {
	$(this).find('.tips-content').toggle();
});