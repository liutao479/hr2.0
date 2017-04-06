'use strict';
page.ctrl('expireInfoInput', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		$source = $scope.$source = {},
		apiParams = {};
	var urlStr = "http://192.168.1.92:8080";
	/**
	* 加载逾期信息录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadExpireProcessList = function(cb) {
		$.ajax({
			url: urlStr + '/loanOverdueImport/queryParsingDate',
//			url: $http.api('loanOverdueImport/queryParsingDate','jbs'),
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				$("#updFileBox").hide();
				setupEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	var setupEvt = function($el) {
		$console.find('.itemEvt').on('click', function() {
			debugger
			if(changePhd){
				$(".select-text").attr('placeholder','123');
			}
	    })
		//下载模板
		$console.find('#modelDownload').on('click', function() {
	 		window.open(urlStr+'/loanOverdueImport/downExcel','_self')
	    })
		//模板上传
		$console.find('#fileData').on('change', function() {
	 		ajaxFileUpload();
	    })
	}	
	/**
	* 并行任务切换触发事件
	* @params {int} idx 触发的tab下标
	* @params {object} item 触发的tab对象
	*/
	var tabChange = function (idx, item) {
		console.log(item);
		router.render('loanProcess/' + item.key, {
			tasks: $scope.tasks,
			taskId: $scope.tasks[idx].id,
			orderNo: $params.orderNo,
			selected: idx,
			path: 'loanProcess'
		});
	}
	/**
	* 下载模板
	*/
//	 $(document).on('click', '#modelDownload', function() {
//	 	window.open(urlStr+'loanOverdueImport/downExcel','_self')
//	 });
	 
	/**
	* 模板上传
	*/
//	$(document).on('change', '#fileData', function() {
//      ajaxFileUpload();
//  })
	
    function ajaxFileUpload() {
		$.ajaxFileUpload({
		    url: urlStr+'/loanOverdueImport/uploadOverdue',
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
    
	$scope.bankPicker = function(picked) {
		console.log(picked);
		var demandBankId = $("#demandBankId").val();
		if(demandBankId){
			$("#bankCnName").text(picked.accountName + '-' + picked.name);
			$("#updFileBox").show();
		};
	}
	
	/**dropdown 测试*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}
	$scope.dropdownTrigger = {
		demandBankId: function(t, p, cb) {
			$.ajax({
				type: 'post',
//				url: $http.api('loanOverdueImport/queryDemandBank', 'jbs'),
				url: urlStr + '/loanOverdueImport/queryDemandBank',
				dataType: 'json',
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
    /***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-input'), function() {
		$scope.def.listTmpl = render.$console.find('#expireInputTmpl').html();
//		$scope.def.iRTTmpl = render.$console.find('#importResultTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireInputPanel')
//			,
//			$iRTtbl: $console.find('#importResultTable')
		}
		loadExpireProcessList(function(){
			setupDropDown();
		});
	});
});



