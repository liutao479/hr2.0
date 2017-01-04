//$('#menu > a').on('click', function() {
//	var tar = $(this).data('href');
//	window.location.href = window.location.href + '#' + tar;
//	
//})
//$('#pageToolbar').Paging({pagesize:10,count:85,toolbar:true});	
var isOpen = false; 
$("#remind-tips").on("click",function (){
	if(!isOpen) {
		$("#remind").animate({
			right: "155px"
		},500);
		$(this).find(".iconfont").html("&#xe605;");
		isOpen = true;
	} else {
		$("#remind").animate({
			right: "0"
		},500);
		$(this).find(".iconfont").html("&#xe697;");
		isOpen = false;
	}
});


//右边栏
$(".sideBar-item").hover(function() {
	$(this).find(".sideBar-content").show();	
},function() {
	$(this).find(".sideBar-content").hide();		
});
