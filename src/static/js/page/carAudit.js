'use strict';
page.ctrl('carAudit', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
	/**
	* 设置面包屑
	*/
	var setupLocation = function(loanUser) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		var _orderDate = tool.formatDate($scope.$params.date, true);
		$location.data({
			backspace: $scope.$params.path,
			loanUser: loanUser,
			current: '审核列表',
			orderDate: _orderDate
		});
		$location.location();
	}
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadTabList = function(cb) {
		var data={};
		data['taskId']=80872;
		$.ajax({
			url: urlStr+'/loanTelApproval/info',
			data: data,
			dataType: 'json',
			  ,
			success: $http.ok(function(result) {
				$scope.result = result;
//				// 启动面包屑
//				var _loanUser = $scope.result.data[0].loanUserCredits[0].userName;
//				setupLocation(_loanUser);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.cfgData, true);
				render.compile($scope.$el.$tab, $scope.def.tabTmpl, result.cfgData, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	var loadPhoneList = function(cb) {
		var data={};
		data['taskId']=80872;
		data['pageCode']='loanTelResApproval';
		$.ajax({
			url: urlStr+'/telAdudit/info',
			data: data,
			dataType: 'json',
			  ,
			success: $http.ok(function(res) {
				$scope.res = res;
				render.compile($scope.$el.$tphone, $scope.def.phoneTmpl, res.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 绑定立即处理事件
	*/
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
	var loadPage = function(){
		$("#pagePhone").load("iframe/phoneAudit.html",function(){
			var that =$("#eleCheck");
			var data111={};
			data111['taskId']=80872;
			data111['pageCode']='loanTelTabApproval';
			$.ajax({
				url: urlStr+'telAdudit/info',
				data: data111,
				dataType: 'json',
				  ,
				success: $http.ok(function(xhr) {
					console.log(xhr);
					render.compile(that, $scope.def.phoneTmpl, xhr.data, true);
				}),
				error: $http.ok(function(err) {
					console.log(err.msg);
				})
			});
		});
	};
	
	
	
	
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/carAudit'), function() {
		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.def.listTmpl = $console.find('#pickCarchecktmpl').html();
		$scope.def.phoneTmpl = $console.find('#pagePhonetmpl').html();
		$scope.$el = {
			$tphone: $console.find('#pagePhone'),
			$tab: $console.find('#checkTabs'),
			$tbl: $console.find('#pickCarcheck')
		}
		loadTabList();
		loadPhoneList();
	})
});



