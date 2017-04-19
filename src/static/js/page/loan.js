'use strict';
page.ctrl('loan', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1,
			process: $params.process || ''
		};
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	*/
	var loadLoanList = function(params, cb) {
		if(!params.process) {
			delete params.process;
		}
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('loanOrder/workbench', true),
			data: params,
			success: $http.ok(function(result) {
				console.log(result);
				$scope.pageData = result.data;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupPaging(result.page, true);
				setupEvent();
				$.toast('积分电视剧覅好的覅点击覅点击覅电话费杜甫', function() {

				})

				// 测试复选框
				// $scope.$checks = $('.checkbox').checking();

				// $scope.$checks[0].$checking.onChange(function() {
				// 	console.log(this)
				// });

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
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, apiParams.pageSize)),
			size: apiParams.pageSize
		});
		$('#pageToolbar').paging();
	}

	/**
	 * 新建业务
	 */
	var setupNewOrder = function() {
		var tml = '<div class="button button-deep" id="newBusiness" data-href="loanProcess/newBusiness">\
					<i class="iconfont">&#xe615;</i>新建业务\
				</div>';
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('func/list', 'jbs'),
			success: $http.ok(function(result) {
				console.log(result);
				for(var i = 0, len = result.data.length; i < len; i++) {
					if(result.data[i].funcId == 'newOrder') {
						$console.find('.search-bar').append(tml);
						// 新建业务
						$console.find('#newBusiness').on('click', function() {
							var that = $(this);
							router.render(that.data('href'), {
								path: 'loanProcess'
							});
						})
						break;
					}
				}
			})
		})
	}

	/**
	* 日历控件
	*/
	var setupDatepicker = function() {
		$('.dateBtn').datepicker();
	}

	/**
	* 绑定表格中立即处理事件
	*/
	var setupEvent = function() {
		/**
		* 绑定立即处理事件
		*/
		$console.find('#loanTable .button').on('click', function() {
			var that = $(this);
			var idx = that.data('idx');
			var loanTasks = $scope.pageData[idx].loanTasks;
			var taskObj = [], flag = 0;
			for(var i = 0, len = loanTasks.length; i < len; i++) {
				var obj = loanTasks[i];
				taskObj.push({
					key: obj.category,
					id: obj.id,
					name: obj.sceneName,
					submited: obj.submited
				})
				if(!loanTasks[i].submited) {
					flag++;
				}
			}
			for(var i = 0, len = loanTasks.length; i < len; i++) {
				if(!loanTasks[i].submited) {
					var target = loanTasks[i];
					var selected = i;
					if(flag == 1) taskObj[selected].submited = true;
					break;
				}
			}
			router.render('loanProcess/' + target.category, {
				taskId: target.id, 
				orderNo: target.orderNo,
				tasks: taskObj,
				selected: selected,
				path: 'loanProcess'
			});
		});

		/**
		 * 任务栏消失隐藏
		 */
		$console.find('#loanTable .loanTasks').hover(function() {
			$(this).find('.meanwhile-hover').toggle();
		})

	}

	/**
	* 页面首次载入时绑定事件
	*/
 	var evt = function() {
 		// 订单列表的排序
		$console.find('#time-sort').on('click', function() {
			var that = $(this);
			if(!that.data('sort')) {
				apiParams.createTimeSort = 1;
				loadLoanList(apiParams, function() {
					that.data('sort', true);
					that.removeClass('time-sort-up').addClass('time-sort-down');
				});

			} else {
				delete apiParams.createTimeSort;
				loadLoanList(apiParams, function() {
					that.data('sort', false);
					that.removeClass('time-sort-down').addClass('time-sort-up');
				});
			}
		});

		//流程标签
		$console.find('#processTagClose').on('click', function() {
			router.render('loanProcess');
		})

		/**
		* 绑定搜索事件
		**/
		$console.find('#search input').on('keydown', function(evt) {
			var that = $(this);
			if(evt.which == 13) {
				var	searchText = $.trim(that.val());
				if(!searchText) {
					delete apiParams.fuzzyParam;
					loadLoanList(apiParams);
					return false;
				}
				apiParams.fuzzyParam = searchText;
				apiParams.pageNum = 1;
				loadLoanList(apiParams);
			}
		});
		$console.find('#search input').on('keyup', function(evt) {
			var that = $(this);
			if(evt.which == 8) {
				var	searchText = $.trim(that.val());
				if(!searchText) {
					delete apiParams.fuzzyParam;
					loadLoanList(apiParams);
				}
			}
		});


		// 文本框失去焦点记录文本框的值
		$console.find('#search input').on('blur', function(evt) {
			var that = $(this),
				searchText = $.trim(that.val());
			if(!searchText) {
				delete apiParams.fuzzyParam;
				return false;
			} else {
				apiParams.fuzzyParam = searchText;
			}
		});

		$console.find('#search .iconfont').on('click', function() {
			var searchText = $.trim($console.find('#search input').val());
			if(!searchText) {
				$console.find('#search input').focus();
				loadLoanList(apiParams);
				return false;
			}
			apiParams.fuzzyParam = searchText;
			apiParams.pageNum = 1;
			loadLoanList(apiParams, function() {
				delete apiParams.fuzzyParam;
			});
		});		
 	}
 	
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/main'), function() {
		$scope.def.listTmpl = render.$console.find('#loanlisttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#loanTable'),
			$paging: $console.find('#pageToolbar')
		}
		if($params.process) {
			$('#processTag').data('category', $params.process).text($params.name);
		} else {
			$('#processTag').parent().remove();
		}
		loadLoanList(apiParams, function() {
			evt();
		});
		setupDatepicker();
		setupDropDown();
		setupNewOrder();
	});

	$scope.paging = function(_page, _size, $el, cb) {
		apiParams.pageNum = _page;
		loadLoanList(apiParams);
		cb();
	}

	$scope.carPicker = function(picked) {
		console.log(picked);
	}
	$scope.bankPicker = function(picked) {
		console.log(picked);
	}

	/**dropdown 测试*/
	function setupDropDown() {
		$console.find('.select').dropdown();
	}

	var car = {
		brand: function(cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carBrandlist',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'brandId',
						name: 'carBrandName'
					}
					cb(sourceData);
				}
			})
		},
		series: function(brandId, cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carSeries',
				data: {brandId: brandId},
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'serieName'
					}
					cb(sourceData);
				}
			})
		},
		specs: function(seriesId, cb) {
			$.ajax({
				url: 'http://localhost:8083/mock/carSpecs',
				data: {
					serieId: seriesId
				},
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'carSerieId',
						name: 'specName'
					};

					cb(sourceData);
				}
			})
		}
	}

	$scope.dropdownTrigger = {
		car: function(tab, parentId, cb) {
			if(!cb && typeof cb != 'function') {
				cb = $.noop;
			}
			if(!tab) return cb();
			switch (tab) {
				case '品牌':
					car.brand(cb);
					break;
				case "车系":
					car.series(parentId, cb);
					break;
				case "车型":
					car.specs(parentId, cb);
					break;
				default:
					break;
			}
		},
		bank: function(t, p, cb) {
			$.ajax({
				// url: $http.api('demandBank/selectBank', 'zyj'),
				url: 'http://localhost:8083/mock/carSpecs',
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'id',
						name: 'specName'
					};
					cb(sourceData);
				})
			})
		}
	}
});



