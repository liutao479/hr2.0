'use strict';
page.ctrl('expireInfoInputSingle', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	var urlStr = "http://127.0.0.1:8080";
	/**
	 *逾期处理意见 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(cb) {
		$.ajax({
			url: urlStr + '/loanOverdueImport/queryParsingDate',
//			url: $http.api('loanOverdueImport/queryParsingDate'),
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				setupEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 执行
	*/
	var setupEvt = function($el) {
		//顶部tab切换
		$console.find('#extInput').on('click', function() {
			router.render('expire/expireInfoInput');
	    })
		//绑定搜索事件
		$console.find('#search').on('click', function() {
			var searchKey = $("#searchInp").val();
			var data={};
				data['keyWord'] = searchKey;
			if(searchKey){
				$.ajax({
					url: urlStr + '/loanOverdueImport/checkOverdueOrderList',
//					url: $http.api('loanOverdueImport/checkOverdueOrderList'),
					data: data,
					dataType: 'json',
					type: 'post',
					success: $http.ok(function(result) {
						render.compile($console.find('#expireInfoInputSingleTable'), $console.find('#expireInfoInputSingleTmpl').html(), result.data, true);
					})
				})
			}
	    })
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-input-single'), function() {
		$scope.def.listTmpl = render.$console.find('#expSingleTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expSingle'),
		}
		loadExpireProcessList();
	});

});



