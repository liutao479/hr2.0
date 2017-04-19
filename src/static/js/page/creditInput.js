'use strict';
page.ctrl('creditInput', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.userMap = {
		0: '借款人',
		1: '共同还款人',
		2: '反担保人'
	};
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
				$scope.result = result;
				$scope.result.index = idx;
				$scope.idx = idx;
				//检测是否是首次加载页面，若是则加载返回结果中第一个用户，而不是加载idx个用户
				if($scope.firstLoad) {
					var creditUsers = $scope.result.data.creditUsers, userType;
					for(var i in creditUsers) {
						userType = i;
						break;
					}
					if(userType != 0) {
						console.log(userType);
						$scope.result.index = userType;
						$scope.idx = userType;
					}
				}
				
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
				setupCreditPanel($scope.idx, $scope.result);

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
			global: false,
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
		// $el.find('.download-creditMaterials').attr('href', $http.api('materialsDownLoad/downLoadCreditMaterials?userIds=' +  +'&downLoadType=' + , true));
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
			that.LoadingOverlay("show");
			$.ajax({
				global: false,
				url: $http.api('oss/video/sign', 'zyj'),
				dataType: 'json'
			}).done(function(response) {
				if(!response.code) {
					pdfCb(response.data, file, function(_url) {
						that.LoadingOverlay("hide");
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
				$parent = that.parent(),
				type = that.data('type');
			if(that.hasClass('required') && !value) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				$parent.append('<span class=\"input-err\">该项不能为空！</span>');
				value = '';
			} else if(!regMap[type].test(value)) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				$parent.append('<span class=\"input-err\">请输入30位以内的数字和字母组合的编号</span>');
				value = '';
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

		function noNumbers(e) {
			var keynum, keychar, numcheck;

			if(window.event) // IE
			  {
			  keynum = e.keyCode;
			  }
			else if(e.which) // Netscape/Firefox/Opera
			  {
			  keynum = e.which;
			  }
			keychar = String.fromCharCode(keynum);
			numcheck = /\w/;
			return numcheck.test(keychar);
		}

		//征信报告编号
		// $el.find('.creditReportId').on('key', function(event) {
		// 	return noNumbers(event);
		// })

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
		var maxLen = 1000;
		// $el.find('.remark').next().text('还可输入' + (maxLen - $el.find('.remark').val().length) + '/' + maxLen + '字');
		$el.find('.remark').on('input', function() {
			var that = $(this),
				value = that.val(),
				$parent = that.parent();
			if(value.length > maxLen) {
				that.val(value.substr(0, maxLen));
				that.next().text('还可输入0/' + maxLen + '字');
				return false;
			}
			that.next().text('还可输入' + (maxLen - that.val().length) + '/' + maxLen + '字');
			if(that.hasClass('required') && !value) {
				$parent.find('.input-err').remove();
				$parent.removeClass('error-input').addClass('error-input');
				return false;
			} else {
				$parent.find('.input-err').remove();
				$parent.removeClass('error-input');
			}
			for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
				var item = $scope.apiParams[i];
				if(that.data('userId') == item.userId) {
					item[that.data('type')] = value;
				}
			}
			console.log($scope.apiParams);
		});

		$el.find('.remark').on('blur', function() {
			var that = $(this),
				value = $.trim(that.val()),
				$parent = that.parent(),
				type = that.data('type');
			if(that.hasClass('required') && !value) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				$parent.append('<span class=\"input-err\">该项不能为空！</span>');
				value = '';
			} else if(regMap[type].test(value)) {
				$parent.removeClass('error-input').addClass('error-input');
				$parent.find('.input-err').remove();
				$parent.append('<span class=\"input-err\">该输入不符合规则！</span>');
				value = '';
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
	 * 检测当前字段是否必填
	 * @param  {string} j     被检测字段的key
	 * @param  {object} item  被检测字段
	 * @return {boolean}      必填返回true, 非必填返回false
	 */
	function verify(j, item) {
		var isEmpty = false;
		for(var k = 0, len2 = $scope.result.cfgData.frames[0].sections[item.userType].segments.length; k < len2; k++) {
			var list = $scope.result.cfgData.frames[0].sections[item.userType].segments[k];
			if(j == 'loanCreditReportList') {
				if(list.code == 'ZXBGP' && !list.empty) {
					isEmpty = true;
				}
			} else if(j == 'loanCreditResultList') {
				if(list.code == 'ZXZD' && !list.empty) {
					isEmpty = true;
				}
			} else {
				if(list.code == j && !list.empty) {
					isEmpty = true;
				}
			}
		}
		return isEmpty;
	}


	/**
	 * 保存征信结果录入数据（带校验）
	 */
	var saveData = function(cb) {
		var _alert = '';
		for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
			var item = $scope.apiParams[i],
				flag = true;
			console.log(item)
			for(var j in item) {
				if(j == 'creditLevel' && !item[j]) {
					_alert = '请选择' + $scope.userMap[item.userType] + '的征信是否合格！';
					flag = false;
					break;
				}
			}
			if(!flag) break;
			for(var j in item) {
				if(j == 'creditReportFile' && !item[j]) {
					_alert = '请上传' + $scope.userMap[item.userType] + '的征信报告文件！';
					flag = false;
					break;
				}
			}
			if(!flag) break;
			for(var j in item) {
				if(j == 'creditReportId') {
					//若征信报告编号必填且为空-->
					if(verify(j, item) && !item[j]) {
						_alert = '请填写' + $scope.userMap[item.userType] + '的征信报告编号！';
						flag = false;
						break;
					}
				}
			}
			if(!flag) break;
			for(var j in item) {
				if(j == 'loanCreditReportList') {
					//若征信报告照片字段必填且为空-->
					if(verify(j, item) && item[j].length == 0) {
						_alert = '请至少上传一张' + $scope.userMap[item.userType] + '的征信报告图片！';
						flag = false;
						break;
					}
				}
			}
			if(!flag) break;
			for(var j in item) {
				if(j == 'loanCreditResultList') {
					//若征信字段必填且为空-->
					var num = 0;
					for(var m = 0, len3 = item[j].length; m < len3; m++) {
						if(!item[j][m].creditVal) {
							num++;
						}
					}
					if(num > 0) {
						_alert = '请完善' + $scope.userMap[item.userType] + '的征信字段！';
						flag = false;
						break;
					}
				}
			}
			if(!flag) break;
			for(var j in item) {
				if(j == 'remark' && !item[j]) {
					_alert = '请填写' + $scope.userMap[item.userType] + '的备注信息！';
					flag = false;
					break;
				}
			}
			if(!flag) break;
		}
		if(!_alert) {
			console.log($scope.apiParams);
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
		} else {
			$.alert({
				title: '提示',
				content: tool.alert(_alert),
				buttons: {
					ok: {
						text: '确定',
						action: function () {
							console.log($scope.apiParams);
						}
					}
				}
			})
			return false;
		}
	}

	/**
	 * 初始化提交信息的参数
	 */
	var initApiParams = function() {
		for(var i in $scope.result.data.creditUsers) {
			for(var j = 0, len2 = $scope.result.data.creditUsers[i].length; j < len2; j++) {
				var row = $scope.result.data.creditUsers[i][j],
					item = $scope.result.data.creditUsers[i][j];
				item.creditLevel = row.creditLevel || '';
				item.creditReportFile = row.creditReportFile || '';
				item.creditReportId = row.creditReportId || '';
				item.remark = row.remark || '';
				item.idx = j;
				$scope.apiParams.push(item);
			}
		}
		console.log($scope.apiParams)
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

		$scope.firstLoad = true;
		loadOrderInfo($scope.idx, function() {
			initApiParams();
			setupSubmitBar();
			setupLocation();
			setupBackReason($scope.result.data.loanTask.backApprovalInfo)
			$scope.firstLoad = false;
		});
		
	});

	/***
	* 删除图片后的回调函数
	*/
	$scope.deletecb = function(self) {
		var $parent = self.$el.parent();
		self.$el.remove();
		pictureListen($parent);
		//重置带保存参数里的征信报告图片（loanCreditReportList）
		$.ajax({
			type: 'post',
			url: $http.api('creditUser/getCreditInfo', 'jbs'),
			data: {
				taskId: $params.taskId
			},
			global: false,
			dataType: 'json',
			success: $http.ok(function(result) {
				for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
					if($scope.apiParams[i].userType == $scope.idx) {
						$scope.apiParams[i].loanCreditReportList = result.data.creditUsers[$scope.idx][$scope.apiParams[i].idx];
					}
				}
			})
		})
	}
	/**
	 * 监听其它材料最后一个控件的名称
	 */
	var pictureListen = function($parent) {
		var $imgel = $parent.find('.uploadEvt');
		$imgel.each(function(index) {
			$(this).find('.imgs-item-p').html('<i class="is-empty">*</i>征信报告照片' + (index + 1));
		});
		$imgel.last().data('idx', $imgel.length - 1);
		$imgel.last().data('name', '征信报告照片' + $imgel.length);
		$imgel.last().find('.imgs-item-p').html('征信报告照片' + $imgel.length);
	}

	/***
	* 上传图片成功后的回调函数
	*/
	$scope.uploadcb = function(self) {
		// console.log(self.$el);
		// self.$el.find('.imgs-item-p').html('征信报告' + self.$el.data('count'));
		// self.$el.after(self.outerHTML);
		// self.$el.next().imgUpload();
		var $parent = self.$el.parent();
		if($parent.find('.uploadEvt').length == self.$el.data('idx') + 1) {
			self.$el.after(self.outerHTML);
		}
		pictureListen($parent);
		self.$el.next().imgUpload();
		//重置带保存参数里的征信报告图片（loanCreditReportList）
		$.ajax({
			type: 'post',
			url: $http.api('creditUser/getCreditInfo', 'jbs'),
			data: {
				taskId: $params.taskId
			},
			dataType: 'json',
			global: false,
			success: $http.ok(function(result) {
				for(var i = 0, len = $scope.apiParams.length; i < len; i++) {
					if($scope.apiParams[i].creditId == self.options.creditid) {
						$scope.apiParams[i].loanCreditReportList = result.data.creditUsers[$scope.idx][$scope.apiParams[i].idx].loanCreditReportList;
					}
				}
			})
		})
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