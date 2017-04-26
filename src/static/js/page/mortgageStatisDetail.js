'use strict';
page.ctrl('mortgageStatisDetail', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			orderNo: $params.orderNo
		};
	/**
	* 加载抵押进度统计详情数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadMortgageDetail = function(params, cb) {
		$.ajax({
			url: $http.api('loanPledge/index', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.data.loanTask = {
					editable: 0
				};
				result.data.cfgMaterials = [
					{
						zcdjzydy: '注册登记证（已抵押）'
					}
				];
				$scope.result = result;
				setupLocation(result.data.orderInfo);
				// console.log(result.data.backApprovalInfo)
				setupBackReason(result.data.backApprovalInfo);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	 * 加载登记证抵押信息
	 */
	var loadInfo = function(params, cb) {
		$.ajax({
			url: $http.api('loanPledgeInfo/get', 'cyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.disabled = true;
				render.compile($scope.$el.$infoPanel, $scope.def.infoTmpl, result, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function(data) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		if(!data) return false;
		$location.data({
			backspace: $scope.$params.path,
			current: '抵押进度统计详情',
			pmsDept: $scope.result.data.orderInfo.deptName,
			loanUser: $scope.result.data.orderInfo.realName || '',
			pickDate: $scope.result.data.orderInfo.pickDateStr || ''
		});
		$location.location();
	}

	/**
	* 设置退回原因
	*/
	var setupBackReason = function(data) {
		var $backReason = $console.find('#backReason');
		if(!data) {
			$backReason.remove();
			return false;
		} else {
			$backReason.data({
				backReason: data.reason,
				backUser: data.roleName,
				backUserPhone: data.phone,
				backDate: tool.formatDate(data.transDate, true)
			});
			$backReason.backReason();
		}
	}

	/**
	* 登记证材料事件
	*/
	var setupEvt = function() {
		$scope.$el.$tbl.find('.uploadEvt').imgUpload({
			viewable: true,
			markable: false,
			getimg: function(cb) {
				cb($scope.result.data.userMaterials)
			}
		});
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/mortgage-detail'), function() {
		$scope.def = {
			infoTmpl: render.$console.find('#mortgageInfoTmpl').html(),
			listTmpl: render.$console.find('#loanUploadTmpl').html()
		}
		$scope.$el = {
			$tbl: $console.find('#registerPanel'),
			$infoPanel: $console.find('#mortgageInfoPanel')
		}
		loadMortgageDetail(apiParams, function() {
			setupEvt();
		});
		loadInfo(apiParams);
	});


});