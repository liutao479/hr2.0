'use strict';
page.ctrl('phoneAudit', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console;
	/**
	* 加载电话审核数据
	* @params {object} params 请求参数 
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(cb) {
		var params = {
			taskId: $params.taskId,
			frameCode: $params.code
		};
		$.ajax({
			url: $http.api('telAdudit/info', 'jbs'),
			data: params,
			type: 'post',
			dataType: 'json',
			success: $http.ok(function(result) {
				$scope.result = result;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result, true);
				if(result.cfgData.frames[0].code != 'T0046'){
					$(".saveBtn").hide();
					$(".selecter").addClass('pointDisabled');
					$(".textArea").addClass('pointDisabled');
				}
				loanFinishedSelect();
				setupEvt();
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}
	
	//页面加载完成对所有下拉框进行赋值	
	var loanFinishedSelect = function(){
		$(".selecter").each(function(){
			$("li",$(this)).each(function(){
				var selected = $(this).data('select');
				var val = $(this).data('key');
				var text = $(this).text();
				if(selected){
					$(this).parent().parent().siblings(".placeholder").html(text);
					$(this).parent().parent().siblings("input").val(val);
					$(this).parent().parent().siblings(".placeholder").attr('title',val);
					var value2 = $(this).parent().parent().siblings("input").val();
					if(!value2){
						$(this).parent().parent().siblings(".placeholder").html("请选择")
					}
				}
			})
			$(".selectOptBox1").hide(); 
		});
	}

	var setupEvt = function($el) {
		$(".select-text").each(function(){
			$(this).attr('readonly','readonly')
		})
		$console.find('.textArea').on('blur', function() {
			var tContext = $(this).text();
			console.log(tContext);
			$(this).siblings('input').val(tContext)
		})
	    /***
		* 保存按钮
		*/
		$console.find('.saveBtn').on('click', function() {
			var $btn = $(this);
			var isTure = true;
			var btnType = $(this).data('type');
			var requireList = $(this).parent().parent().siblings().find("form").find(".required");
			requireList.each(function(){
				if(!value){
					if(!$(this).parent().hasClass('info-value') && !$(this).parent().hasClass('info-check-box')){
						$(this).siblings('.select').addClass("error-input");
						$(this).after('<i class="error-input-tip sel-err">请完善该必填项</i>');
					}else{
						$(this).parent().addClass("error-input");
						$(this).after('<i class="error-input-tip">请完善该必填项</i>');
					}
					isTure = false;
				}
			});
			if(isTure){
//				debugger
				var data;
		        var formList = $(this).parent().parent().siblings().find('form');
	        	data = [];
		        formList.each(function(index){
			        var params = $(this).serialize();
			        var b = params.replace(/\+/g," ");
					b =  decodeURIComponent(b);
		            var paramArray = b.split("&");
//		            params = decodeURIComponent(params,true);
//		            var paramArray = params.split("&");
		            var data1 = {};
		            for(var i=0;i<paramArray.length;i++){
		                var valueStr = paramArray[i];
		                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
		            }
					data[index]=data1;
		        })
				$.ajax({
					type: 'post',
					url: $http.api('telAdudit/updInfo', 'jbs'),
					data: JSON.stringify(data),
					dataType: 'json',
					contentType: 'application/json;charset=utf-8',
					success: $http.ok(function(xhr) {
						console.log(xhr);
						$.alert({
							title: '提示',
							content: tool.alert('信息已保存！'),
							buttons: {
								'确定': {
						            action: function () {
						            }
						        }
						    }
						})
					})
				})				
			}else{
				$.alert({
					title: '提示',
					content: tool.alert('请完善必填项！'),
					buttons: {
						'确定': {
				            action: function () {
				            }
				        }
				    }
				})
				return false;
			}
		})
	}
//点击下拉框拉取选项
	$(document).on('click','.selecter', function() {
		$(".selectOptBox1",$(this)).show();
	})
	//点击下拉选项赋值zhy
	$(document).on('click', '.selectOptBox1 li', function() {
		var value = $(this).data('key');
		var text = $(this).text();
		console.log(value);
		$(this).parent().parent().siblings(".placeholder").html(text);
		$(this).parent().parent().siblings(".placeholder").attr('title',text);
		$(this).parent().parent().siblings("input").val(value);
		var value1 = $(this).parent().parent().siblings("input").val();
		if(!value1){
			$(this).parent().parent().siblings(".placeholder").html("请选择");
		}else{
			$(this).parent().parent().parent().removeClass("error-input");
			$(this).parent().parent().siblings("i").remove();
		}
		$(".selectOptBox1").hide();
		return false;
	});

	//点击下拉消失	zhy
	$(document).on("click",function(e){
		var target = $(e.target);
		if(target.closest(".selecter").length == 0){ 
			$(".selectOptBox1").hide();
			return;
		}
	})
	/***
	* 加载页面模板
	*/
	$console.load(router.template('iframe/phoneAudit'), function() {
		$scope.def.listTmpl = $console.find('#eleChecktmpl').html();
//		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.$el = {
//			$tab: $console.find('#checkTabs'),
			$tbl: $console.find('#eleCheck')
		}
		loadLoanList();
	})
});



