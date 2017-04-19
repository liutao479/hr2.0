'use strict';
page.ctrl('expireInfoInput', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	/**
	* 加载逾期信息录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var setupEvt = function($el) {
		$("#updFileBox").hide();
		$console.find('#reUpd').on('click', function() {
			$("#content").show();
			$("#importResultTable").empty();
	    })
//		$console.find('#pathExp').on('click', function() {
//			debugger
//			var importId = $(this).data('type');
//			router.render('expire/expireInfoPrev', {
//				importId: importId, 
//				path: 'expire'
//			});
////			var params = {
////				importId: importId
////			};
////			router.innerRender('#innerPanel', 'expire/expireInfoPrev', params);
//	    })
			
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
				success: function(xhr) {
					if(!xhr.code) {
						$("#content").hide();
						render.compile($console.find('#importResultTable'), $scope.def.importResultTmpl, xhr.data, true);
					} else {
						$.alert({
							title: '错误',
							content: xhr.msg,
							autoClose: 'ok|3000',
							buttons: {
								ok: {text: '确定'}
							}
						})
					}
				},
				error: function() {
					$.alert({
						title: '错误',
						content: '逾期数据解析失败，请重试',
						autoClose: 'ok|3000',
						buttons: {ok:{text:'确定'}}
					})
				}
			})
			
	    })
	}	
    
	$scope.bankPicker = function(picked) {
		var demandBankId = $("#demandBankId").val();
		console.log(picked);
		if(demandBankId){
			// $("#bankCnName").text(picked.name);
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
    /***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-input'), function() {
		$scope.def.importResultTmpl = $console.find('#importResultTmpl').html();
		$scope.$el = {
			$result : $console.find('#importResultTable')
		}
		setupDropDown();
		setupEvt();
	});
});



