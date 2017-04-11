'use strict';
page.ctrl('expireInfoInputHead', [], function($scope) {
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
				listenGuide();
				setupEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	var setupEvt = function($el) {
		$console.find('.tabEvt').on('click', function() {
			var $that = $(this);
			$(".tabEvt").each(function(){
				$(this).removeClass('role-item-active');
			})
			$that.addClass('role-item-active');
			var code = $that.data('type');
			var params = {
				code: code,
				orderNo: $params.orderNo
			}
			if(code == '1'){
				router.innerRender('#innerPanel', 'expire/expireInfoSingle', params);
			}else{
				router.innerRender('#innerPanel', 'expire/expireInfoInput', params);
			}
		})
		$console.find('#importHistory').on('click', function() {
			var params = {
				orderNo: $params.orderNo
			}
			router.render('expire/importHistory', params);
		})	
		
	}	
    
		$(document).on('click', '#pathExp',function() {
			debugger
			var importId = $(this).data('type');
//			router.render('expire/expireInfoPrev', {
//				importId: importId, 
//				path: 'expire'
//			});
			var params = {
				importId: importId
			};
			router.innerRender('#innerPanel', 'expire/expireInfoPrev', params);
	    })
	function listenGuide() {
		var params = {
			code: 0,
			orderNo: $params.orderNo
		}
		router.innerRender('#innerPanel', 'expire/expireInfoInput', params);
	}
    /***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-input-head'), function() {
		$scope.def = {
			listTmpl : render.$console.find('#expireInputTmpl').html()
		};	
		$scope.$el = {
			$tbl: $console.find('#expireInputPanel')
		}
		loadExpireProcessList();
	});
});



