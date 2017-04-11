'use strict';
page.ctrl('materialInspection', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			orderNo: $params.orderNo,
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
	/*发起核查*/
	var openDialog=function(that,_data){

			/*	<li><div class="text-bt">银行</div>\
					<div class="serviceContext clearfix">\
						<p class="text-icon"><span class="bac73c7df"><i class="iconfont">&#xe6bb;</i></span></p>\
						<p class="text-name">购房发票核查\
				<li><div class="text-bt">银行</div>\
					<div class="serviceContext clearfix">\
						<p class="text-icon"><span class="bacAgain"><i class="iconfont">&#xe673;</i></span></p>\
						<p class="text-name">银行流水核查\
				<li><div class="text-bt">银行</div>\
					<div class="serviceContext clearfix">\
						<p class="text-icon"><span class="bac59cfb7"><i class="iconfont">&#xe679;</i></span></p>\
						<p class="text-name">房产证核查\
				<li>\
					<div class="serviceContext clearfix">\
						<p class="text-icon"><span class="bac82b953"><i class="iconfont">&#xe672;</i></span></p>\
						<p class="text-name">合格证核查\
				<li>\
					<div class="serviceContext clearfix">\
						<p class="text-icon"><span class="bac84bef0"><i class="iconfont">&#xe642;</i></span></p>\
						<p class="text-name">保单核查\
				<li>\
					<div class="serviceContext clearfix">\
						<p class="text-icon"><span class="bacf5bf5b"><i class="iconfont">&#xe6cc;</i></span></p>\
						<p class="text-name">车辆登记核查\
				</li>\*/
		that.openWindow({
			title:"———— 服务项目 ————",
			width:"70%",
			content: dialogTml.wContent.serviceItems,				
			data:_data//0：未核查，1:未查询，缺少相关数据,2: 查询中,3：已核查
		},function($dialog){
			$dialog.find(".nextDialog").click(function() {
				$dialog.remove();
				var userData=[
					{checkStatus:0,funcName:"王可可"},
					{checkStatus:1,funcName:"李冰冰"},
					{checkStatus:2,funcName:"弘毅"},
				];
				that.openWindow({
					title:"———— 服务项目 ————",
					width:"70%",
					content: dialogTml.wContent.btngroup,	
					commit: dialogTml.wCommit.cancelSure,			
					data:userData
				},function($dia){
					var _arr=[];
					$dia.find(".block-item-data:not(.not-selected)").click(function() {
						$(this).toggleClass("selected");	
						var _index=$(this).data("index");
						var _thisVal=userData[_index].funcName;
						if($(this).hasClass("selected"))
							_arr.push(_thisVal);	
						else
							_arr.splice(_thisVal,1);
					});
					$dia.find(".w-sure").click(function() {
						$dia.remove();
						if(_arr.length==0)
							return false;
						$.ajax({
							type: 'post',
							dataType:"json",
							url: $http.api('creditAudit/startVerify'),
							data: {
								apiKeys:"",
								orderNo:apiParams.orderNo,
								userIds:_arr.join("_")
							},
							success: $http.ok(function(res) {
								var jc=$.dialog($scope.def.toastTmpl,function($dialog){
									var context=$(".jconfirm .jconfirm-content").html();
									if(context){
										setTimeout(function() {
											jc.close();
										},1500);
									};
								});
							})
						});
					});
				});	
			});
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
		/*获取核查列表*/
		$scope.$el.$startCheck.click(function(){
			var that=$(this);
			$.ajax({
				type: 'post',
				dataType:'json',
				url: $http.api('loanAudit/verifyItemList'),
				data: {
					userId:"",
					orderNo:apiParams.orderNo
				},
				success: $http.ok(function(res) {
					if(res&&res.data&&res.data.length>0)
						openDialog(that,res.data);
					else
						openDialog(that,[]);
				})
			});
		});
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/material-inspection'), function() {
		$scope.def.tabTmpl = render.$console.find('#roleBarTabTmpl').html();
		$scope.def.listTmpl = render.$console.find('#materialInspection').html();
		$scope.def.toastTmpl = render.$console.find('#importResultTmpl').html();
		$scope.$el = {
			$tab: $console.find('#roleBarTab'),
			$startCheck: $console.find('#startCheck'),
		};
		search(apiParams, function() {
			evt();
		});
	});
});



