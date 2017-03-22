'use strict';
page.ctrl('licenceStatis', [], function($scope) {
	var $console = render.$console,
		apiParams = {
			operation: 1, //上牌进度接口
			pageNum: 1,
			pageSize: 20
		};
	/**
	* 加载上牌进度统计信息表数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLicenceStatisList = function(params, cb) {
		console.log(params)
		$.ajax({
			url: $http.api('loanRegistration/List', 'cyj'),
			type: 'post',
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
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
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
				loadLicenceStatisList(apiParams, function() {
					that.blur();
				});
			}
		});

		// 文本框失去焦点记录文本框的值
		$console.find('#searchInput').on('blur', function(evt) {
			var that = $(this),
				searchText = $.trim(that.val());
			if(!searchText) {
				delete apiParams.keyWord;
				return false;
			} else {
				apiParams.keyWord = searchText;
			}
		});

		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			apiParams.pageNum = 1;
			loadLicenceStatisList(apiParams);
			
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			$console.find('.select input').val('');
			$console.find('#searchInput').val('');
			apiParams = {
				operation: 1, //上牌审核接口
				pageNum: 1,
				pageSize: 20
			};
		});

		// 导出超期记录
		$console.find('#importItems').on('click', function() {
			alert('导出超期记录');
		})
	}


	/**
	 * 多次渲染列表内按钮的事件
	 */
	var setupEvt = function() {
		// 进入详情页
		$console.find('#licenceStatisTable .button').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				orderNo: that.data('id'),
				path: 'licenceStatis'
			});
		});
	}
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/licence-statis'), function() {
		$scope.def.listTmpl = render.$console.find('#licenceStatisListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#licenceStatisTable'),
			$paging: $console.find('#pageToolbar')
		}
		setupDropDown();
		loadLicenceStatisList(apiParams, function() {
			evt();
		});
	});

	/**
	 * 下拉数据回调
	 * @param  {[type]}   _pageNum [页码]
	 * @param  {[type]}   _size    [每页显示条数]
	 * @param  {[type]}   $el      [分页器dom对象]
	 * @param  {Function} cb       [回调函数]
	 * @return {[type]}            [description]
	 */
	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		loadLicenceStatisList(apiParams);
		cb();
	}


	/**
	 * 下拉框点击回调
	 */
	$scope.statusPicker = function(picked) {
		if(picked.id == '全部') {
			delete apiParams.status;
			return false;
		}
		apiParams.status = picked.id;
	}

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
		},
		status: function(t, p, cb) {
			var data = [
				{
					id: '全部',
					name: '全部'
				},
				{
					id: 0,
					name: '未办理'
				},
				{
					id: 1,
					name: '待审核'
				},
				{
					id: 2,
					name: '已审核'
				},
				{
					id: 4,
					name: '审核退回'
				}
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
		}
	}
});