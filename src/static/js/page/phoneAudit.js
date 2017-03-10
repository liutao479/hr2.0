'use strict';
page.ctrl('phoneAudit', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	var urlStr = "http://192.168.0.121:8080";
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		var data={};
		data['taskId']=80873;
//		data['pageCode']='loanTelResApproval';
		$.ajax({
			url: urlStr+'/telAdudit/info',
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
//				$scope.result = result;
//				// 启动面包屑
//				var _loanUser = $scope.result.data[0].loanUserCredits[0].userName;
//				setupLocation(_loanUser);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
				loanFinishedSelect();
				setupEvent();
			})
		})
	}
	var loadTabList = function(cb) {
		var data={};
		data['taskId']=80872;
		$.ajax({
			url: urlStr+'/loanTelApproval/info',
			data: data,
			dataType: 'json',
			async:false,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tab, $scope.def.tabTmpl, result.cfgData, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	var setupEvent = function() {
		$console.find('#checkTabs a').on('click', function() {
			$('.role-item').each(function(){
				$(this).removeClass('role-item-active');
			})
			var that = $(this);
			var idx = that.data('idx');
			that.addClass('role-item-active');
			$(".tabTrigger").each(function(){
				$(this).hide();
				var trig = $(this).data('trigger');
				if(trig == idx){
					$(this).show();
					return false;
				}
			})
		});
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
//			$(this).parent().parent().after("<div class='opcity0'>这个是新增的div</div>");
		}
		$(".selectOptBox1").hide();
		return false;
	})
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/phoneAudit'), function() {
		$scope.def.listTmpl = $console.find('#eleChecktmpl').html();
		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.$el = {
			$tab: $console.find('#checkTabs'),
			$tbl: $console.find('#eleCheck')
		}
		loadLoanList();
		loadTabList();
	})
});



