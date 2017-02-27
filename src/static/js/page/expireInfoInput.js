'use strict';
page.ctrl('expireInfoInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		},
		postUrl='http://192.168.0.113:8888/';
	/**
	* 加载逾期信息录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: $http.api('expire.process'),
			data: params,
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
	 	window.open(postUrl+'loanOverdueImport/downExcel','_self')
	 });
	 
	/**
	* 模板上传
	*/
	$(document).on('change', '#fileData', function() {
        ajaxFileUpload();
    })
    function ajaxFileUpload() {
        $.ajaxFileUpload({
            url: postUrl+'loanOverdueImport/uploadOverdue', //用于文件上传的服务器端请求地址
            secureuri: false, //是否需要安全协议，一般设置为false
            fileElementId: 'fileData', //文件上传域的ID
            dataType: 'json', //返回值类型 一般设置为json
			success : function(data, status){    
		    	console.log(data+','+status+',1');
		    	console.log(typeof(data));
		    	console.log(data);
		    	
		    },
		    error:function(data,status,e){
		            
		    }
//			success: function(xhr) {
//				if(!xhr.code) {
//					console.log(1);			
//				}
//			},
////			function(xhr) {
////              console.log('成功的回调'+xhr.data);
//////              $("#importResule").show();
//////				render.compile($scope.$el.$iRTtbl, $scope.def.iRTTmpl, result.data, true);
//////				console.log(result.data);
////			},
//			error: function(error){
//				console.log('失败的回调'+error);
//			}
        })
        return false;
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



