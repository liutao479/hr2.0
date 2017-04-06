'use strict';
page.ctrl('creditInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tabs = {};
	$scope.idx = 0;
	$scope.apiParams = [];
	// $params.taskId = 80876;

	/**
	* 加载征信结果录入数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(idx, cb) {
		$.ajax({
			type: 'post',
			url: $http.api('creditUser/getCreditInfo', 'jbs'),
			data: {
				taskId: $params.taskId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result);
				result.index = idx;
				$scope.result = result;
				$scope.result.editable = 1;
				$scope.result.userRalaMap = {
					'0': '本人',
					'1': '配偶',
					'2': '父母',
					'3': '子女',
					'-1': '其他'
				};
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
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			current: $scope.result.data.loanTask.taskName,
			orderDate: $scope.result.data.loanTask.loanOrder.createDateStr
		});
		$location.location();
	}

	/**
	* 设置退回原因
	*/
	var setupBackReason = function(data) {
		var $backReason = $console.find('#backReason');
		if(!data) {
			$backReason.remove();
			return false;
		} else {
			$backReason.data({
				backReason: data.reason,
				backUser: data.userName,
				backUserPhone: data.phone,
				backDate: tool.formatDate(data.transDate, true)
			});
			$backReason.backReason();
		}
	}

	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar();
		var $sub = $submitBar[0].$submitBar;

		/**
		 * 提交
		 */
		$sub.on('taskSubmit', function() {
			saveData(function() {
				process();
			});
		})
	}

	/**
	 * 任务提交跳转
	 */
	function process() {
		$.confirm({
			title: '提交订单',
			content: dialogTml.wContent.suggestion,
			buttons: {
				close: {
					text: '取消',
					btnClass: 'btn-default btn-cancel',
					action: function() {}
				},
				ok: {
					text: '确定',
					action: function () {
						var taskIds = [];
						for(var i = 0, len = $params.tasks.length; i < len; i++) {
							taskIds.push(parseInt($params.tasks[i].id));
						}
						var params = {
							taskId: $params.taskId,
							taskIds: taskIds,
							orderNo: $params.orderNo
						}
						var reason = $.trim(this.$content.find('#suggestion').val());
						if(reason) params.reason = reason;
						flow.tasksJump(params, 'complete');
					}
				}
			}
		})
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
			$scope.$el.$tabs.removeClass('role-item-active');
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
		//查看征信材料
		$el.find('.view-creditMaterials').on('click', function() {
			alert('还未做该功能，暂时不测！谢谢！ T.T');
		});
		// 上传pdf文件
		$el.find('.pdfUpload').on('change', function() {
			var tml = '<div class="input-text">\
						<input type="text" value="{0}" readonly="true" />\
					</div>',
				that = $(this),
				$parent = that.parent().parent(),
				file = this.files[0];
			if(!file) return false;
			if(file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase() != 'pdf') {
				$.alert({
					title: '提示',
					content: tool.alert('请选择正确的PDF格式文件上传!'),
					buttons: {
						ok: {
							text: '确定'
						}
					}
				})
				return false;
			}
			$.ajax({
				url: $http.api('oss/video/sign', 'zyj'),
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
						console.log($scope.apiParams)
						if(!that.data('value')) {
							console.log($parent.siblings().find('.file-area'))
							$parent.siblings().eq(0).html(tml.format(reportName));
							$parent.find('.button').html('重新上传').attr('title', '重新上传');
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
			if(that.hasClass('required') && !value) {
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
		// $el.find('.remark').on('blur', function() {
		// 	var that = $(this),
		// 		value = that.val();
		// 	console.log(value)
		// 	if(that.hasClass('required') && !value) {
		// 		that.removeClass('error-input').addClass('error-input');
		// 		return false;
		// 	} else {
		// 		that.removeClass('error-input');
		// 	}
		// 	for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
		// 		var item = $scope.apiParams[i];
		// 		if(that.data('userId') == item.userId) {
		// 			item[that.data('type')] = value;
		// 		}
		// 	}
		// 	console.log($scope.apiParams);
		// });

		// $el.find('.remark').on('keyup', function() {
			
		// });

		// 备注框实时监听事件
		var maxLen = 400;
		$el.find('.remark').next().text('还可输入' + (maxLen - $el.find('.remark').val().length) + '/' + maxLen + '字');
		$el.find('.remark').on('input', function() {
			var that = $(this),
				value = that.val();
			if(value.length > maxLen) {
				that.val(value.substr(0, maxLen));
				that.next().text('还可输入0/' + maxLen + '字');
				return false;
			}
			that.next().text('还可输入' + (maxLen - that.val().length) + '/' + maxLen + '字');
			if(that.hasClass('required') && !value) {
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
				value = $.trim(that.val());
			console.log(value)
			if(that.hasClass('required') && !value) {
				that.removeClass('error-input').addClass('error-input');
				return false;
			} else {
				that.removeClass('error-input');
			}
			for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
				var item = $scope.apiParams[i];
				if(that.data('userId') == item.userId) {
					for(var j = 0, len2 = item.loanCreditResultList.length; j < len2; j++) {
						if(that.data('creditKey') == item.loanCreditResultList[j].creditKey) {
							item.loanCreditResultList[j][that.data('type')] = value;
						}
					}
				}
			}
			console.log($scope.apiParams);
		});

	}


	/**
	 * 保存征信结果录入数据
	 */
	var saveData = function(cb) {
		$.ajax({
			type: 'post',
			url: $http.api('creditUser/updCreditList/' + $params.taskId, 'jbs'),
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
			setupSubmitBar();
			setupLocation();
			setupBackReason($scope.result.data.loanTask.backApprovalInfo)
		});
	});

	/***
	* 删除图片后的回调函数
	*/
	$scope.deletecb = function(self) {
		// loadOrderInfo($scope.idx);
		self.$el.remove();
		pictureListen(self);
	}
	/**
	 * 监听其它材料最后一个控件的名称
	 */
	var pictureListen = function(self) {
		var $imgel = self.$el.parent().find('.uploadEvt');
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
		pictureListen(self);
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