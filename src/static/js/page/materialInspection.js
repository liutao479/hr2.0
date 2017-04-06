'use strict';
page.ctrl('materialInspection', function($scope) {
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
				//render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
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
		$scope.$el.$startCheck.click(function(){
			var that=$(this);
			that.openWindow({
				title:"———— 服务项目 ————",
				width:"70%",
				content: dialogTml.wContent.serviceItems,				
				data:{//1未查，2查询中，3已查，isComplete材料是否齐全
					buyCar:{isBank:true,checkStatus:3,isComplete:true},
					buyHouse:{isBank:true,checkStatus:1,isComplete:true},
					bank:{isBank:true,checkStatus:1,isComplete:false},
					houseCard:{isBank:true,checkStatus:3,isComplete:true},
					hgCard:{isBank:false,checkStatus:1,isComplete:true},
					bdHC:{isBank:false,checkStatus:2,isComplete:true},
					carDJ:{isBank:false,checkStatus:3,isComplete:true},
				}
			},function($dialog){
			});
		});
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/material-inspection'), function() {
		$scope.def.tabTmpl = render.$console.find('#roleBarTabTmpl').html();
		$scope.def.listTmpl = render.$console.find('#materialInspection').html();
		$scope.$el = {
			$tab: $console.find('#roleBarTab'),
			$startCheck: $console.find('#startCheck'),
		};
		search(apiParams, function() {
			evt();
		});
	});
});



