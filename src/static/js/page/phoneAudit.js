'use strict';
page.ctrl('phoneAudit', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	/**
	* 加载电话审核数据
	* @params {object} params 请求参数 
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		var params = {
			taskId: $params.taskId,
			frameCode: $params.code
		};
		$.ajax({
			url: $http.api('telAdudit/info', 'jbs'),
			data: params,
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				loanFinishedSelect();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	
	//页面加载完成对所有下拉框进行赋值	
	var loanFinishedSelect = function(){
		$(".selecter").each(function(){
			$("li",$(this)).each(function(){
				var selected = $(this).data('select');
				var val = $(this).data('key');
				var text = $(this).text();
				if(selected){
					$(this).parent().parent().siblings(".placeholder").html(text);
					$(this).parent().parent().siblings("input").val(val);
					$(this).parent().parent().siblings(".placeholder").attr('title',val);
					var value2 = $(this).parent().parent().siblings("input").val();
					if(!value2){
						$(this).parent().parent().siblings(".placeholder").html("请选择")
					}
				}
			})
			$(".selectOptBox1").hide(); 
		});
	}
	//点击下拉框拉取选项	
	$(document).on('click','.selecter', function() {
		$(".selectOptBox1",$(this)).show();
	})
	//点击下拉选项赋值zhy
	$(document).on('click', '.selectOptBox1 li', function() {
		var value = $(this).data('key');
		var text = $(this).text();
		console.log(value);
		$(this).parent().parent().siblings(".placeholder").html(text);
		$(this).parent().parent().siblings(".placeholder").attr('title',text);
		$(this).parent().parent().siblings("input").val(value);
		var value1 = $(this).parent().parent().siblings("input").val();
		if(!value1){
			$(this).parent().parent().siblings(".placeholder").html("请选择");
		}else{
			$(this).parent().parent().parent().removeClass("error-input");
			$(this).parent().parent().siblings("i").remove();
		}
		$(".selectOptBox1").hide();
		return false;
	});

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/phoneAudit'), function() {
		$scope.def.listTmpl = $console.find('#eleChecktmpl').html();
//		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.$el = {
//			$tab: $console.find('#checkTabs'),
			$tbl: $console.find('#eleCheck')
		}
		loadLoanList();
	})
});



