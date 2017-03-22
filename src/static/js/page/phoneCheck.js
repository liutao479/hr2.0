'use strict';
page.ctrl('phoneCheck', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	var urlStr = "http://192.168.1.108:8080";
	// $params.taskId = 80873;
	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: '电核',
			orderDate: $scope.result.data.loanTask.createDateStr
		});
		$location.location();
	}

	/**
	* 加载电审数据
	* @params {object} params 请求参数 
	* @params {function} cb 回调函数
	*/
	var loadTabList = function(cb) {
		var params = {
			taskId: $params.taskId
		};
		$.ajax({
			url: urlStr+'/loanApproval/info',
			data: params,
			dataType: 'json',
			success: $http.ok(function(xhr) {
				$scope.result = xhr;
				setupLocation();
				loadGuide(xhr.cfgData)
				setupEvent();
				leftArrow();
			})
		})
	}
	
	/**
	* 加载左侧导航菜单
	* @params {object} cfg 配置对象
	*/
	function loadGuide(cfg) {
		if(cfg) {
			render.compile($scope.$el.$tab, $scope.def.tabTmpl, cfg, true);
			var code = cfg.frames[0].code;
			var pageCode = subRouterMap[code];
			var params = {
				code: code,
				orderNo: $params.orderNo,
				taskId: $params.taskId
			}
			router.innerRender('#phoneCheck', 'loanProcess/'+pageCode, params);
			return listenGuide();
		}
		var params = {
			taskId: $params.taskId,
			pageCode: "loanTelApproval"
		}
		$.ajax({
			url: urlStr+'/telAdudit/info',
			data: params,
//			type: 'post',
			dataType: 'json',
			success: $http.ok(function(res) {
				render.compile($scope.$el.$tab, $scope.def.tabTmpl, res.cfgData, true);
				listenGuide();
			})
		})
	}

	function listenGuide() {
		$console.find('.tabLeftEvt').on('click', function() {
			var $that = $(this);
			var code = $that.data('type');
			var pageCode = subRouterMap[code];
			if(!pageCode) return false;
			var params = {
				code: code,
				orderNo: $params.orderNo,
				taskId: $params.taskId
			}
			router.innerRender('#phoneCheck', 'loanProcess/'+pageCode, params);
		})
	}

	var setupEvent = function() {
		$console.find('#checkTabs a').on('click', function() {
			$('.panel-menu-item').each(function(){
				$(this).removeClass('panel-menu-item-active');
			})
			var that = $(this);
			var idx = that.data('idx');
			that.addClass('panel-menu-item-active');
			leftArrow();
		});
	}
	var leftArrow = function(){
		$('.panel-menu-item').each(function(){
			$(this).find('.arrow').hide();
			if($(this).hasClass('panel-menu-item-active')){
				$(this).find('.arrow').show();
			}
		})
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/phoneCheck'), function() {
		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.$el = {
			$tab: $console.find('#checkTabs'),
		}
		loadTabList();
	})
});



