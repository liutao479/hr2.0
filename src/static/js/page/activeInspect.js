'use strict';
page.ctrl('activeInspect', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		endDate = tool.formatDate(new Date().getTime()),
		startDate = tool.getPreMonth(endDate),
		pageBcData={},/*保存点击分页时的查询参数*/
		checkedIds=[],
		apiParams = {
			pageNum: $params.pageNum || 1,
			minSelectDate:new Date(startDate),
			maxSelectDate:new Date(endDate),
			provinceId:null,
			cityId:null,
			areaId:null,
			status:null,/*状态*/
			keyWord:null,
			bankId:null,/*经办网点*/
			isSecond:null,/*车辆类型*/
			stageMinMoney:null,
			stageMaxMoney:null,
			overDueStatus:null,/*逾期状态*/
			methodWay:null/*主动核查标记*/
		};
	/*查询前去除空查询字段*/
	var delNull=function(obj){
		for(var i in obj){
			if(obj[i]==null||(obj[i]==""&&obj[i]!==0)||obj[i]==undefined||obj[i]=='undefined')
				delete obj[i];
		};
		return obj;
	};
	/*重置查询表单*/
	var resetForm=function(){
		$scope.$el.$dateStart.val(startDate);
		$scope.$el.$dateEnd.val(endDate);
		$scope.$context.find('.select input').val('');
		$scope.$el.$searchInput.val('');
		$scope.$el.$minMoney.val('');
		$scope.$el.$maxMoney.val('');
		apiParams = {
			pageNum: $params.pageNum || 1,
			minSelectDate:new Date(startDate),
			maxSelectDate:new Date(endDate),
			provinceId:null,
			cityId:null,
			areaId:null,
			status:null,/*状态*/
			keyWord:null,
			bankId:null,/*经办网点*/
			isSecond:null,/*车辆类型*/
			stageMinMoney:null,
			stageMaxMoney:null,
			overDueStatus:null,/*逾期状态*/
			methodWay:null/*主动核查标记*/
		};
	};
	/*获取表单数据*/
	var getFormMsg=function(){
		apiParams.pageNum=1;
		apiParams.minSelectDate=new Date($scope.$el.$dateStart.val());
		apiParams.maxSelectDate=new Date($scope.$el.$dateEnd.val());
		apiParams.keyWord=$.trim($scope.$el.$searchInput.val());
		apiParams.stageMinMoney=$.trim($scope.$el.$minMoney.val());
		apiParams.stageMaxMoney=$.trim($scope.$el.$maxMoney.val());
		return apiParams;
	};
	// 查询列表数据
	var search=function(param,callback){
		$scope.$el.$checkall.removeClass("checked");
		checkedIds=[];
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('bankLoanAfter/getList',true),
			data: param,
			success: $http.ok(function(result) {
				pageBcData=param;
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data.resultlist, true);
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
			current: parseInt(pageBcData.pageNum),
			pages: isPage ? _page.pages : (tool.pages(_page.pages || 0, _page.pageSize)),
			size: _page.pageSize
		});
		$scope.$el.$paging.paging();
	};
	// 分页回调
	$scope.paging = function(_pageNum, _size, $el, cb) {
		pageBcData.pageNum = _pageNum;
		$params.pageNum = _pageNum;
		search(pageBcData);
		cb();
	};
	/*发起核查弹窗*/
	var openDialog=function(_orderNOs){		
		$.ajax({
			type: 'post',
			dataType:'json',
			url: $http.api('bankTask/getAll',true),
			data: {},
			success: $http.ok(function(res) {
				var _data=res.data;
				for(var i in _data){
					_data[i].checkStatus=0;
					_data[i].funcName=_data[i].taskName;
				};				
				var dialogHtml = doT.template(dialogTml.wContent.btngroup)(_data);
				$.confirm({
					title: '请选择查询类型',
					offsetBottom: "50px",
					content:dialogHtml,
					onContentReady:function(){	
						var _btnDialog=this;					
						_btnDialog._arr=[];
						_btnDialog.$content.find(".block-item-data:not(.not-selected)").click(function() {
							$(this).toggleClass("selected");	
							var _val=_data[$(this).data('index')].id;
							if($(this).hasClass("selected"))
								_btnDialog._arr.push(_val);	
							else		
								_btnDialog._arr.splice(_btnDialog._arr.indexOf(_val),1);
						});
					},
					buttons: {
						close: {
							text: '取消',
				        	btnClass:"btn-default btn-cancel",
							action: function() {}
						},
						ok: {
							text: '确定',
							action: function () {
								var _btnDialog=this;
								var _taskIds=_btnDialog._arr.join(',');
								if(_orderNOs&&_taskIds){
									$.ajax({
										type: "post",
										url: $http.api('bankLoanAfter/submitBank',true),
										data:{
											orderNOs:_orderNOs,
											taskIds:_taskIds
										},
										dataType:"json",
										success: $http.ok(function(result) {
											var _tipHtml = doT.template($scope.def.toastTmpl)();
											$.dialog({
												title:false,
												content:_tipHtml,
												onContentReady:function(){
													var _tioDialog=this;
													setTimeout(function() {
														_tioDialog.close();
														resetForm();
														var _searchMsg=getFormMsg();
														search(delNull(_searchMsg));
													},1500);
												}
											});	
										})
									});			
								};	
							}
						}
					}
				});
			})
		});	
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		// 重置表单
		$scope.$el.$resetBtn.click(function() {
			resetForm();
		});
		// 点击查询按钮
		$scope.$el.$searchBtn.click(function() {
			var _searchMsg=getFormMsg();
			search(delNull(_searchMsg));
		});
		/*关键字文本框enter事件*/
		$scope.$el.$searchInput.on('keydown', function(e) {
			if(e.which == 13) {
				var _searchMsg=getFormMsg();
				search(delNull(_searchMsg));
			};
		});
		/*全选/全不选*/
		$scope.$el.$checkall.click(function() {
			$(this).toggleClass('checked');
			checkedIds=[];
			if($(this).hasClass("checked")){
				$scope.$el.$tbl.find(".expire-orders-table").each(function(){
					var _id=$(this).data('id');
					$(this).find('.checkbox-normal').addClass('checked');
					if(_id)
						checkedIds.push(_id);
				});
			}else{
				$scope.$el.$tbl.find(".expire-orders-table").each(function(){
					$(this).find('.checkbox-normal').removeClass('checked');
				});
			};
		});
		/*单选，不选*/
		$scope.$el.$tbl.off("click",".checkbox").on("click",".checkbox",function() {
			$(this).toggleClass('checked');
			var _id=$(this).parents(".expire-orders-table").data('id');
			if($(this).hasClass("checked")){				
				checkedIds.push(_id);
				if(checkedIds.length==$scope.$el.$tbl.find(".expire-orders-table").length)
					$scope.$el.$checkall.addClass("checked");
			}else{
				checkedIds.splice(checkedIds.indexOf(_id),1);
				$scope.$el.$checkall.removeClass("checked");
			};
		});
		/*发起多人核查*/
		$scope.$el.$gocheck.click(function() {
			if(checkedIds.length==0)
				return false;
			openDialog(checkedIds.join(','));
		});
		/*发起单人核查*/
		$scope.$el.$tbl.off("click",".gocheck").on("click",".gocheck",function() {
			var _id=$(this).parents(".expire-orders-table").data("id");
			if(_id)
				openDialog(_id);
		});
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/active-inspect'), function() {
		/*模板*/
		$scope.def.listTmpl = render.$console.find('#activeInspectTmpl').html();
		$scope.def.toastTmpl = render.$console.find('#importResultTmpl').html();
		/*节点*/
		$scope.$context=$console.find('#active-inspect')
		$scope.$el = {
			$tbl: $scope.$context.find('#tableContext'),
			$paging: $scope.$context.find('#pageToolbar'),
			$resetBtn: $scope.$context.find('#search-reset'),
			$checkall: $scope.$context.find('#checkall'),
			$gocheck: $scope.$context.find('#gocheck'),
			$searchBtn: $scope.$context.find('#search'),
			$dateStart: $scope.$context.find('#dateStart'),
			$dateEnd: $scope.$context.find('#dateEnd'),
			$minMoney: $scope.$context.find('#minMoney'),
			$maxMoney: $scope.$context.find('#maxMoney'),
			$searchInput: $scope.$context.find('#searchInput')
		};
		/*默认查询列表*/
		search(delNull(apiParams), function() {
			evt();
		});
		// 启用下拉功能
		$console.find('.select').dropdown();
		// 日期控件
		$console.find('.dateBtn').datepicker();
		$scope.$el.$dateStart.val(startDate);
		$scope.$el.$dateEnd.val(endDate);
	});

	// 省市区数据源
	var areaSel = {
		province: function(cb) {
			$.ajax({
				url: $http.api('area/get', 'zyj'),
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
				url: $http.api('area/get', 'zyj'),
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
				url: $http.api('area/get', 'zyj'),
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
					xhr.data.unshift({
						id: null,
						bankName: '全部'
					});
					var sourceData = {
						items: xhr.data,
						id: 'id',
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
			var sourceData = {
				items: [
					{value:null,text:"全部"},
					{value:0,text:"未结清"},
					{value:1,text:"已结清"}
				],
				id: 'value',
				name: 'text'
			};
			cb(sourceData);
		},/*逾期状态*/
		carTypeSel: function(t, p, cb) {
			var sourceData = {
				items: [
					{value:null,text:"全部"},
					{value:0,text:"新车"},
					{value:1,text:"二手车"}
				],
				id: 'value',
				name: 'text'
			};
			cb(sourceData);
		},/*车辆类型*/
		mortgageSel: function(t, p, cb) {
			var sourceData = {
				items: [
					{value:null,text:"全部"},
					{value:"1",text:"未办理"},
					{value:"2",text:"已办理"}
				],
				id: 'value',
				name: 'text'
			};
			cb(sourceData);
		},/*抵押状态*/
		recordSel: function(t, p, cb) {
			var sourceData = {
				items: [
					{value:null,text:"全部"},
					{value:"0",text:"手动"},
					{value:"1",text:"系统"}
				],
				id: 'value',
				name: 'text'
			};
			cb(sourceData);
		}/*主动核查标记*/
	};
	// 下拉回调
	$scope.bankPicker=function(val){
		apiParams.bankId=val.id;
	};
	$scope.areaPicker=function(val){
		apiParams.provinceId=val['省'].id;
		apiParams.cityId=val['市'].id;
		apiParams.areaId=val['区'].id;
	};
	$scope.statusPicker=function(val){
		apiParams.overDueStatus=val.id;
	};
	$scope.carTypePicker=function(val){
		apiParams.isSecond=val.id;
	};
	$scope.mortgagePicker=function(val){
		apiParams.status=val.id;
	};
	$scope.recordPicker=function(val){
		apiParams.methodWay=val.id;
	};
});