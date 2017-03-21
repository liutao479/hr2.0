'use strict';
page.ctrl('licenceAudit', [], function($scope) {
	var $console = render.$console,
		apiParams = {
			overdue: 0,
			operation: 3, //上牌审核接口
			pageNum: 1,
			pageSize: 20
		};
	/**
	* 加载上牌审核信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceAuditList = function(params, cb) {
		console.log(params);
		$.ajax({
			type: 'post',
			url: $http.api('loanRegistration/List', 'cyj'),
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, function() {
					setupEvt();
				}, true);
				setupPaging(result.page, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(_page.pageNum),
			pages: isPage ? _page.pages : (tool.pages(count || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
	}

	/**
	* 启动dropdown控件
	*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	/**
	 * 首次加载页面绑定立即处理事件
	 */
	var evt = function() {
		// 绑定搜索框模糊查询事件
		$console.find('#searchInput').on('keydown', function(evt) {
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.keyWord = searchText;
				apiParams.pageNum = 1;
				loadLicenceAuditList(apiParams, function() {
					that.blur();
				});
			}
		});

		// 文本框失去焦点记录文本框的值
		$console.find('#searchInput').on('blur', function(evt) {
			var that = $(this),
				searchText = $.trim(that.val());
			if(searchText) {
				apiParams.keyWord = searchText;
			}
		});


		// 初始化复选框
		$console.find('.checkbox').checking(function($self) {
			// 复选框回调函数（有问题）
			if($self.attr('checked')) {
				apiParams.overdue = 0;
			} else {
				apiParams.overdue = 1;
			}
			apiParams.pageNum = 1;
			loadLicenceAuditList(apiParams);
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			apiParams.pageNum = 1;
			loadLicenceAuditList(apiParams);
			
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			$console.find('.select input').val('');
			$console.find('#searchInput').val('');
			$console.find('.checkbox').removeClass('checked').attr('checked', false).html('');
			apiParams = {
				overdue: 0,
				operation: 3, //上牌审核接口
				pageNum: 1,
				pageSize: 20
			};
			
		});
	}

	/**
	 * 多次渲染列表内按钮的事件
	 */
	var setupEvt = function() {
		// 进入详情页
		$console.find('#licenceAuditTable .button').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				orderNo: that.data('id'),
				path: 'licenceAudit'
			});
		});

	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/licence-audit'), function() {
		$scope.def.listTmpl = render.$console.find('#licenceAuditListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#licenceAuditTable'),
			$paging: $console.find('#pageToolbar')
		}
		setupDropDown();
		loadLicenceAuditList(apiParams, function() {
			evt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		loadLicenceAuditList(apiParams);
		cb();
	}

	/**
	 * 下拉框点击回调
	 */
	$scope.deptCompanyPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.deptName;
			return false;
		}
		apiParams.deptName = picked.name;
	}

	$scope.demandBankPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.bankName;
			return false;
		}
		apiParams.bankName = picked.name;
	}

	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		deptCompany: function(t, p, cb) {
			$.ajax({
				type: 'get',
				url: $http.api('pmsDept/getPmsDeptList', 'cyj'),
				data: {
					parentId: 99
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						id: '全部',
						name: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'name'
					};
					cb(sourceData);
				})
			})
		},
		demandBank: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'cyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					xhr.data.unshift({
						bankId: '全部',
						bankName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		}
	}
});