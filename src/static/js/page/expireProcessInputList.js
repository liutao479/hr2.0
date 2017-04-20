'use strict';
page.ctrl('expireProcessInputList', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1,
			pageSize: 20
		};
	$scope.cache = {};

	var defines = {
		overdue: [
			{ id: 0, name: "全部" },
			{ id: 1, name: "待处理" },
			{ id: 2, name: "电催中" },
			{ id: 3, name: "电催已完成" },
			{ id: 4, name: "线下催收中" },
			{ id: 5, name: "线下催收已完成" },
			{ id: 6, name: "法务处理中" },
			{ id: 7, name: "法务处理已完成" }
		]
	}

	var internel = $scope.internel = {};
	var setup = {};

	/**
	* 加载表单
	*/
	internel.loadList = function(paging) {
		$.ajax({
			url: $http.api('loanOverdueOrder/overdueOrderList', true),
			data: apiParams,
			dataType: 'json',
			type: 'post',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				if(paging && result.page && result.page.pages) {
					internel.setupPaging(result.page.pages, true);
				}
			})
		})
	}
	/**
	* 获取银行列表
	*/
	internel.bankList = function(t, p, cb) {
		if($scope.cache.bankList) {
			return cb($scope.cache.bankList);
		}
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
				$scope.cache.bankList = sourceData;
				cb(sourceData);
			})
		})
	}
	/**
	* 选择银行
	*/
	internel.bankPicker = function(picked) {
		apiParams.demandBankId = picked.id;
	}
	/**
	* 获取逾期处理状态列表
	*/
	internel.overdueList = function(t, p, cb) {
		cb({ items: defines.overdue, id: 'id', name: 'name' });
	}
	/**
	* 选择逾期状态
	*/
	internel.overduePicker = function(picked) {
		apiParams.overdueStatus = picked.id;
	}
	internel.diag = '<div class="dialog-input-form">\
						<div class="input-row">处理人：{0}<span class="float-right">{1}</span></div>\
						<div class="input-row">{2}</div>\
					 </div>'

	//渲染下拉框
	setup.dropdown = function() {
		$console.find('.select').dropdown();
	}
	/**
	* 监听事件
	*/
	setup.listen = function() {
		$console.find('#doSearch').on('click', function() {
			//没有输入任何条件
			if(!apiParams.demandBankId && !apiParams.overdueStatus && !apiParams.keyWord && !apiParams.currentDefaultNum && !apiParams.cumulativeDefaultNum && !apiParams.repaymentPeriod) {
				return false;
			}
			internel.loadList(true);
		})
		$console.find('#reset').on('click', function() {
			delete apiParams.demandBankId;
			delete apiParams.overdueStatus;
			delete apiParams.keyWord;
			delete apiParams.currentDefaultNum;
			delete apiParams.cumulativeDefaultNum;
			delete apiParams.repaymentPeriod;
			$console.find('.select').undropdown();
			internel.loadList(true);
		})
		$console.on('click', '.dEvt', function() {
			var $that = $(this);
			$.ajax({
				url: $http.api('loanOverdueOpinion/getOpinionNewest', true),
				data: {
					orderNo: $that.data('order')
				},
				global: false,
				dataType: 'json',
				success: $http.ok(function(res) {
					var data = res.data;
					$.alert({
						title: '最新逾期处理意见',
						content: data ? internel.diag.format(data.submitUserName, data.submitDateStr, data.overdueIdea) : tool.alert('暂无处理意见'),
						buttons: { ok: {text: '确定'}}
					})
				})
			})
		})
		$console.on('click', '.vEvt', function() {
			var $that = $(this);
			router.render('expireProcess/expireProcessDetail', {
				orderNo: $that.data('order'),
				type: 'overdue',
				path: 'expireProcess',
				test: false
			})
		})
	}
	setup.init = function() {
		setup.listen();
		setup.dropdown();
	}
	/**
	* 构造分页
	*/
	internel.setupPaging = function(count, isPage) {
		$scope.$el.$paging.data({
			current: apiParams.pageNum,
			pages: isPage ? count : (tool.pages(count || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$('#pageToolbar').paging();
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-process-input-list'), function() {

		$scope.def.listTmpl = render.$console.find('#expireProcessInputListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireProcessInputListTable'),
			$paging: $console.find('#pageToolbar')
		}
		internel.loadList(true);
		setup.init();
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		internel.loadList();
		cb();
	}
});



