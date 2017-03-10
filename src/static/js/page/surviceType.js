'use strict';
page.ctrl('surviceType', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		$source = $scope.$source = {},
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	var urlStr = "http://192.168.0.103:8080";

	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		var data={};
			data['taskId']=80871;
		$.ajax({
			url: urlStr+'/serviceType/index',
			data: data,
			dataType: 'json',
			async:false,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
				loanFinishedInputPic();
			})
		});
	}
//页面加载完成对框进行设置
	var loanFinishedInputPic = function(){
		var val = $("#dataKey").val();
		if(!val){
			$(".choose-items").each(function (){
				$(this).removeClass('surviceClick');
			})
		}else{
			$(".choose-items").each(function (){
				var key = $(this).data('key');
				if(key == val){
					$(this).addClass('surviceClick');
					$(this).siblings().removeClass('surviceClick');
					return false;
				}
			})
		}
	}
	
	$(document).on('click','.choose-items', function() {
		$(".choose-items").each(function (){
			$(this).removeClass('surviceClick');
		})
		$(this).addClass('surviceClick');
		var key = $(this).data('key');
        $("#dataKey").val(key);
        console.log($("#dataKey").val());
	})


	/***
	* 保存按钮
	*/
	$(document).on('click', '.saveBtn', function() {
		var isTure = true;
		var surviceType = $("#dataKey").val();
		if(!surviceType){
			isTure = false;
			return;
		}
		if(isTure){
			var key = $(this).data('key');
			var data;
	        var formList = $('#dataform');
	        var params = formList.serialize();
            params = decodeURIComponent(params,true);
            var paramArray = params.split("&");
            var data1 = {};
            for(var i=0;i<paramArray.length;i++){
                var valueStr = paramArray[i];
                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
            }
	        console.log(data1);
	        
			$.ajax({
				type: 'POST',
				url:  urlStr+'/serviceType/submit',
				data:JSON.stringify(data1),
				dataType:"json",
				contentType : 'application/json;charset=utf-8',
				success: function(result){
					console.log(result.msg);
				}
			});
		}
	})
	
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/surviceType'), function() {
		$scope.def.listTmpl = render.$console.find('#surviceTypetmpl').html();
		$scope.$el = {
			$tbl: $console.find('#surviceTypeTable')
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});
});



