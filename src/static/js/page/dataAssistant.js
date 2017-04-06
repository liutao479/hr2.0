'use strict';
page.ctrl('dataAssistant', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1,
		};
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'get',
			dataType:"json",
			url: $http.api('materialInspection'),
			data: param,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tab, $scope.def.tabTmpl, result.data, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$scope.$el.$tab.off("click","li.role-bar-li").on("click","li.role-bar-li",function() {
			if($(this).siblings("li").length>0){
				$(this).siblings("li").find("a").removeClass("role-item-active");
				$(this).find("a").addClass("role-item-active");
				//search();
			};
		});
		$console.off("click",".gocheck").on("click",".gocheck", function() {
			
		});
		/*画百分比相关start*/
		var percentage=function(x){
			var c=document.getElementById(x.id);
			var ctx=c.getContext("2d");
			ctx.canvas.width=x.width;
			ctx.canvas.height=x.width;
			/*画背景*/
			ctx.beginPath();
			ctx.lineWidth=x.lineWidth;
			ctx.strokeStyle=x.color[0];
			ctx.arc(x.width/2,x.width/2,x.width/2-x.lineWidth,0,2*Math.PI);
			ctx.stroke();
			/*画百分比*/
			ctx.beginPath();
	        ctx.lineWidth = x.lineWidth;
	        ctx.strokeStyle = x.color[1];
	        ctx.arc(x.width/2,x.width/2,x.width/2-x.lineWidth,-90*Math.PI/180,(x.startPerent*3.6-90)*Math.PI/180);
	        ctx.stroke();
	        ctx.font = 'Arial';
	        ctx.textBaseline = "middle";
	        ctx.textAlign = 'center';
	        ctx.fillText(x.startPerent + '%', x.width / 2, x.width / 2);
	        return ctx;
		};
		var circleCanvas=[
			{
				id:"smCanvas",
				width:50,
				lineWidth:7,
				color:["#ddd","#60c4f5"],
				startPerent:0,
				endPerent:15,
				obj:null
			},
			{
				id:"mdCanvas",
				width:75,
				lineWidth:11,
				color:["#ddd","#ff5c57"],
				startPerent:0,
				endPerent:50,
				obj:null
			},
			{
				id:"lgCanvas",
				width:50,
				lineWidth:8,
				color:["#ddd","#5084fc"],
				startPerent:0,
				endPerent:45,
				obj:null
			}
		];
		var _fill=function(it){
			return function(){
				fill(it);
			};
		};
		var fill=function(it){
			if(++it.startPerent<=it.endPerent){
				if(it.obj)
					it.obj.clearRect(0, 0, it.width, it.width);
				it.obj=percentage(it);//canver画百分比
				setTimeout(_fill(it),10);
			};
		};
		for(var i=0;i<circleCanvas.length;i++){
			fill(circleCanvas[i]);
		};
		/*画百分比相关end*/
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/data-assistant'), function() {
		$scope.def.tabTmpl = render.$console.find('#roleBarTabTmpl').html();
		$scope.$el = {
			$tab: $console.find('#roleBarTab'),
		};
		search(apiParams, function() {
			evt();
		});
	});
});



