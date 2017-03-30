'use strict';
page.ctrl('surviceType', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		$source = $scope.$source = {},
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};

	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		$.ajax({
			url: urlStr+'/serviceType/index',
			data: {
				taskId: $params.taskId
			},
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				console.log(result);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				loanFinishedInputPic();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		});
	}

	/**
	* 设置面包屑
	*/
	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			current: $scope.result.data.loanTask.taskName,
			loanUser: $scope.result.data.loanTask.loanOrder.realName,
			orderDate: $scope.result.data.loanTask.loanOrder.createDateStr
		});
		$location.location();
	}


	/**
	* 设置底部按钮操作栏
	*/
	var setupSubmitBar = function() {
		var $submitBar = $console.find('#submitBar');
		$submitBar.data({
			taskId: $params.taskId
		});
		$submitBar.submitBar(function($el) {
			evt($el);
		});
	}

	/**
	* 底部按钮操作栏事件
	*/
	var evt = function($el) {
		/**
		 * 提交按钮按钮
		 */
		$el.find('#taskSubmit').on('click', function() {
			process();
		})
	}

	/**
	 * 跳流程
	 */
	function process() {
		$.confirm({
			title: '提交',
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
						console.log(params);
						tasksJump(params, 'complete');
					}
				}
			}
		})
	}

//页面加载完成对框进行设置
	var loanFinishedInputPic = function(){
		var val = $("#dataKey").val();
		if(!val){
			$(".choose-items").each(function (){
				$(this).removeClass('surviceClick');
			})
		}else{
			$(".choose-items").each(function (){
				var key = $(this).data('key');
				if(key == val){
					$(this).addClass('surviceClick');
					$(this).siblings().removeClass('surviceClick');
					return false;
				}
			})
		}
	}
	
	$(document).on('click','.choose-items', function() {
		$(".choose-items").each(function (){
			$(this).removeClass('surviceClick');
		})
		$(this).addClass('surviceClick');
		var key = $(this).data('key');
        $("#dataKey").val(key);
        console.log($("#dataKey").val());
	})


	/***
	* 保存按钮
	*/
	$(document).on('click', '.saveBtn', function() {
		var isTure = true;
		var surviceType = $("#dataKey").val();
		if(!surviceType){
			isTure = false;
			return;
		}
		if(isTure){
			var key = $(this).data('key');
			var data;
	        var formList = $('#dataform');
	        var params = formList.serialize();
            params = decodeURIComponent(params,true);
            var paramArray = params.split("&");
            var data1 = {};
            for(var i=0;i<paramArray.length;i++){
                var valueStr = paramArray[i];
                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
            }
	        console.log(data1);
	        
			$.ajax({
				type: 'post',
				url:  urlStr+'/serviceType/submit',
				data:JSON.stringify(data1),
				dataType:"json",
				contentType : 'application/json;charset=utf-8',
				success: function(result){
					console.log(result.msg);
				}
			});
		}
	})
	
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('iframe/surviceType'), function() {
		$scope.def.listTmpl = render.$console.find('#surviceTypetmpl').html();
		$scope.$el = {
			$tbl: $console.find('#surviceTypeTable')
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams, function() {
			setupSubmitBar();
		});
	});
});



