'use strict';
page.ctrl('expireInfoInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		},
	/**
	* 加载逾期信息录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: $http.api('loanOverdueImport/uploadOverdue','jbs'),
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				// setupPaging(result.page.pages, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 下载模板
	*/
	 $(document).on('click', '#modelDownload', function() {
	 	window.open(urlStr+'loanOverdueImport/downExcel','_self')
	 });
	 
	/**
	* 模板上传
	*/
	$(document).on('change', '#fileData', function() {
        ajaxFileUpload();
    })
	
	
    function ajaxFileUpload() {
		$.ajaxFileUpload({
		    url: urlStr+'loanOverdueImport/uploadOverdue',
		    secureuri: false,
		    fileElementId: 'fileData',
		    dataType: 'json',
//		    complete: function() {
//		    	console.log('执行了complete');
//		    },
		    success: function(data, status){
//		        if (typeof(data.msg) != 'undefined') {
//		            if (data.msg != '') {
//		                alert(data.msg);
//		                return;
//		            } else {
//		                console.log(data);
//		            }
//		        }else{
//		        	console.log(data);
//		        };
		        console.log(data);
		    },
		    error: function(data, status, e){
		        console.log(data+','+status);
		    }
		})	
    }
    /***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/expire-info-input'), function() {
		$scope.def.listTmpl = render.$console.find('#expireInputTmpl').html();
		$scope.def.iRTTmpl = render.$console.find('#importResultTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireInputPanel'),
			$iRTtbl: $console.find('#importResultTable')
		}
		if($params.process) {
			
		}
		loadExpireProcessList(apiParams);
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.page = _page;
		$params.page = _page;
		// router.updateQuery($scope.$path, $params);
		loadExpireProcessList(apiParams);
		cb();
	}
});



