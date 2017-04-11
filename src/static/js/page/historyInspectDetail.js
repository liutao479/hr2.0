'use strict';
page.ctrl('historyInspectDetail', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		model=[
			{type:1,text:"登记证状态",id:"Registration"},
			{type:2,text:"抵押记录",id:"MortgageRecord"},
			{type:3,text:"法院记录",id:"CourtRecord"},
			{type:4,text:"公安信息",id:"PoliceInformation"},
			{type:5,text:"购车发票信息",id:"InvoiceInformation"},
			{type:6,text:"网贷记录",id:"NetLoanRecord"},
		];
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'get',
			dataType:"json",
			url: $http.api('historyInspectDetail'),
			data: param,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$console.off("click",".gocheck").on("click",".gocheck", function() {
			
		});
 	};
 	
	// 加载页面模板
	$console.load(router.template('iframe/history-inspect-detail'), function() {
		if(!($params&&$params.type))
			return false;
		var _obj=model.filter(it=>it.type==$params.type);
		if(!(_obj&&_obj.length==1))
			return false;
		$scope.def.listTmpl = $console.find('#'+_obj[0].id).html();
		$console.find(".path-back-bar .current-page").text(_obj[0].text);
		$scope.$el = {
			$tbl: $console.find('#tableContext')
		};
		search($params, function() {
			evt();
		});
	});
});



