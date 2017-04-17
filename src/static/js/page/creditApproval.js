'use strict';
page.ctrl('creditApproval', [], function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		hasCheck="0";/*是否已经核查过*/;
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
			current: $scope.result.data.loanTask.taskName,
			orderDate: $scope.result.data.loanTask.loanOrder.createDateStr
		});
		$location.location();
	}
	/*查询是否有报告*/
	var searchIsPre=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('creditAudit/checkUserItem',true),
			data: param,
			success: $http.ok(function(res) {
				hasCheck=res.data.hasCheck;
				/*回调*/
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	/**
	* 加载征信预审核数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadOrderInfo = function(idx, cb) {
		$.ajax({
			// url: 'http://127.0.0.1:8083/mock/creditInput',
			type: 'post',
			url: $http.api('creditUser/getCreditInfo', 'jbs'),
			data: {
				taskId: $params.taskId,
				frameCode: 'T0061'
			},
			dataType: 'json',
			success: $http.ok(function(result) {
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
						$scope.result.index = userType;
						$scope.idx = userType;
					} else {
						$scope.result.index = idx;
						$scope.idx = idx;
					}
				}
				$scope.result.editable = 0;
				$scope.result.userRalaMap = {
					'0': '本人',
					'1': '配偶',
					'2': '父母',
					'3': '子女',
					'-1': '其他'
				};
				var _userId=creditUsers[$scope.result.index][0].userId;
				searchIsPre({
					userId:_userId,
					orderNo:$params.orderNo
				},function(){
					// 编译tab栏
					setupTab($scope.result, function() {
						setupTabEvt();
					});
					// 编译tab项对应内容
					setupCreditPanel(idx, $scope.result);
					if(cb && typeof cb == 'function') {
						cb();
					};					
				});/*查询是否有报告*/
			})
		})
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
			setupEvt(_tabTrigger, idx);
		}, true);
		if(hasCheck=="1")/*1已结查过了*/
			_tabTrigger.find(".assistData").show();
		else/*0没有查过*/
			_tabTrigger.find(".assistData").hide();
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
			var _userId=$scope.result.data.creditUsers[_type][0].userId;
			searchIsPre({userId:_userId},function(){		
				if(!$scope.tabs[_type]) {
					var _tabTrigger = $scope.$el.$tbls.eq(_type);
					$scope.tabs[_type] = _tabTrigger;
					$scope.result.index = _type;
					render.compile(_tabTrigger, $scope.def.listTmpl, $scope.result, function() {
						setupEvt(_tabTrigger, _type);
					}, true);
				}
				$scope.$el.$tabs.removeClass('role-item-active');
				$this.addClass('role-item-active');
				$scope.$el.$tbls.eq($scope.idx).hide();
				$scope.$el.$tbls.eq(_type).show();
				$scope.idx = _type;	
					
				if(hasCheck=="1")/*1已结查过了*/
					 $scope.$el.$tbls.eq(_type).find(".assistData").show();
				else/*0没有查过*/
					 $scope.$el.$tbls.eq(_type).find(".assistData").hide();
			});/*查询是否有报告*/
		})
	}

	/*发起核查*/
	var openDialog=function(that,_data,_uid){
		that.openWindow({
			title:"核查项目选择",
			content: dialogTml.wContent.btngroup,
			commit: dialogTml.wCommit.cancelSure,
			data:_data
		},function($dialog){
			var _arr=[];
			$dialog.find(".block-item-data:not(.not-selected)").click(function() {
				$(this).toggleClass("selected");	
				var _index=$(this).data("index");
				var _thisVal=_data[_index].key;
				if($(this).hasClass("selected"))
					_arr.push(_thisVal);	
				else
					_arr.splice(_arr.indexOf(_thisVal),1);
			});
			$dialog.find(".w-sure").click(function() {
				$dialog.remove();
				if(_arr.length==0)
					return false;
				$.ajax({
					type: "post",
					url: $http.api('creditAudit/startVerify','cyj'),
					data:{
						keys:_arr.join(','),
						orderNo:$params.orderNo,
						userId:_uid
					/*	keys:'doPolice,bankWater',
						orderNo:'nfdb2016102820480799',
						userId:"334232"*/
					},
					dataType:"json",
					success: $http.ok(function(res) {
						var jc=$.dialog($scope.def.toastTmpl,function($dialog){
							var context=$(".jconfirm .jconfirm-content").html();
							if(context){
								setTimeout(function() {
									jc.close();
								},1500);
							};
						});
					})
				});						
			});
		});		
	};
	/**
	* 绑定立即处理事件
	*/
	var setupEvt = function($self, _type) {
		/**
		 * 启动图片上传控件
		 */
		var imgsBars = $self.find('.creditMaterials');
		imgsBars.each(function(index) {
			var $imgs = $(this).find('.uploadEvt.imgs');
			$imgs.imgUpload({
				viewable: true,
				markable: true,
				getimg: function(cb) {
					cb($scope.result.data.creditUsers[_type][index].loanCreditReportList);
				},
				marker: function (img, mark, cb) {
					var params = {
						id: img.id,
						aduitResult: mark
					}
					if(mark == 0) {
						params.aduitOpinion = '';
					}
					$.ajax({
						type: 'post',
						url: $http.api('creditReport/reportUpd', true),
						data: params,
						dataType: 'json',
						success: $http.ok(function(result) {
							cb();
						})
					})
				},
				onclose: function(imgs) {
					$imgs.each(function(idx) {
						$(this).find('.imgs-error').remove();
						$(this).find('.imgs-item-upload').append(tool.imgs[imgs[idx].auditResult]);
					});
				}
			});
		});

		//查看征信材料
		$self.find('.view-creditMaterials').on('click', function() {
			// alert('还未做该功能，暂时不测！谢谢！ T.T');
			var that = $(this);
			var imgs = $scope.result.data.creditUsers[that.data('type')][that.data('idx')].creditMaterials;
			$.preview(imgs, function(img, mark, cb) {
				cb();	
			}, {
				markable: false
			});
		});


		//查看征信材料
		$self.find('.setJkrEvt').on('click', function() {
			var that = $(this);
			$.ajax({
				type: 'post',
				url: $http.api('creditUser/switchUser', 'jbs'),
				dataType: 'json',
				data: {
					orderNo: $params.orderNo,
					userId: that.data('userId')
				},
				success: $http.ok(function() {
					$scope.idx = 0;
					$scope.tabs = {};
					loadOrderInfo($scope.idx, function() {
						evt();
					});
				})
			})
		});
		//发起核查
		$self.off('click','.gocheck').on('click','.gocheck', function() {
			var that=$(this);
			var _uid=that.data('user-id');
			if(!_uid)
				return false;
			$.ajax({
				type: 'post',
				dataType:'json',
				url: $http.api('creditAudit/itemList','cyj'),
				data: {
					//userId:"10"
					orderNo:$params.orderNo,
					userId:_uid
				},
				success: $http.ok(function(res) {
					if(res&&res.data&&res.data.length>0)
						openDialog(that,res.data,_uid);
					else{
						$.alert({
							title: '提示',
							content: tool.alert("您没有权限进行该操作！"),
							buttons:{
								ok: {
									text: '确定',
								}
							}
						})
					};
				})
			});
		});
		//查看报告结果
		$self.find('.assistData').off('click').on('click', function() {
			var _uid=$(this).data('user-id');
			if(!_uid)
				return false;
			router.render("preAuditDataAssistant", {	
				orderNo:$params.orderNo,
				//userId:'334232',
				userId:_uid,
				sceneCode:'creditApproval',
				upperLevelData:$params,
				backJson:{
					firstHref:"loanProcess",
					firstText:"返回列表",
					secondHref:"loanProcess/creditApproval",
					secondText:"征信预审核",
					secondParam:JSON.stringify($params),
					text:"数据辅证报告"
				}
			});
		});
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
		 * 退回订单
		 */
		$sub.on('backOrder', function() {
			$.alert({
				title: '退回订单',
				content: doT.template(dialogTml.wContent.back)($scope.result.data.loanTask.taskJumps),
				onContentReady: function() {
					dialogEvt(this.$content);
				},
				buttons: {
					close: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function () {
							var _reason = $.trim(this.$content.find('#suggestion').val());
							this.$content.find('.checkbox-radio').each(function() {
								if($(this).hasClass('checked')) {
									var flag = 0;
									$(this).parent().parent().find('.checkbox-normal').each(function() {
										if($(this).hasClass('checked')) {
											flag++;
										}
									})
									if(flag > 0) {
										$scope.jumpId = $(this).data('id');
									}
								}
							})
							if(!_reason) {
								$.alert({
									title: '提示',
									content: tool.alert('请填写处理意见！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							} 
							if(!$scope.jumpId) {
								$.alert({
									title: '提示',
									content: tool.alert('请至少选择一项原因！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							}
							var _params = {
								taskId: $params.taskId,
								jumpId: $scope.jumpId,
								reason: _reason
							}
							$.ajax({
								type: 'post',
								url: $http.api('task/jump', 'zyj'),
								data: _params,
								dataType: 'json',
								success: $http.ok(function(result) {
									router.render('loanProcess');
									// toast.hide();
								})
							})
						}
					}
				}
			})
		})

		/**
		 * 拒绝受理
		 */
		$sub.on('rejectOrder', function() {
			$.alert({
				title: '拒绝受理',
				content: dialogTml.wContent.suggestion,
				buttons: {
					'close': {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
			        },
			        'ok': {
			        	text: '确定',
			            action: function () {
	            			var _reason = $.trim(this.$content.find('#suggestion').val());
            				if(!_reason) {
								$.alert({
									title: '提示',
									content: tool.alert('请填写处理意见！'),
									buttons: {
										ok: {
											text: '确定',
											action: function() {
											}
										}
									}
								});
								return false;
							} 
							$.ajax({
								type: 'post',
								url: $http.api('loanOrder/terminate', 'zyj'),
								data: {
									taskId: $params.taskId,
									reason: _reason
								},
								dataType: 'json',
								success: $http.ok(function(result) {
									router.render('loanProcess');
									// toast.hide();
								})
							})
			            }
			        }
			        
			    }
			});
		});

		/**
		 * 审核通过
		 */
		$sub.on('approvalPass', function() {
			process();
		})
	}

	/**
	* 页面首次加载绑定事件
	*/
	var evt = function() {
		/**
		 * 订单退回的条件选项分割
		 */
		var taskJumps = $scope.result.data.loanTask.taskJumps;
		for(var i = 0, len = taskJumps.length; i < len; i++) {
			taskJumps[i].jumpReason = taskJumps[i].jumpReason.split(',');
		}
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
	 * 取消订单弹窗内事件逻辑处理
	 */
	var dialogEvt = function($dialog) {
		var $reason = $dialog.find('#suggestion');
		$scope.$checks = $dialog.find('.checkbox').checking();
		// 复选框
		$scope.$checks.filter('.checkbox-normal').each(function() {
			var that = this;
			that.$checking.onChange(function() {
				//用于监听意见有一个选中，则标题项选中
				var flag = 0;
				var str = '';
				$(that).parent().parent().find('.checkbox-normal').each(function() {
					if($(this).attr('checked')) {
						str += $(this).data('value') + ',';
						flag++;
					}
				})
				str = '#' + str.substring(0, str.length - 1) + '#';				
				$reason.val(str);
				if(flag > 0) {
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').addClass('checked').attr('checked', true);
				} else {
					$reason.val('');
					$(that).parent().parent().find('.checkbox-radio').removeClass('checked').attr('checked', false);
				}
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);

				// if()
			});
		})

		// 单选框
		$scope.$checks.filter('.checkbox-radio').each(function() {
			var that = this;
			that.$checking.onChange(function() {
				$reason.val('');
				$(that).parent().parent().find('.checkbox-normal').removeClass('checked').attr('checked', false);
				$(that).parent().parent().siblings().find('.checkbox').removeClass('checked').attr('checked', false);
			});
		})
	}


	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/credit-result-typing'), function() {
		$scope.def = {
			tabTmpl: $console.find('#creditResultTabsTmpl').html(),
			listTmpl: $console.find('#creditResultListTmpl').html(),
			toastTmpl:render.$console.find('#importResultTmpl').html()
		}
		$scope.$el = {
			$tbls: $console.find('#creditResultPanel > .tabTrigger'),
			$tab: $console.find('#creditTabs'),
			$paging: $console.find('#pageToolbar')
		}
		$scope.firstLoad = true;
		loadOrderInfo($scope.idx, function() {
			setupLocation();
			evt();
			setupSubmitBar();
			setupBackReason($scope.result.data.loanTask.backApprovalInfo);
			$scope.firstLoad = false;
		});
		
	});

});