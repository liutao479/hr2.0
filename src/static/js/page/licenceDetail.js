'use strict';
page.ctrl('licenceDetail', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			orderNo: 'nfdb2016102421082285',
			sceneCode: 1 //1上牌 2上牌审核 3抵押 4抵押审核
		};
	/**
	* 加载上牌办理详情数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceDetail = function(params, cb) {
		$.ajax({
			url: $http.api('loanUserMaterials/getRegisterCertificate', 'cyj'),
			type: 'get',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			current: '上牌办理详情',
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: tool.formatDate($scope.result.data.loanTask.createDate, true)
		});
		$location.location();
	}

	/**
	* 设置退回原因
	*/
	var setupBackReason = function() {
		var $backReason = $console.find('#backReason');
		var _backReason;
		if($scope.result.data.loanTask.backReason) {
			_backReason = $scope.result.data.loanTask.backReason;
		} else {
			_backReason = false;
		}
		$backReason.data({
			backReason: _backReason,
			// backUser: $scope.result.data.loanTask.assign,
			// backUserPhone: $scope.result.data.loanTask.backUserPhone,
			// orderDate: $scope.result.data.loanTask.createDate（后台开发好，使用这个）
			backUser: '刘东风',
			backUserPhone: '13002601637',
			backDate: '2017-2-18  12:12'
		});
		$backReason.backReason();
	}

	var setupEvt = function() {

	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/licence-detail'), function() {
		$scope.def.listTmpl = render.$console.find('#loanUploadTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#registerPanel')
		}
		console.log(apiParams)
		loadLicenceDetail(apiParams, function() {
			setupEvt();
		});
	});


});