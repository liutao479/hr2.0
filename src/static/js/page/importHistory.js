'use strict';
page.ctrl('importHistory', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		internel = {},
		apiParams = {
			page: 1,
			pageSize: 20
		};
	
	internel.location = function() {
		if(!$params.path) return false;
		var $location = $scope.$el.$location;
		$location.data({
			backspace: $params.path,
			current: '历史导入记录'
		})
		$location.location();
	}

	internel.setup = {
		setupDatepicker: function() {
			$scope.$el.$dStart = $console.find('#dateStart');
			$scope.$el.$dEnd = $console.find('#dateEnd');
			$scope.$el.$dEnd.val(tool.formatDate(new Date().getTime()));
			$console.find('.dateBtn').datepicker({
				maxDate: '%y-%M-%d'
			});
		},
		setupDropdown: function() {
			$console.find('.select').dropdown();
		},
		setupSearch: function() {
			$console.find('#doSearch').on('click', function() {
				var _start = $scope.$el.$dStart.val(),
					_end = $scope.$el.$dEnd.val();
				if(_start) {
					apiParams.importStartDate = _start;
				}
				if(_end) {
					apiParams.importEndDat = _end;
				}
				apiParams.page = 1;
				loadExpireProcessList(apiParams);
			})
		},
		setupReset: function() {
			$console.find('#reset').on('click', function() {
				delete apiParams.importStartDate;
				delete apiParams.importEndDat;
				delete apiParams.demandBankId;
				apiParams.page = 1;
				loadExpireProcessList(apiParams);
			})
		},
		setupDetail: function() {
			$console.on('click', '.detailEvt', function() {
				var impId = $(this).data('id');
				router.render('expire/expireInfoDetail', {
					path: 'expireInfoInput',
					importId: impId
				})
			})
		},
		init: function() {
			var self = internel.setup;
			self.setupDatepicker();
			self.setupDropdown();
			self.setupSearch();
			self.setupReset();
			self.setupDetail();
		}
	}

	$scope.dropdown = {
		bankPicker: function(picked) {
			apiParams.demandBankId = picked.id;
		},
		getData: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('loanOverdueImport/queryDemandBank', true),
				dataType: 'json',
				global: false,
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'bankName',
						accountName: 'brand',
						bankName: 'bankCode'
					};
					cb(sourceData);
				})
			})
		}
	}

	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: $http.api('loanOverdueImport/importReordList', true),
			type: 'post',
			data: apiParams,
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(!!result.page)
					setupPaging(result.page, true);
				setupScroll(result.page, function() {
					pageChangeEvt();
				});
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
			current: parseInt(apiParams.page),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
	}
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/import-history'), function() {
		$scope.def.listTmpl = render.$console.find('#importHistoryTmpl').html();
		$scope.def.scrollBarTmpl = render.$console.find('#scrollBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#importHistoryTable'),
			$paging: $console.find('#pageToolbar'),
			$scrollBar: $console.find('#scrollBar'),
			$location: $console.find('#location')
		}
		loadExpireProcessList(apiParams);
		internel.location();
		internel.setup.init();
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.page = _pageNum;
		loadExpireProcessList(apiParams);
		cb();
	}
});



