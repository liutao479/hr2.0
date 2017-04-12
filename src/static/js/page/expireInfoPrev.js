'use strict';
page.ctrl('expireInfoPrev', [], function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			pageNum: $params.pageNum || 1,
			process: $params.process || ''
		};
	/**
	 *逾期导入查看详情 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
		var pageData={};
			pageData['importId']=$params.importId;
			pageData['status']=0;
		$scope.iptId = $params.importId;

	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: urlStr + '/loanOverdueImport/queryImportDetails',
//			url: $http.api('loanOverdueImport/queryImportDetails','jbs'),
			data: pageData,
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupPaging(result.page, true);
				setupScroll(result.page, function() {
					pageChangeEvt();
				});
				tabChangeEvt();
				$("#chooseOrderDetail").hide();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	/**
	* 构造分页
	*/
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$('#pageToolbar').paging();
	}

	/**
	* 编译翻单页栏
	*/
	var setupScroll = function(page, cb) {
		render.compile($scope.$el.$scrollBar, $scope.def.scrollBarTmpl, page, true);
		if(cb && typeof cb == 'function') {
			cb();
		}
	}
	// 绑定翻页栏（上下页）按钮事件
	var pageChangeEvt = function() {
		$console.find('.page-change').on('click', function() {
			var that = $(this);
			var _pageNum = parseInt($scope.$el.$scrollBar.find('#page-num').text());
			if(that.hasClass('disabled')) return;
			if(that.hasClass('scroll-prev')) {
				apiParams.pageNum = _pageNum - 1;
				$params.pageNum = _pageNum - 1;
			} else if(that.hasClass('scroll-next')) {
				apiParams.pageNum = _pageNum + 1;
				$params.pageNum = _pageNum + 1;
			}
			loadCustomerList(apiParams);
		});
	}
 	/**
	* 页面启动
	**/
	var tabChangeEvt = function() {
		//当页tab切换
		$console.find('#currentPageTab a').on('click', function() {
			$('#currentPageTab a').each(function (){
				$(this).removeClass('tab-item-active');
			})
			$(this).addClass('tab-item-active');
			var status = $(this).data('status');
			pageData['status']=status;
			$.ajax({
				url: urlStr + '/loanOverdueImport/queryImportDetails',
//				url: $http.api('loanOverdueImport/queryImportDetails','jbs'),
				data: pageData,
				type: 'post',
				dataType: 'json',
				success: $http.ok(function(result) {
					render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
					setupPaging(result.page, true);
					setupScroll(result.page, function() {
						pageChangeEvt();
					});
					$("#chooseOrderDetail").hide();
				})
			})
		});
		//全选或全不选
		$console.find('#all').on('click', function() {
			var importId = $(this).data('id');
			var dataP={};
				dataP['importId']=importId;
			if(!$(this).attr('checked')) {
		   		$(this).addClass('checked').attr('checked',true);
		   		$(this).html('<i class="iconfont">&#xe659;</i>');
	        	$("#list .checkbox-normal").each(function(){
			   		$(this).addClass('checked').attr('checked',true);
			   		$(this).html('<i class="iconfont">&#xe659;</i>');
	        	})
				dataP['isFoundTask']=1;
				$.ajax({
					url: urlStr + '/loanOverdueImport/checkAllOverdue',
//					url: $http.api('loanOverdueImport/checkAllOverdue','wl'),
					data: dataP,
					type: 'post',
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result.msg)
					})
				})
	    	}else{   
				$(this).removeClass('checked').attr('checked', false);
				$(this).html('');
	        	$("#list .checkbox-normal").each(function(){
		   			$(this).removeClass('checked').attr('checked',false);
		   			$(this).html('');
	        	})
				dataP['isFoundTask']=0;
				$.ajax({
					url: urlStr + '/loanOverdueImport/checkAllOverdue',
//					url: $http.api('loanOverdueImport/checkAllOverdue','wl'),
					data: dataP,
					type: 'post',
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result.msg)
					})
				})
	    	}   
		});
		//获取选中选项的值
		$console.find('#getValue').on('click', function() {
			var valArr = new Array;
	        $("#list .checked").each(function(i){
				valArr[i] = $(this).data('id');
	        });
			var vals = valArr.join(',');
	      	console.log(vals);
	      	var dataP={};
	      		dataP['importId'] = $params.importId;
	      	if(vals){
				$.ajax({
					url: urlStr + '/loanOverdueImport/prepareConfirmed',
//					url: $http.api('loanOverdueImport/prepareConfirmed','wl'),
					data: dataP,
					type: 'post',
					dataType: 'json',
					success: $http.ok(function(result) {
						$.confirm({
							title: '您将要进行如下操作',
							content: '<div class="w-content"><div class="w-expCon">(1)更新客户逾期记录'+result.data.replaceCount+'条</div><div class="w-expCon">(2)结清客户逾期记录'+result.data.settleCount+'条</div><div class="w-expCon">(3)导入客户逾期记录'+result.data.importCount+'条</div></div>',
							buttons: {
								close: {
									text: '取消',
									btnClass: 'btn-default btn-cancel',
									action: function() {}
								},
								ok: {
									text: '确定',
									action: function () {
										var data = {};
											data['importId'] = $scope.iptId;
				        				$.ajax({
											type: 'post',
											url: urlStr+'/loanOverdueImport/confirmImportRecord',
//											url: $http.api('loanOverdueImport/confirmImportRecord','jbs'),
											data: data,
											dataType: 'json',
											success: $http.ok(function(xhr) {
												router.render('expire/expireInfoDetail', {
													importId: $scope.iptId, 
													path: 'expire'
												});
											})
										})
									}
								}
							}
						})
					})
				})
	      	}else{
				$.alert({
					title: '提示',
					content: '<div class="w-content"><div>请勾选相应项目！</div></div>',
					buttons: {
						'确定': {
				            action: function () {
				            }
				        }
				    }
				})
				return;
	      	}
		});
		//获取选中选项的值
		$console.find('#list .checkbox').on('click', function() {
			var detailId = $(this).data('id');
			var dataP={};
				dataP['detailId']=detailId;
				
			if(!$(this).attr('checked')) {
				$(this).addClass('checked').attr('checked',true);
				$(this).html('<i class="iconfont">&#xe659;</i>');
				dataP['isFoundTask']=1;
				$.ajax({
					url: urlStr+'/loanOverdueImport/isCreateOverdue',
//					url: $http.api('loanOverdueImport/isCreateOverdue','wl'),
					data: dataP,
					type: 'post',
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result.msg)
					})
				})
			} else {
				$(this).removeClass('checked').attr('checked', false);
				$(this).html('');
				$('#all').removeClass('checked').attr('checked', false);
				$('#all').html('');
				dataP['isFoundTask']=0;
				$.ajax({
					url: urlStr+'/loanOverdueImport/isCreateOverdue',
//					url: $http.api('loanOverdueImport/isCreateOverdue','wl'),
					data: dataP,
					type: 'post',
					dataType: 'json',
					success: $http.ok(function(result) {
						console.log(result.msg)
					})
				})
			}
		});
		//详情页面确定取消按钮
		$console.find('#cancle').on('click', function() {
			$("#chooseOrderDetail").hide();
		});
		$console.find('#submitPass').on('click', function() {
			var data = {};
			var boolCheck=$('input:radio[name="detailId"]');
			boolCheck.each(function(){
				if($(this).is(":checked")){
					data['orderNo'] = $(this).siblings('input:hidden[name="orderNo"]').val();
				}
			})
			data['detailId'] = $('#detailId').data('detailId');
			$.ajax({
				url: urlStr+'/loanOverdueImport/chooseOverdueOrder',
				url: $http.api('loanOverdueImport/chooseOverdueOrder','wl'),
				data: data,
				type: 'post',
				dataType: 'json',
				success: $http.ok(function(result) {
					$("#chooseOrderDetail").hide();
				})
			})
		});
		//点击查看详情
		$console.find('.chooseOrder').on('click', function() {
			$("#chooseOrderDetail").show();
			var that =$("#chooseOrderTable");
			var detailData = {};
				detailData['detailId']=$(this).data('detail');
			$.ajax({
				url: urlStr+'/loanOverdueImport/checkOverdueOrderList',
//				url: $http.api('loanOverdueImport/checkOverdueOrderList','wl'),
				data: detailData,
				type: 'post',
				dataType: 'json',
				success: $http.ok(function(xhr) {
					render.compile(that, $scope.def.orderDetailTmpl, xhr.data, true);
				})
			})
		});
	}

	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/expire-info-prev'), function() {
		$scope.def.listTmpl = render.$console.find('#expireInfoPrevTmpl').html();
		$scope.def.orderDetailTmpl = render.$console.find('#chooseOrderTmpl').html();
		$scope.def.scrollBarTmpl = render.$console.find('#scrollBarTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#expireInfoPrevTable'),
			$paging: $console.find('#pageToolbar'),
			$scrollBar: $console.find('#scrollBar')
		}
		if($params.process) {
			
		}
		loadExpireProcessList();
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		loadExpireProcessList(apiParams);
		cb();
	}
});



