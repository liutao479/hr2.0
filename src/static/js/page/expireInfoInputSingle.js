'use strict';
page.ctrl('expireInfoInputSingle', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;

	var internel = {};

	internel.detail = function(params) {
		router.render('expire/expireSingleDetail', {orderNo: params.orderNo, path: 'expireInfoInput'});
	}
	/**
	* 执行
	*/
	var setupEvt = function($el) {
		//绑定搜索事件
		$console.find('#search').on('click', function() {
			var searchKey = $("#searchInp").val();
			var data={};
				data['keyWord'] = searchKey;
			if(searchKey){
				$.ajax({
					url: $http.api('loanOverdueOrder/signEntryList', true),
					data: data,
					dataType: 'json',
					type: 'post',
					success: $http.ok(function(result) {
						if(result.data.length > 0) {
							$scope.result = result.data;
							if(result.data.length == 1) {
								internel.detail(result.data);
							} else {
								render.compile($scope.$el.$tbl, $scope.def.tmpl, result.data, true);	
							}
						} else{
							$.alert({
								title: '提示',
								content: '<div class="w-content"><div>暂无查询到相关订单！</div></div>',
								buttons: {
									ok: {text: '确定'}
							    }
							})
						}
					})
				})
			}
	    });
	    //确定选中
	    $console.on('click', '#btnOK', function() {
	    	var checked = $console.find('input:radio:checked').val();
	    	if(checked == undefined) {
	    		return $.alert({
	    			title: '提示',
	    			content: '<div class="w-content">请选择匹配的订单</div>',
	    			autoClose: 'ok|3000',
	    			buttons: {
	    				ok: {text: '确定'}
	    			}
	    		})
	    	}
	    	internel.detail($scope.result[parseInt(checked)]);
	    })
	    //取消
	    $console.on('click', '#btnCancel', function() {
	    	$scope.$el.$tbl.html('');
	    	$scope.$el.$search.val('');
	    })
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-input-single'), function() {
		$scope.def.tmpl = $console.find('#expireInfoInputSingleTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireInfoInputSingleTable'),
			$search: $console.find("#searchInp")
		}
		setupEvt();
	});

});



