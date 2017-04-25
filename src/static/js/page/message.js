page.ctrl('message', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: 1,
			pageSize: 20
		};
	$scope.tabType = 0;
	$scope.cache = {};

	var internel = {};
	//设置tab
	internel.setTab = function(_tab) {
		$scope.$el.$tabs.filter('.role-item-active').removeClass('role-item-active');
		$scope.$el.$tabs.eq(_tab).addClass('role-item-active');
		if(_tab == $scope.tabType) return;
		$scope.tabType = _tab;
		router.updateQuery({
			tab: _tab
		})
		internel.loadList();
	}
	//加载列表
	internel.loadList = function() {
		var api = '',
			titleKey = '',
			idKey = '',
			timeKey = '';
		switch ($scope.tabType) {
			case 1:
				idKey = 'noticeId';
				titleKey = 'noticeTitle';
				timeKey = 'noticePublishTime';
				api = $http.api('notice/list', true);
			break;
			default:
				idKey = 'orderNo';
				timeKey = 'createDate';
				titleKey = 'title';
				api = $http.api('busiMsg/page', true);
			break;
		}
		$.ajax({
			url: api,
			data: apiParams,
			dataType: 'json',
			success: $http.ok(function(xhr) {
				$scope.cache.list = xhr.data;
				var data = xhr.data;
				if(!data.length) {
					data.push({
						mock: true,
						title: '暂无消息'
					})
				}
				data = {
					items: data,
					title: titleKey,
					id: idKey,
					time: timeKey
				}
				render.compile($scope.$el.$list, $scope.def.rowTmpl, data, true);
				internel.setupPaging(xhr.page, true);
			})
		})
	}

	internel.listen = function() {
		$console.on('click', '.detailEvt', function() {
			var $that = $(this);
			var idx = $that.data('idx');
			var item = $scope.cache.list[idx];
			//订单操作提醒
			if(!$scope.tabType) {
				return router.render('loanProcess/' + item.loanMaterialsUpload, {

				})
			}
			router.render('message/detail', {
				id: item.noticeId,
				path: 'message'
			})
		})

		$scope.$el.$tabs.on('click', function() {
			var tab = $(this).data('type');
			internel.setTab(tab);
		})
	}

	internel.setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$scope.$el.$paging.paging();
	}


	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.pageNum = _page;
		internel.loadList();
	}

	$console.load(router.template('iframe/news-list'), function() {
		$scope.def.rowTmpl = $console.find('#rowTmpl').html();
		$scope.$el = {
			$tabs: $console.find('.role-item'),
			$list: $console.find('#msgContent'),
			$paging: $console.find('#pageToolbar')
		}
		internel.loadList();
		internel.setTab($params.tab || 0);
		internel.listen();
	})
})