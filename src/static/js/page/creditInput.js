'use strict';
page.ctrl('creditInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tabs = {};
	$scope.idx = 0;
	$scope.apiParams = [];

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
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
			// url: $http.api('creditUser/getCreditInfo', 'jbs'),
			url: 'http://192.168.1.124:8080/creditUser/getCreditInfo',
			data: {
				taskId: 80871
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.index = idx;
				$scope.result = result;
				console.log($scope.result)
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
		var key = res.dir + file.name;
		console.log(key)
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
				var _url = res.host + '/' + fd.get('key');
				// var _name = fd.get('key');
				// _name = _name.substr(_name.lastIndexOf('/') + 1);
				if(cb && typeof cb == 'function') {
					cb(_url);
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
			var tml = '<div class="input-text">\
						<input type="text" value="{0}" readonly="true" />\
					</div>',
				that = $(this),
				$parent = that.parent().parent(),
				file = this.files[0];
			$.ajax({
				url: 'http://112.74.99.75:8089/oss/video/sign',
				dataType: 'json'
			}).done(function(response) {
				if(!response.code) {
					pdfCb(response.data, file, function(_url) {
						// 上传完成pdf后将地址信息保存在待提交数组apiParams中
						for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
							var item = $scope.apiParams[i];
							if(that.data('userId') == item.userId) {
								item[that.data('type')] = _url;
							}
						}
						var reportName = _url.substr(_url.lastIndexOf('/') + 1);
						console.log(reportName)
						if(!that.data('value')) {
							console.log($parent.siblings().find('.file-area'))
							$parent.siblings().eq(0).html(tml.format(reportName));
							$parent.find('.button').html('重新上传');
							that.data('value', true);
						} else {
							$parent.siblings().eq(0).html(tml.format(reportName));
						}
					});
				} else {
					pdfCb(false, file);
				}
				
			});
			
		});
		setupDropDown($el);
		$el.find('.uploadEvt').imgUpload();
		// 征信报告失去焦点事件
		$el.find('.creditReportId').on('blur', function() {
			var that = $(this),
				value = that.val(),
				$parent = that.parent();
			if(!value) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				$parent.append('<span class=\"input-err\">该项不能为空！</span>');
				return false;
			} else {
				$parent.removeClass('error-input');
				$parent.find('.input-err').remove();
			}
			for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
				var item = $scope.apiParams[i];
				if(that.data('userId') == item.userId) {
					item[that.data('type')] = value;
				}
			}
			console.log($scope.apiParams);
		});

		// 备注失去焦点事件
		$el.find('.remark').on('blur', function() {
			var that = $(this),
				value = that.val();
			console.log(value)
			if(!value) {
				that.removeClass('error-input').addClass('error-input');
				return false;
			} else {
				that.removeClass('error-input');
			}
			for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
				var item = $scope.apiParams[i];
				if(that.data('userId') == item.userId) {
					item[that.data('type')] = value;
				}
			}
			console.log($scope.apiParams);
		});

		// 征信字段失去焦点事件
		$el.find('.zxzd').on('blur', function() {
			var that = $(this),
				value = that.val();
			console.log(value)
			if(!value) {
				that.removeClass('error-input').addClass('error-input');
				return false;
			} else {
				that.removeClass('error-input');
			}
			for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
				var item = $scope.apiParams[i];
				if(that.data('userId') == item.userId) {
					for(var j = 0, len2 = item.loanCreditResultList.length; j < len2; j++) {
						if(that.data('id') == item.loanCreditResultList[j].id) {
							item.loanCreditResultList[j][that.data('type')] = value;
						}
					}
				}
			}
			console.log($scope.apiParams);
		});
	}

	/**
	* 页面首次加载绑定立即处理事件
	*/
	var evt = function() {
		// 底部提交按钮事件
		$console.find('#submitOrders').on('click', function() {
			var that = $(this);
			// if( ) {
			// 	//判断必填项是否填全
			// } else {

			// }
			commitData(function() {
				$.confirm({
					title: '提交',
					content: dialogTml.wContent.suggestion,
					useBootstrap: false,
					boxWidth: '500px',
					theme: 'light',
					type: 'purple',
					buttons: {
						'取消': {
				            action: function () {

				            }
				        },
				        '确定': {
				            action: function () {
		            			var _reason = $('#suggestion').val();
		            			console.log(_reason);
		            			if(!_reason) {
		            				$.alert({
		            					title: '提示',
										content: '<div class="w-content"><div>请填写处理意见！</div></div>',
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
		            				return false;
		            			} else {
		            				$.ajax({
										type: 'post',
										url: $http.api('task/complete', 'jbs'),
										data: {
											taskId: $params.taskId,
											orderNo: $params.orderNo,
											reason: _reason
										},
										dataType: 'json',
										success: $http.ok(function(result) {
											console.log(result);
										})
									})
		            			}
				            }
				        }
				        
				    }
				})
				// that.openWindow({
				// 	title: '提交',
				// 	content: dialogTml.wContent.suggestion,
				// 	commit: dialogTml.wCommit.cancelSure
				// }, function($dialog) {
				// 	console.log($dialog)
				// 	$dialog.find('.w-sure').on('click', function() {
				// 		$dialog.remove();
				// 		var _reason = $dialog.find('#suggestion').text();
				// 		console.log(_reason)
				// 		$.ajax({
				// 			type: 'post',
				// 			url: $http.api('task/complete', 'jbs'),
				// 			data: {
				// 				taskId: $params.taskId,
				// 				orderNo: $params.orderNo,
				// 				reason: _reason
				// 			},
				// 			dataType: 'json',
				// 			success: $http.ok(function(result) {
				// 				console.log(result);
				// 			})
				// 		})
				// 	})
				// })
			})
			
		})
	}


	var commitData = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('creditUser/updCreditList', 'jbs'),
			data: JSON.stringify($scope.apiParams),
			dataType: 'json',
			contentType: 'application/json;charset=utf-8',
			success: $http.ok(function(result) {
				console.log(result);
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	/**
	 * 初始化提交信息的参数
	 */
	var initApiParams = function() {
		for(var i in $scope.result.data.creditUsers) {
			for(var j = 0, len2 = $scope.result.data.creditUsers[i].length; j < len2; j++) {
				var item = $scope.result.data.creditUsers[i][j];
				$scope.apiParams.push(item);
			}
		}
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
			initApiParams();
			setupLocation();
		});
		evt();
	});

	/***
	* 删除图片后的回调函数
	*/
	$scope.deletecb = function(self) {
		// loadOrderInfo($scope.idx);
		self.$el.remove();
		pictureListen();
	}
	/**
	 * 监听其它材料最后一个控件的名称
	 */
	var pictureListen = function() {
		var $imgel = $console.find('.creditMaterials .uploadEvt');
		$imgel.each(function(index) {
			$(this).find('.imgs-item-p').html('征信报告照片' + (index + 1));
		});
		$imgel.last().data('name', '征信报告照片' + $imgel.length);
	}

	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		// console.log(self.$el);
		// self.$el.find('.imgs-item-p').html('征信报告' + self.$el.data('count'));
		// self.$el.after(self.outerHTML);
		// self.$el.next().imgUpload();
		self.$el.after(self.outerHTML);
		pictureListen();
		self.$el.next().imgUpload();
	}


	/**
	 * 下拉框请求数据回调
	 */
	$scope.dropdownTrigger = {
		creditLevel: function(t, p, cb) {
			var data = [
				{
					id: 1,
					name: '正常'
				},
				{
					id: 2,
					name: '关注'
				},
				{
					id: 3,
					name: '禁入'
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

	$scope.creditLevelPicker = function(picked) {
		console.log(picked);
		var that = this.$el;
		for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
			var item = $scope.apiParams[i];
			if(that.data('userId') == item.userId) {
				item[that.data('type')] = picked.id;
			}
		}
		console.log($scope.apiParams);
	}
});