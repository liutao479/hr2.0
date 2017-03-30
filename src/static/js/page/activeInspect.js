'use strict';
page.ctrl('activeInspect', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			pageNum: $params.pageNum || 1,
		};
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'get',
			dataType:"json",
			url: $http.api('activeInspect'),
			data: param,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				// 构造分页
				setupPaging(result.page, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 构造分页
	var setupPaging = function(_page, isPage) {
		$scope.$el.$paging.data({
			current: parseInt(apiParams.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$scope.$el.$paging.paging();
	};
	// 分页回调
	$scope.paging = function(_pageNum, _size, $el, cb) {
		apiParams.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		search(apiParams);
		cb();
	}
	// 页面首次载入时绑定事件
 	var evt = function() {
		$console.off("click",".gocheck").on("click",".gocheck", function() {
			var that=$(this);
			var _id=that.data("id");
			that.openWindow({
				title:"请选择查询类型",
				content: dialogTml.wContent.btngroup,
				commit: dialogTml.wCommit.cancelSure,
				data:[
					{select:false,text:"法院执行记录"},
					{select:false,text:"购车发票"},
					{select:false,text:"登记证状态"},
					{select:false,text:"网贷记录"},
					{select:false,text:"公安信息"},
					{select:false,text:"抵押状态"},
				]
			},function($dialog){
				var _arr=[];
				$dialog.off("click",".block-item-data:not(.selected)").on("click",".block-item-data:not(.selected)", function() {
					$(this).addClass("selected");	
					_arr.push($(this).text());			
				});
				$dialog.off("click",".w-sure").on("click",".w-sure", function() {
					$dialog.remove();
					console.log("选择了："+_arr);
					$.ajax({
						type: "post",
						url: $http.api('dataVerification/loan'),
						data:{},
						dataType:"json",
						success: $http.ok(function(result) {		
							var jc=$.dialog($scope.def.toastTmpl,function($dialog){
								//$(".jconfirm .jconfirm-closeIcon").hide();
								var context=$(".jconfirm .jconfirm-content").html();
								if(context){
									setTimeout(function() {
										jc.close()
									}, 2000);
								};
							});
						})
					});						
				});
			});
		});
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/active-inspect'), function() {
		$scope.def.listTmpl = render.$console.find('#activeInspectTmpl').html();
		$scope.def.toastTmpl = render.$console.find('#importResultTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#tableContext'),
			$paging: $console.find('#pageToolbar')
		};
		search(apiParams, function() {
			evt();
		});
		// 启用下拉功能
		$console.find('.select').dropdown();
		// 日期控件
		$console.find('.dateBtn').datepicker();
		$console.find('.dateBtn').val(tool.formatDate(new Date().getTime()));
	});

	// 省市区数据源
	var areaSel = {
		province: function(cb) {
			$.ajax({
				url: urlStr+'/area/get',
				dataType:'json',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					};
					cb(sourceData);
				}
			})
		},
		city: function(areaId, cb) {
			$.ajax({
				url: urlStr+'/area/get',
				data: {
					parentId: areaId
				},
				dataType: 'json',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					}
					cb(sourceData);
				}
			})
		},
		country: function(areaId, cb) {
			$.ajax({
				url: urlStr+'/area/get',
				data: {
					parentId: areaId
				},
				dataType: 'json',
				success: function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'areaId',
						name: 'name'
					};
					cb(sourceData);
				}
			})
		}
	};
	// 下拉功能数据
	$scope.dropdownTrigger = {
		demandBank: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
		areaSel: function(tab, parentId, cb) {
			if(!cb && typeof cb != 'function') {
				cb = $.noop;
			}
			if(!tab) return cb();
			switch (tab) {
				case '省':
					areaSel.province(cb);
					break;
				case "市":
					areaSel.city(parentId, cb);
					break;
				case "区":
					areaSel.country(parentId, cb);
					break;
				default:
					break;
			}
		},
		statusSel: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
		dealerSel: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
		carTypeSel: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
		mortgageSel: function(t, p, cb) {
			$.ajax({
				type: 'post',
				url: $http.api('demandBank/selectBank', 'zyj'),
				dataType: 'json',
				success: $http.ok(function(xhr) {
					var sourceData = {
						items: xhr.data,
						id: 'bankId',
						name: 'bankName'
					};
					cb(sourceData);
				})
			})
		},
		recordSel: function(t, p, cb) {
			cb({
				items:[
					{id:"1",name:"是"},
					{id:"0",name:"否"}
				],
				id: 'id',
				name:'name'
			});
		}
	};
	// 下拉回调
	$scope.bankPicker=function(val){
		console.log(val)
	};
	$scope.areaPicker=function(val){
		console.log(val)
	};
	$scope.statusPicker=function(val){
		console.log(val)
	};
	$scope.dealerPicker=function(val){
		console.log(val)
	};
	$scope.carTypePicker=function(val){
		console.log(val)
	};
	$scope.mortgagePicker=function(val){
		console.log(val)
	};
	$scope.recordPicker=function(val){
		console.log(val)
	};
});



