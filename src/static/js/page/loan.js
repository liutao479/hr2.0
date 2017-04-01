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
			url: $http.api('loanOrder/workbench', 'jbs'),
			data: params,
			success: $http.ok(function(result) {
				console.log(result);
				$scope.pageData = result.data;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				setupPaging(result.page, true);
				setupEvent();

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
			var taskObj = [];
			for(var i = 0, len = loanTasks.length; i < len; i++) {
				var obj = loanTasks[i];
				taskObj.push({
					key: obj.category,
					id: obj.id,
					name: obj.sceneName
				})
			}
			router.render(that.data('href'), {
				taskId: that.data('id'), 
				orderNo: that.data('orderNo'),
				tasks: taskObj,
				path: 'loanProcess'
			});
		});

		/**
		 * 消失隐藏
		 */
		$console.find('#loanTable .loanTasks').hover(function() {
			$(this).find('.meanwhile-hover').toggle();
		})

		/**
		* 任务类型点击显示/隐藏
		*/
		$console.find('#loanTable .arrow').on('click', function() {
			var that = $(this);
			var $tr = that.parent().parent().parent().find('.loantask-item');
			if(!that.data('isShow')) {
				$tr.show();
				that.data('isShow', true);
				that.removeClass('arrow-bottom').addClass('arrow-top');
			} else {
				$tr.hide();
				that.data('isShow', false);
				that.removeClass('arrow-top').addClass('arrow-bottom');
				$tr.eq(0).show();
				$tr.eq(1).show();
			}
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
			if(evt.which == 13) {
				var that = $(this),
					searchText = $.trim(that.val());
				if(!searchText) {
					return false;
				}
				apiParams.fuzzyParam = searchText;
				apiParams.pageNum = 1;
				loadLoanList(apiParams);
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

		// 新建业务
		$console.find('#newBusiness').on('click', function() {
			var that = $(this);
			router.render(that.data('href'), {
				path: 'loanProcess'
			});
		})

		
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



