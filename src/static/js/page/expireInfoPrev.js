'use strict';
page.ctrl('expireInfoPrev', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1
		};
	/**
	 *逾期导入查看详情 
	* 加载逾期管理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var pageData={};
	pageData['importId']=80;
	pageData['status']=0;

	var loadExpireProcessList = function(params, cb) {
		$.ajax({
			url: 'http://192.168.0.113:8888/loanOverdueImport/queryImportDetails',
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
	* 当页tab切换
	**/
	$(document).on('click', '#currentPageTab a', function() {
		$('#currentPageTab a').each(function (){
			$(this).removeClass('tab-item-active');
		})
		$(this).addClass('tab-item-active');
		var status = $(this).data('status');
		pageData['status']=status;
		loadExpireProcessList(apiParams);
	});
	/**
	* 全选、不选
	* 
	*/
//	$(function () {
		//全选或全不选
		$(document).on('click', '#all', function() {
			if(!$(this).attr('checked')) {
				$(this).addClass('checked').attr('checked',true);
				$(this).html('<i class="iconfont">&#xe659;</i>');
	        	$("#list .checkbox").each(function(){
					$(this).addClass('checked').attr('checked',true);
					$(this).html('<i class="iconfont">&#xe659;</i>');
	        	})
	    	}else{   
				$(this).removeClass('checked').attr('checked', false);
				$(this).html();
	        	$("#list .checkbox").each(function(){
					$(this).removeClass('checked').attr('checked', false);
					$(this).html();
	        	})
	    	}   
	 	}); 
	 
		//获取选中选项的值
		$(document).on('click', '#getValue', function() {
//		$("#getValue").click(function(){
			var valArr = new Array;
	        $("#list .checkbox[checked]").each(function(i){
				valArr[i] = $(this).val();
	        });
			var vals = valArr.join(',');
	      	alert(vals);
	    });
//	}); 
	function allchk(){
		var chknum = $("#list .checkbox").size();//选项总个数
		var chk = 0;
		console.log(chknum);
		$("#list .checkbox").each(function () {  
	        if($(this).attr("checked")==true){
				chk++;
			}
	    });
		if(chknum==chk){//全选
			$("#all").attr("checked",true);
		}else{//不全选
			$("#all").attr("checked",false);
		}
	}
	$(document).on('click', '#list .checkbox', function() {
		var detailId = $(this).data('id');
		var dataP={};
			dataP['detailId']=detailId;
			
		if(!$(this).attr('checked')) {
			$(this).addClass('checked').attr('checked',true);
			$(this).html('<i class="iconfont">&#xe659;</i>');
			dataP['isFoundTask']=1;
			$.ajax({
				url: $http.api('loanOverdueImport/isCreateOverdue','wl'),
				data: dataP,
				type: 'post',
				dataType: 'json',
				success: $http.ok(function(result) {
					console.log(result.msg)
				})
			})
		} else {
			$(this).removeClass('checked').attr('checked', false);
			$(this).html();
			$('#all').removeClass('checked').attr('checked', false);
			$('#all').html();
			dataP['isFoundTask']=0;
			$.ajax({
				url: $http.api('loanOverdueImport/isCreateOverdue','wl'),
				data: dataP,
				type: 'post',
				dataType: 'json',
				success: $http.ok(function(result) {
					console.log(result.msg)
				})
			})
		}
	});
	/**
	* 详情页面确定取消按钮
	*/
	$(document).on('click', '#cancle', function() {
		$("#chooseOrderDetail").hide();
	});
	$(document).on('click', '#submitPass', function() {
		var data = {};
		var boolCheck=$('input:radio[name="detailId"]');
		boolCheck.each(function(){
			if($(this).is(":checked")){
				data['detailId'] = $(this).val();
				data['orderNo'] = $(this).siblings('input:hidden[name="orderNo"]').val();
			}
		})
		$.ajax({
			url: $http.api('loanOverdueImport/chooseOverdueOrder','wl'),
			data: data,
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(result) {
				$("#chooseOrderDetail").hide();
			})
		})
	});
	
	/**
	 * 点击查看详情
	 */
	$(document).on('click', '.selOrderDetail', function() {
		$("#chooseOrderDetail").show();
//		chooseOrderTable
		var that =$("#chooseOrderTable");
		var detailData = {};
			detailData['detailId']=$(this).data('detail');
//			detailData['detailId']=1;
		$.ajax({
			url: $http.api('loanOverdueImport/checkOverdueOrderList','wl'),
			data: detailData,
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(xhr) {
				render.compile(that, $scope.def.orderDetailTmpl, xhr.data, true);
//				if(cb && typeof cb == 'function') {
//					cb();
//				}
			})
		})
	});

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/expire-info-prev'), function() {
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
		loadExpireProcessList(apiParams);
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadExpireProcessList(apiParams);
		cb();
	}
});



