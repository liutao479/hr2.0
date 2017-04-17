'use strict';
page.ctrl('creditResult', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	/**
	* 加载征信预审核数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(cb) {
		var data = {},
			url = 'creditUser/getCreditInfo';
		if($params.taskId) {
			data.taskId = $params.taskId;
		}
		if($params.refer) {
			data.frameCode = $params.code;	
		}
		if($params.type) {
			data.type = $params.type;
			data.orderNo = $params.orderNo;	
			url = 'creditUser/creditInfoByOrderNo';
		}
		$.ajax({
			type: 'post',
			url: $http.api(url, 'jbs'),
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				$scope.result = result;
				$scope.result.types = ['申请人', '共同还款人', '反担保人'];
				$scope.result.format = {
					'ZJR': 0,
					'GTHKR': 1,
					'FDBR': 2
				};
				$scope.result.userRalaMap = {
					'0': '本人',
					'1': '配偶',
					'2': '父母',
					'3': '子女',
					'-1': '其他'
				};
				$scope.result.editable = 0;
				console.log($scope.result)
				initApiParams();
				// 编译征信结果
				render.compile($scope.$el.$resultPanel, $scope.def.resultTmpl, $scope.result, function() {
					setupEvt();
				}, true);

				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}


	/**
	* 绑定立即处理事件
	*/
	var setupEvt = function() {
		//查看征信材料
		$console.find('.view-creditMaterials').on('click', function() {
			var that = $(this);
			var imgs = $scope.result.data.creditUsers[that.data('type')][that.data('idx')].creditMaterials;
			$.preview(imgs, function(img, mark, cb) {
				cb();	
			}, {
				markable: false
			});
		});
		/**
		 * 启动图片上传控件
		 */
		var imgsBars = $console.find('.creditMaterials');
		imgsBars.each(function(index) {
			$(this).find('.uploadEvt').imgUpload({
				viewable: true,
				markable: false,
				getimg: function(cb) {
					cb($scope.apiParams[index].loanCreditReportList);
				}
			});
		});
	}

	/**
	* 页面首次加载绑定立即处理事件
	*/
	var evt = function() {
		
	}

	/**
	 * 初始化提交信息的参数
	 */
	var initApiParams = function() {
		$scope.apiParams = [];
		for(var i in $scope.result.data.creditUsers) {
			for(var j = 0, len2 = $scope.result.data.creditUsers[i].length; j < len2; j++) {
				var row = $scope.result.data.creditUsers[i][j],
					item = $scope.result.data.creditUsers[i][j];
				item.creditLevel = row.creditLevel || '';
				item.creditReportFile = row.creditReportFile || '';
				item.creditReportId = row.creditReportId || '';
				item.remark = row.remark || '';
				item.idx = j;
				$scope.apiParams.push(item);
			}
		}
	}



	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/credit-result'), function() {
		$scope.def = {
			resultTmpl: $console.find('#resultTmpl').html()
		}
		$scope.$el = {
			$resultPanel: $console.find('#resultPanel')
		}
		console.log($console)
		loadOrderInfo(function() {
			
		});
		evt();
	});

	
});