'use strict';
page.ctrl('loanAudit', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: $http.api($http.apiMap.loanAudit),
			data: params,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
	/***
	* 点击对应的保存按钮
	*/
				$("#save_1").on("click",function(){
//1表单序列化/					
//		            var data =  $("#loanOrgn").serialize(); 
//						data=data+"&individuationLoanInfo.orderNo="+$scope.orderNo+"&individuationLoanInfo.category="+0;
//					var numberList = $("#loanOrgn").find("input");
//				    for(var i=0; i<numberList.length;i++){
//				    	var numberEl = numberList[i];
//				    	if(numberEl.value!='' && !base.isNumber(numberEl.value)){
//				    		base.alert("请填写数字");
//				    		return;
//				    	}
//				    }
//2、单个					
//				    var data = {
//				            'orderNo': orderNo
//				        };
//			        data['name1'] = $('#yourformid').serialize();
			        
			        
			        
//					$.ajax({
//			            type: "POST",
//			            url:'',
//			            data:data,
//			            async: false,
//			            error: function(request) {
//			                alert("Connection error");
//			            },
//			            success: function(data) {
//							render.$console.load(router.template('loan-audit'), function() {
//								$scope.def.listTmpl = render.$console.find('#loanAudittmpl').html();
//								$scope.$el = {
//									$tbl: $console.find('#loanAudit'),
//								}
//								if($params.process) {
//									
//								}
//								loadLoanList(apiParams);
//							});
//			            }
//			        });
			        alert(1);
				});
				$("#gcxx").on("click",function(){
					alert(2);
				});
			})
		})
	}
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('loan-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#loanAudittmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanAudit'),
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});
});



