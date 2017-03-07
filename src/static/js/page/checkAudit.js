'use strict';
page.ctrl('checkAudit', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
	var urlStr = "http://192.168.0.123:8080";
	var apiMap = {
		"serviceType": urlStr+"/loanConfigure/getItem",//业务类型
		"brand": urlStr+"/demandBank/selectBank",//经办银行
		"busiSourceType": urlStr+"/loanConfigure/getItem",//业务来源类型
		"busiArea": urlStr+"/area/get",//三级下拉省市县
		"busiSourceName": urlStr+"/carshop/list",//业务来源方名称
		"busiSourceNameSearch": urlStr+"/carshop/searchCarShop",//业务来源方名称模糊搜索
		"onLicensePlace": urlStr+"/area/get",//三级下拉省市县
		"busimode": urlStr+"/loanConfigure/getItem",//业务模式
		"carName": urlStr+"/car/carBrandList",//三级车辆型号:车辆品牌
		"carNameSearch":  urlStr+"/car/searchCars",//车辆型号模糊搜索
		"repaymentTerm": urlStr+"/loanConfigure/getItem", //还款期限
		"remitAccountNumber": urlStr+"/demandCarShopAccount/getAccountList" //打款账号
	};
	var dataMap = {
		    "sex":[
		        {
		            "name":"男",
		            "value":"0"
		        },
		        {
		            "name":"女",
		            "value":"1"
		        }
		    ],
		    "isSecond":[
		        {
		            "name":"新车",
		            "value":"0"
		        },
		        {
		            "name":"二手车",
		            "value":"1"
		        }
		    ],
		    "licenseType":[
		        {
		            "name":"公牌",
		            "value":"0"
		        },
		        {
		            "name":"私牌",
		            "value":"1"
		        }
		    ],
		    "isFinanceLeaseVehicle":[
		        {
		            "name":"是融资租赁车",
		            "value":"0"
		        },
		        {
		            "name":"不是融资租赁",
		            "value":"1"
		        }
		    ],
		    "isOperationVehicle":[
		        {
		            "name":"运营车",
		            "value":"0"
		        },
		        {
		            "name":"非运营车",
		            "value":"1"
		        }
		    ],
		    "isInstallGps":[
		        {
		            "name":"是",
		            "value":"0"
		        },
		        {
		            "name":"否",
		            "value":"1"
		        }
		    ],
		    "isDiscount":[
		        {
		            "name":"贴息",
		            "value":"0"
		        },
		        {
		            "name":"不贴息",
		            "value":"1"
		        }
		    ],
		    "renewalMode":[
		        {
		            "name":"自行办理",
		            "value":"0"
		        },
		        {
		            "name":"单位承保",
		            "value":"1"
		        }
		    ],
		    "renewalModeList":[
		        {
		            "name":"自行办理",
		            "value":"0"
		        },
		        {
		            "name":"单位承保",
		            "value":"1"
		        }
		    ],
		    "isAdvanced":[
		        {
		            "name":"需要垫资",
		            "value":"0"
		        },
		        {
		            "name":"不需要垫资",
		            "value":"1"
		        }
		    ],
		    "maritalStatus":[
		        {
		            "name":"已婚",
		            "value":"0"
		        },
		        {
		            "name":"未婚",
		            "value":"1"
		        }
		    ],
		    "houseStatus":[
		        {
		            "name":"有商品房",
		            "value":"0"
		        },
		        {
		            "name":"有房",
		            "value":"1"
		        }
		    ],
		    "isEnterprise":[
		        {
		            "name":"是企业法人",
		            "value":"0"
		        },
		        {
		            "name":"不是企业法人",
		            "value":"1"
		        }
		    ],
		    "userRelationship":[
		        {
		            "name":"父母",
		            "value":"0"
		        },
		        {
		            "name":"子女",
		            "value":"1"
		        }
		    ],
		    "relationship":[
		        {
		            "name":"同事",
		            "value":"0"
		        },
		        {
		            "name":"朋友",
		            "value":"1"
		        }
		    ]
		};
	var postUrl = {
		"saveOrderInfo": urlStr+"/loanInfoInput/updLoanOrder",
		"saveCarInfo": urlStr+"/loanInfoInput/updLoanUserCar",
		"saveStageInfo": urlStr+"/loanInfoInput/updLoanUserStage",
		"saveCommonInfo": urlStr+"/loanInfoInput/updLoanUser",
		"saveEmergencyInfo": urlStr+"/loanInfoInput/updLoanEmergencyConact",
		"saveloanPayCardInfo": urlStr+"/loanInfoInput/updLoanPayCard",
		"saveFYXXInfo": urlStr+"/loanInfoInput/updLoanFee",
		"saveQTXX": urlStr+"/loanInfoInput/updLoanIndividuation"
	};
	/**
	* 设置面包屑
	*/
	var setupLocation = function(loanUser) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		var _orderDate = tool.formatDate($scope.$params.date, true);
		$location.data({
			backspace: $scope.$params.path,
			loanUser: loanUser,
			current: '审核列表',
			orderDate: _orderDate
		});
		$location.location();
	}
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		var data={};
		data['taskId']=80872;
		$.ajax({
			url: urlStr+'/loanTelApproval/info',
			data: data,
			success: $http.ok(function(result) {
				$scope.result = result;
//				// 启动面包屑
//				var _loanUser = $scope.result.data[0].loanUserCredits[0].userName;
//				setupLocation(_loanUser);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.cfgData, true);
				if(cb && typeof cb == 'function') {
					cb();
				}
//				loanFinishedSelect();
				setupEvent();
			})
		})
	}
	var setupEvent = function() {
		/**
		* 绑定立即处理事件
		*/
		$console.find('.tab-bar a').on('click', function() {
			var that = $(this);
			var idx = that.data('idx');
			var loanTasks = $scope.pageData[idx].loanTasks;
			var taskObj = {};
			for(var i = 0, len = loanTasks.length; i < len; i++) {
				var obj = loanTasks[i];
				taskObj[obj.category] = {
					taskId: obj.id,
					scene: obj.sceneName
				}
			}
			router.render(that.data('href'), {
				tasks: taskObj,
				path: 'checkAudit'
			});
		});
		// $('.select').dropdown($scope);
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
//点击下拉框拉取选项	
	$(document).on('click','.selecter', function() {
		$(".selectOptBox1",$(this)).show();
	})
	
//	$(document).on('click','#aaa', function() {
//		$.getScript("static/js/page/phoneAudit.js", function() {
//			$("#eleCheck").load("iframe/phoneAudit.html");
//		);
//	})
	
	
	
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
//			$(this).parent().parent().after("<div class='opcity0'>这个是新增的div</div>");
		}
		$(".selectOptBox1").hide();
		return false;
	})
	/***
	* 保存按钮
	*/
	$(document).on('click', '.saveBtn', function() {
		var isTure = true;
		var requireList = $(this).parent().siblings().find("form").find(".required");
		requireList.each(function(){
			var value = $(this).val();
			if(!value){
				$(this).parent().addClass("error-input");
				$(this).after('<i class="error-input-tip">请完善该必填项</i>');
				console.log($(this).index());
				isTure = false;
//				return false;
			}
		});
		if(isTure){
			var data;
	        var formList = $(this).parent().siblings().find('form');
	        console.log("form的个数为："+formList.length);
	        if(formList.length == 1){
		        var params = formList.serialize();
	            params = decodeURIComponent(params,true);
	            var paramArray = params.split("&");
	            var data1 = {};
	            for(var i=0;i<paramArray.length;i++){
	                var valueStr = paramArray[i];
	                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
	            }
	            data = data1;
	        }else{
	        	data = [];
		        formList.each(function(index){
			        var params = $(this).serialize();
		            params = decodeURIComponent(params,true);
		            var paramArray = params.split("&");
		            var data1 = {};
		            for(var i=0;i<paramArray.length;i++){
		                var valueStr = paramArray[i];
		                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
		            }
					console.log(data1);
					data[index]=data1;
		        })
	        }
	        console.log(data);
	        
			$.ajax({
				type: 'POST',
				url: '127.0.0.1',
				data:JSON.stringify(data),
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
	$console.load(router.template('iframe/checkAudit'), function() {
		$scope.def.tabTmpl = $console.find('#checkResultTabsTmpl').html();
		$scope.def.listTmpl = $console.find('#eleChecktmpl').html();
//		$scope.def.selectOpttmpl = $console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tab: $console.find('#checkTabs'),
			$tbl: $console.find('#eleCheck')
		}
		loadLoanList(apiParams);
	})
});



