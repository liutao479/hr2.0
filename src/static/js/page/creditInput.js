'use strict';
page.ctrl('creditInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tabs = {};
	$scope.idx = 0;

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data[0][0].userName,
			current: '征信结果录入',
			orderDate: '2017-12-12 12:12'
		});
		$location.location();
	}

	/**
	* 加载征信结果录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(idx, cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/creditInput',
			type: 'post',
			url: $http.api('creditUser/getCreditInfo', 'jbs'),
			data: {
				taskId: 80876
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.index = idx;
				$scope.result = result;

				// 编译tab栏
				setupTab($scope.result, function() {
					setupTabEvt();
				});

				// 编译tab项对应内容
				setupCreditPanel(idx, $scope.result);

				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}


	/**
	* dropdown控件
	*/
	function setupDropDown($el) {
		$el.find('.select').dropdown();
	}

	/**
	 * 渲染tab栏
	 * @param  {object} result 请求获得的数据
	 */
	var setupTab = function(result, cb) {
		result.types = ['借款人', '共同还款人', '反担保人'];
		result.format = {
			'ZJR': 0,
			'GTHKR': 1,
			'FDBR': 2
		};
		render.compile($scope.$el.$tab, $scope.def.tabTmpl, result, true);
		$scope.$el.$tabs = $scope.$el.$tab.find('.tabEvt');

		if(cb && typeof cb == 'function') {
			cb();
		}
	}

	/**
	 * 渲染tab栏对应项内容
	 * @param  {object} result 请求获得的数据
	 */
	var setupCreditPanel = function(idx, result, cb) {
		// 编译对应idx的tab项内容，将目标编译tab项内容页显示，隐藏其他tab项内容
		var _tabTrigger = $scope.$el.$tbls.eq(idx);
		$scope.tabs[idx] = _tabTrigger;
		render.compile(_tabTrigger, $scope.def.listTmpl, result, function() {
			setupEvt(_tabTrigger);
		}, true);
		for(var i = 0, len = $scope.$el.$tbls.length; i < len; i++) {
			if(i == idx) {
				$scope.$el.$tbls.eq(i).show();
			} else {
				$scope.$el.$tbls.eq(i).hide();
			}
		}
		$scope.currentType = idx;
		if( cb && typeof cb == 'function' ) {
			cb();
		}
	}

	
	/**
	* 绑定tab栏立即处理事件
	*/
	var setupTabEvt = function () {
		$scope.$el.$tab.find('.tabEvt').on('click', function () {
			var $this = $(this);
			if($this.hasClass('role-item-active')) return;
			var _type = $this.data('type');
			if(!$scope.tabs[_type]) {
				var _tabTrigger = $scope.$el.$tbls.eq(_type);
				$scope.tabs[_type] = _tabTrigger;
				$scope.result.index = _type;
				render.compile(_tabTrigger, $scope.def.listTmpl, $scope.result, function() {
					setupEvt(_tabTrigger);
				}, true);
			}
			$scope.$el.$tabs.eq($scope.idx).removeClass('role-item-active');
			$this.addClass('role-item-active');
			$scope.$el.$tbls.eq($scope.idx).hide();
			$scope.$el.$tbls.eq(_type).show();
			$scope.idx = _type;
		})
	}

	var pdfCb = function(res, file, cb) {
		if(!res) {
			throw "can not get the license";
		}
		console.log(res);
		// var suffix = file.name.substr(file.name.lastIndexOf('.'));
		var key = res.dir + 'credit-report-file/' + file.name;
		var fd = new FormData();
		fd.append('OSSAccessKeyId', res.accessId);
		fd.append('policy', res.policy);
		fd.append('Signature', res.signature);
		fd.append('key', key);
		fd.append('file', file, file.name);
		fd.append('success_action_status', 200);
		$.ajax({
			url: res.host,
			data: fd,
			type: 'post',
			processData: false,
			dataType: 'xml',
			contentType: false,
			success: function(response) {
				// var _url = res.host + '/' + fd.get('key');
				var _name = fd.get('key');
				_name = _name.substr(_name.lastIndexOf('/') + 1);
				if(cb && typeof cb == 'function') {
					cb(_name);
				}

			}
		})
	}

	/**
	* 绑定立即处理事件
	*/
	var setupEvt = function($el) {
		// 上传pdf文件
		$el.find('.pdfUpload').on('change', function() {
			var tml = '<div class="panel-value-item">\
							<div class="input-text">\
								<input type="text" value="{0}" readonly="true" />\
							</div>\
						</div>',
				that = $(this),
				$parent = that.parent().parent(),
				file = this.files[0];
			$.ajax({
				url: 'http://112.74.99.75:8089/oss/video/sign',
				dataType: 'json'
			}).done(function(response) {
				if(!response.code) {
					pdfCb(response.data, file, function(reportName) {
						console.log(reportName)
						console.log(that.data('value'));
						if(!that.data('value')) {
							$parent.before(tml.format(reportName));
							that.prev().html('重新上传');
							that.data('value', true);
						} else {
							$parent.before(tml.format(reportName));
						}
					});
				} else {
					pdfCb(false, file);
				}
				
			});
			
		});
		setupDropDown($el);
		$el.find('.uploadEvt').imgUpload();
	}

	/**
	* 页面首次加载绑定立即处理事件
	*/
	var evt = function() {
		$console.find('#submitOrders').on('click', function() {

		})
	}


	var commitData = function() {
		
	}

	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/credit-result-typing'), function() {
		$scope.def = {
			tabTmpl: $console.find('#creditResultTabsTmpl').html(),
			listTmpl: $console.find('#creditResultListTmpl').html()
		}
		$scope.$el = {
			$tbls: $console.find('#creditResultPanel > .tabTrigger'),
			$tab: $console.find('#creditTabs'),
			$paging: $console.find('#pageToolbar')
		}
		loadOrderInfo($scope.idx, function() {
			setupLocation();
		});
	});

	/***
	* 删除图片后的回调函数
	*/
	$scope.deletecb = function() {
		loadOrderInfo($scope.idx);
	}

	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		console.log(self.$el);
		self.$el.find('.imgs-item-p').html('征信报告' + self.$el.data('count'));
		self.$el.after(self.outerHTML);
		self.$el.next().imgUpload();
	}


	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		isQualified: function(t, p, cb) {
			var data = [
				{
					id: 0,
					name: '合格'
				},
				{
					id: 1,
					name: '不合格'
				}
			];
			var sourceData = {
				items: data,
				id: 'id',
				name: 'name'
			};
			cb(sourceData);
		}
	}

	$scope.isQualifiedPicker = function(picked) {
		console.log(picked);	
	}
});