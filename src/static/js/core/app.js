//$('#menu > a').on('click', function() {
//	var tar = $(this).data('href');
//	window.location.href = window.location.href + '#' + tar;
//	
//})
//$('#pageToolbar').Paging({pagesize:10,count:85,toolbar:true});	
var isOpen = false; 
$('#remind-tips').on('click',function (){
	if(!isOpen) {
		$('#remind').animate({
			right: '155px'
		},200);
		$(this).find('.iconfont').html('&#xe605;');
		isOpen = true;
	} else {
		$('#remind').animate({
			right: '0'
		},200);
		$(this).find('.iconfont').html('&#xe697;');
		isOpen = false;
	}
});


//右边栏
$('.sideBar-item').hover(function() {
	$(this).find('.sideBar-content').show();	
},function() {
	$(this).find('.sideBar-content').hide();		
});


//单选框
$('.checkbox-normal').on('selectstart', false);
$('.checkbox-normal').on('click', function() {
	if(!$(this).attr('checked')) {
		$(this).addClass('checked').attr('checked',true);
		$(this).html('<i class="iconfont">&#xe659;</i>');
	} else {
		$(this).removeClass('checked').attr('checked',false);
		$(this).html('');
	}
})

$(function() {
	
})



