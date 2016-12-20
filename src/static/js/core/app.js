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
			right: "195px"
		},500);
		$("#iconfont-shouqi").removeClass("icon-shouqi").addClass("icon-collapse-right");
		isOpen = true;
	} else {
		$("#remind").animate({
			right: "0"
		},500);
		$("#iconfont-shouqi").removeClass("icon-collapse-right").addClass("icon-shouqi");
		isOpen = false;
	}
});
