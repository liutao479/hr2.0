'use strict';
page.ctrl('preAudit', function($scope) {
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
				render.compile($scope.$el.$list, $scope.def.listTmpl, result.data, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	/*发起核查*/
	var openDialog=function(that,_data){
		that.openWindow({
			title:"核查项目选择",
			content: dialogTml.wContent.btngroup,
			commit: dialogTml.wCommit.cancelSure,
			data:_data
		},function($dialog){
			var _arr=[];
			$dialog.find(".block-item-data:not(.not-selected)").click(function() {
				$(this).toggleClass("selected");	
				var _index=$(this).data("index");
				var _thisVal=_data[_index].apiKey;
				if($(this).hasClass("selected"))
					_arr.push(_thisVal);	
				else
					_arr.splice(_thisVal,1);
			});
			$dialog.find(".w-sure").click(function() {
				$dialog.remove();
				if(_arr.length==0)
					return false;
				$.ajax({
					type: "post",
					url: $http.api('creditAudit/startVerify'),
					data:{
						apiKeys:_arr.join('_'),
						orderNo:apiParams.orderNo,
						userId:""
					},
					dataType:"json",
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
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
 		/*请求核查列表*/
		$scope.$context.off("click",".gocheck").on("click",".gocheck", function() {
			var that=$(this);
			$.ajax({
				type: 'post',
				dataType:'json',
				url: $http.api('creditAudit/itemList'),
				data: {
					userId:""
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
	render.$console.load(router.template('iframe/pre-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#preAuditTmpl').html();
		$scope.def.toastTmpl = render.$console.find('#importResultTmpl').html();
		$scope.$context=$console.find('#pre-audit');
		$scope.$el = {
			$list: $console.find('#preAuditGroup'),
		};
		search(apiParams, function() {
			evt();
		});
	});
});