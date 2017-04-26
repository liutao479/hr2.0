'use strict';
page.ctrl('expireSingleDetail', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			page: $params.page || 1,
			pageSize: 20,
			orderNo: $params.orderNo
		};

	var internel = {};

	/**
	* 设置面包屑
	*/
	internel.location = function() {
		if(!$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $params.path,
			current: '逾期记录'
		})
		$location.location();
	}

	/**
	* 添加记录
	*/
	internel.addRecord = function($ctn, cb) {
		var params = {
			'orderNo': $params.orderNo
		}
		var $err = $ctn.find('.color-red');
		var _date = $ctn.find('#billDate').val(),
			_card = $ctn.find('#card').val(),
			_cardBalance = $ctn.find('#cardNumber').val(),
			_overdueAmount = $ctn.find('#overdueAmount').val(),
			_companyAdvance = $ctn.find('#companyAdvance').val(),
			_cumulativeDefaultNum = $ctn.find('#cumulativeDefaultNum').val(),
			_currentDefaultNum = $ctn.find('#currentDefaultNum').val();
		if(!_overdueAmount) {
			$err.html('当前逾期金额不能为空');
			return false;
		}
		params.billDate = _date;
		params['currentDefaultNum'] = _currentDefaultNum;
		params['cardBalance'] = _cardBalance;
		params['overdueAmount'] = _overdueAmount;
		params['companyAdvance'] = _companyAdvance;
		params['cumulativeDefaultNum'] = _cumulativeDefaultNum;
		params['cardNumber'] = _card;
		$.ajax({
			url: $http.api('loanOverdueRecord/insert', true),
			data: params,
			type: 'post',
			global: false,
			dataType: 'json',
			success: $http.ok(function(result) {
				cb(true);
			}),
			error: function() {
				$err.html('提交失败，请稍后重试');
			}
		})
		return false;
	}

	/**
	* 设置事件监听
	*/
	internel.listen = function() {
		$console.find('#newRecord').on('click', function() {
			$.confirm({
				title: '新增逾期记录',
				content: 'url:./defs/record.add.html',
				onContentReady: function() {
					var self = this;
					self.$content.find('.datepicker').datepicker();
					this.$content.find('.datepicker').on('click', function() {
						setTimeout(function() {
							$('iframe').parent().css({
								zIndex: 1000000
							})
						}, 2);
					})
				},
				buttons: {
					cancel: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var self = this;
							return internel.addRecord(self.$content, function(status) {
								if(status) {
									$.alert({
										title: '成功',
										content: '<div class="w-content">逾期记录增加成功</div>',
										autoClose: 'ok|3000',
										buttons: {
											ok: {
												text: '确定',
												action: function() {
													apiParams.pageNum = 1;
													internel.loadList(apiParams);
												}
											}
										}
									})
									self.close();
								}
							})
						}
					}
				}
			})
		})
	}

	/**
	* 加载列表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	internel.loadList = function(params, cb) {
		$.ajax({
			url: $http.api('loanOverdueRecord/queryRecordList', true),
			data: params,
			dataType:'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupPaging(result.page.pages, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(count, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.page),
			pages: isPage ? count : (tool.pages(count || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$scope.$el.$paging.paging();
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/expire-single-detail'), function() {
		$scope.def.listTmpl = render.$console.find('#expireSingleDetailTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireSingleDetailTable'),
			$paging: $console.find('#pageToolbar')
		}
		internel.loadList(apiParams);
		internel.location();
		internel.listen();
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		internel.loadList(apiParams);
		cb();
	}
});



