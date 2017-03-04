'use strict';
page.ctrl('loan', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			// 贷款办理列表的在线接口，为调试并行任务各页面，先使用假数据
			// type: 'get',
			// url: 'http://192.168.0.144:8080/loanOrder/workbench',
			// dataType:"json",
			// data: params,
			url: $http.api('loan.list'),
			// url: $http.api('material/addOrUpdate', 'wl'),
			success: $http.ok(function(result) {
				$scope.pageData = result.data;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupPaging(result.page, true);
				setupEvent();
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
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$('#pageToolbar').paging();
	}

	var setupEvent = function() {
		
		/**
		* 绑定搜索事件
		**/
		$console.find('#search').on('keydown', function(evt) {
			if(evt.which == 13) {
				alert("查询");
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.search = searchText;
				$params.search = searchText;
				apiParams.pageNum = 1;
				$params.pageNum = 1;
				loadLoanList(apiParams);
				// router.updateQuery($scope.$path, $params);
			}
		});
		/**
		* 绑定立即处理事件
		*/
		$console.find('#loanTable .button').on('click', function() {
			var that = $(this);
			var idx = that.data('idx');
			var loanTasks = $scope.pageData[idx].loanTasks;
			var taskObj = [];
			for(var i = 0, len = loanTasks.length; i < len; i++) {
				var obj = loanTasks[i];
				taskObj.push({
					key: obj.category,
					id: obj.id,
					name: obj.sceneName
				})
			}
			router.render(that.data('href'), {
				tasks: taskObj,
				path: 'loanProcess'
			});
		});
		// $('.select').dropdown($scope);

		/**
		* 任务类型点击显示/隐藏
		*/
		$console.find('#loanTable .arrow').on('click', function() {
			var that = $(this);
			var $tr = that.parent().parent().parent().find('.loantask-item');
			if(!that.data('isShow')) {
				$tr.show();
				that.data('isShow', true);
				that.removeClass('arrow-bottom').addClass('arrow-top');
			} else {
				$tr.hide();
				that.data('isShow', false);
				that.removeClass('arrow-top').addClass('arrow-bottom');
				$tr.eq(0).show();
				$tr.eq(1).show();
			}
		})

		/**
		* 任务类型点击排序
		*/
	}
 	
 	// 订单列表的排序
	$(document).on('click', '#time-sort', function() {
		var that = $(this);
		if(!that.data('sort')) {
			apiParams.createTimeSort = 1;
			$params.createTimeSort = 1;
			loadLoanList(apiParams, function() {
				that.data('sort', true);
				that.removeClass('time-sort-up').addClass('time-sort-down');
			});

		} else {
			delete apiParams.createTimeSort;
			delete $params.createTimeSort;
			loadLoanList(apiParams, function() {
				that.data('sort', false);
				that.removeClass('time-sort-down').addClass('time-sort-up');
			});
		}
	});
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/main'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.pageNum = _page;
		$params.pageNum = _page;
		// router.updateQuery($scope.$path, $params);
		
		loadLoanList(apiParams);
		cb();
	}
});



