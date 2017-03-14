'use strict';
page.ctrl('phoneAudit', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	var urlStr = "http://192.168.1.124:8080";
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
			current: '电核',
			orderDate: _orderDate
		});
		$location.location();
	}
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		var data={};
		data['taskId']=$params.taskId;
		data['pageCode']='loanTelResApproval';
		$.ajax({
			url: 'http://localhost:8083/mock/phoneaudit',
			data: data,
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				// 启动面包屑
				if($params.path) {
					var _loanUser = $scope.result.data.KHXX.userName;
					setupLocation(_loanUser);
					loadGuide(result.cfgData)
				}
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
				loanFinishedSelect();
				setupEvent();
				leftArrow();
			})
		})
	}
	
//	var loadTabList = function(cb) {
//		var data={};
//		data['taskId']=80872;
//		$.ajax({
//			url: urlStr+'/telAdudit/info',
//			data: data,
//			dataType: 'json',
//			  ,
//			success: $http.ok(function(result) {
//				render.compile($scope.$el.$tab, $scope.def.tabTmpl, result.cfgData, true);
//				if(cb && typeof cb == 'function') {
//					cb();
//				}
//				setupEvent();
//				leftArrow();
//			})
//		})
//	}
	
	/**
	* 加载左侧导航菜单
	* @params {object} cfg 配置对象
	*/
	function loadGuide(cfg) {
		if(cfg) {
			render.compile($scope.$el.$tab, $scope.def.tabTmpl, cfg, true);
			return listenGuide()
		}
		var params = {
			taskId: $params.taskId,
			pageCode: "loanTelApproval"
		}
		$.ajax({
			url: 'http://localhost:8083/mock/phoneaudit',
			data: params,
			type: 'post',
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
				orderNo: 0
			}
			router.innerRender('#eleCheck', 'loanProcess/'+pageCode, params);
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
		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.$el = {
			$tab: $console.find('#checkTabs'),
			$tbl: $console.find('#eleCheck')
		}
		loadLoanList();
//		loadTabList();
	})
});



