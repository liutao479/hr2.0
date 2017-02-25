'use strict';
page.ctrl('loadArchiveDownload', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			queryType: 2,  //贷款资料下载
			pageNum: $params.pageNum || 1
		};
	/**
	* 加载贷款资料数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadArchiveDownloadList = function(params, cb) {
		$.ajax({
			url: $http.api('creditUser/getCreditMaterials', 'zyj'),
			type: 'post',
			data: params,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
				setupPaging(result.page, true);
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
	 * 绑定立即处理事件
	 */
	var setupEvt = function() {

		// 绑定搜索框模糊查询事件
		$console.find('#searchInput').on('keydown', function(evt) {
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.keyWord = searchText;
				$params.keyWord = searchText;
				apiParams.pageNum = 1;
				$params.pageNum = 1;
				loadArchiveDownloadList(apiParams, function() {
					delete apiParams.keyWord;
					delete $params.keyWord;
					that.blur();
				});
				// router.updateQuery($scope.$path, $params);
			}
		});

		// 绑定全选按钮
		$console.find('#allCheck').on('click', function() {
			var that = $(this);
			if(!that.hasClass('checked')) {
				// 去做全选操作
				// $console.find('#creditArchiveDownloadTable .checkbox')
			} else {
				// 去做全选取消操作
			}
		});


		// 绑定pdf下载按钮
		$console.find('.contractPrint').on('click', function() {
			var that = $(this);
			var template = '<div class="window">\
				<div class="w-title">\
					<div class="w-title-content">选择套打模板</div>\
					<div class="w-close"><i class="iconfont">&#xe65a;</i></div>\
				</div>\
				<div class="w-content">\
					<dl class="w-dropdown">\
						<dt>请选择需要套打的合同模板：</dt>\
						<dd>\
							<select name="" id="muban">\
								{{ for(var i = 0, len = it.length; i < len; i++) { var row = it[i]; }}\
								<option data-id="{{=row.attachmentId}}">{{=row.fileName}}</option>\
								{{ } }}\
							</select>\
						</dd>\
					</dl>\
					<div class="w-commit-area">\
						<div class="button button-empty btnCancel">取消</div><div class="button btnSure">确定</div>\
					</div>\
				</div>\
			</div>';
			var $dialog = $('<div class="dialog" id="dialog"></dialog>').appendTo('body');
			console.log($dialog);
			$.ajax({
				url: $http.api('contractPrint/queryContractExeclList', 'lyb'),
				type: 'post',
				data: {
					deptOrgId: 62
				},
				dataType: 'json',
				success: function(result) {
					console.log(result);
					$(doT.template(template)(result.data)).appendTo($dialog);
					$dialog.find('#muban').data('selectid', result.data[0].attachmentId);
					$dialog.find('#muban').on('change', function() {
						var _selectid = $(this).find('option:selected').data('id');
						console.log(_selectid)
						$(this).data('selectid', _selectid);
					})
					$dialog.find('.w-close').on('click', function() {
						$dialog.remove();
					})
					$dialog.find('.btnSure').on('click', function() {
						console.log(typeof $dialog.find('#muban').data('selectid'))
						$.ajax({
							url: $http.api('contractPrint/verifyTemplateIsExist', 'lyb'),
							type: 'post',
							data: {
								fileId: $dialog.find('#muban').data('selectid')
							},
							dataType: 'json',
							success: function(xhr) {
								console.log(xhr);
								if(!xhr) {
									$.ajax({
										url: $http.api('contractPrint/printContractFile', 'lyb'),
										type: 'post',
										data: {
											fileId: 301,
											orderNo: 'nfb110'
										},
										dataType: 'json',
										success: function(xhr) {
											console.log(xhr);
										}
									})
								}
							}
						})
					})
				}
			})
		});


		
		//绑定搜索按钮事件
		$console.find('#search').on('click', function() {
			loadArchiveDownloadList(apiParams);
			// router.updateQuery($scope.$path, $params);
			
		});

		//绑定重置按钮事件
		$console.find('#search-reset').on('click', function() {
			// 下拉框数据以及输入框数据重置
			// router.updateQuery($scope.$path, $params);
			
		});
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/load-archive-download'), function() {
		$scope.def.listTmpl = render.$console.find('#loadArchiveDownloadListTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loadArchiveDownloadTable'),
			$paging: $console.find('#pageToolbar')
		}
		loadArchiveDownloadList(apiParams, function() {
			setupEvt();
		});
	});

	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		// router.updateQuery($scope.$path, $params);
		loadArchiveDownloadList(apiParams);
		cb();
	}
});



