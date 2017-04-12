'use strict';
page.ctrl('expireInfoInputSingle', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
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
					url: urlStr + '/loanOverdueOrder/signEntryList',
//					url: $http.api('loanOverdueOrder/signEntryList'),
					data: data,
					dataType: 'json',
					type: 'post',
					success: $http.ok(function(result) {
						if(result.data.length > 0){
							render.compile($console.find('#expireInfoInputSingleTable'), $console.find('#expireInfoInputSingleTmpl').html(), result.data, true);
						}else{
							$.alert({
								title: '提示',
								content: '<div class="w-content"><div>暂无查询到相关订单！</div></div>',
								useBootstrap: false,
								boxWidth: '500px',
								theme: 'light',
								type: 'purple',
								buttons: {
									'确定': {
							            action: function () {
							            }
							        }
							    }
							})
						}
					})
				})
			}
	    })
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-input-single'), function() {
		setupEvt();
	});

});



