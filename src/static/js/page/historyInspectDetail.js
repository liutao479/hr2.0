'use strict';
page.ctrl('historyInspectDetail', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		model=[
			{type:1,text:"法院记录",id:"CourtRecord"},
			{type:2,text:"购车发票信息",id:"InvoiceInformation"},
			{type:3,text:"登记证状态",id:"Registration"},
			{type:4,text:"网贷记录",id:"NetLoanRecord"},
			{type:5,text:"公安信息",id:"PoliceInformation"},
			{type:6,text:"抵押记录",id:"MortgageRecord"}
		];
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('bankLoanAfterHistory/getDetailInfo',true),
			data: param,
			success: $http.ok(function(res) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, res.data, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$scope.$el.$backspace.click(function() {
			router.render("historyInspect");
		});
 	};
 	
	// 加载页面模板
	$console.load(router.template('iframe/history-inspect-detail'), function() {
		//$params.orderNo='nfdb2016102820480790';
		/*$params.orderNo='nfdb2016102820480799';
		$params.Id=6;
		$params.taskId=6;*/

		if(!($params&&$params.taskId&&$params.orderNo&&$params.Id))
			return false;
		var _obj=model.filter(it=>it.type==$params.taskId);
		if(!(_obj&&_obj.length==1))
			return false;
		$scope.def.listTmpl = $console.find('#'+_obj[0].id).html();
		$console.find(".path-back-bar .current-page").text(_obj[0].text);
		$scope.$context=$console.find('#history-inspect-detail');
		$scope.$el = {
			$backspace: $scope.$context.find('#backspace'),
			$tbl: $scope.$context.find('#tableContext')
		};
		search({
			orderNo:$params.orderNo,
			Id:$params.Id
		}, function() {
			evt();
		});
	});
});