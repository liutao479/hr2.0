'use strict';
page.ctrl('expireInfoInput', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
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
		
		$console.find('#single').on('click', function() {
			router.render('expire/expireInfoSingle');
	    })
		$console.find('#reUpd').on('click', function() {
			$("#content").show();
			$("#importResultTable").empty();
	    })
		$console.find('#pathExp').on('click', function() {
			debugger
			var importId = $(this).data('type');
			router.render('expire/expireInfoPrev', {
				importId: importId, 
				path: 'expire'
			});
	    })
		
		
		//下载模板
		$console.find('#modelDownload').on('click', function() {
	 		window.open(urlStr+'/loanOverdueImport/downExcel','_self')
	    })
		//模板上传
		$console.find('#fileData').on('change', function() {
			var file = this.files[0];
			var fd = new FormData();
			fd.append('fileData', file);
			fd.append('demandBankId', $('#demandBankId').val());
			$.ajax({
				url: urlStr + '/loanOverdueImport/uploadOverdue',
				type: 'post',
				data:fd,
				processData: false,
				dataType: 'json',
				contentType: false,
				success: function() {
					$("#content").hide();
					render.compile($console.find('#importResultTable'), $console.find('#importResultTmpl').html(), arguments[0].data, true);
					setupEvt();
				},
				error: function() {
					$("#content").hide();
					render.compile($console.find('#importResultTable'), $console.find('#importErrorTmpl').html(), arguments, true);
				}
			})
			
	    })
	}	
    
	$scope.bankPicker = function(picked) {
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
		$scope.def = {
			listTmpl : render.$console.find('#expireInputTmpl').html()
		};	
		$scope.$el = {
			$tbl: $console.find('#expireInputPanel')
		}
		loadExpireProcessList(function(){
			setupDropDown();
		});
	});
});



