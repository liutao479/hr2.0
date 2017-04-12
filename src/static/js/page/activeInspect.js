'use strict';
page.ctrl('activeInspect', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		endDate = tool.formatDate(new Date().getTime()),
		startDate = tool.getPreMonth(endDate),
		pageBcData={},/*保存点击分页时的查询参数*/
		apiParams = {
			pageNum: $params.pageNum || 1,
			minSelectDate:new Date(startDate),
			maxSelectDate:new Date(endDate),
			status:null,/*状态*/
			orgId:null,/*担保机构*/
			keyWord:null,
			bankName:null,/*经办网点*/
			isSecond:null,/*车辆类型*/
			stageMinMoney:null,
			stageMaxMoney:null,
			overDueStatus:null,/*逾期状态*/
			methodWay:null/*主动核查标记*/
		};
	/*查询前去除空查询字段*/
	var delNull=function(obj){
		for(var i in obj){
			if(obj[i]==null||(obj[i]==""&&obj[i]!==0)||obj[i]==undefined)
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
		apiParams = {
			pageNum: $params.pageNum || 1,
			minSelectDate:new Date(startDate),
			maxSelectDate:new Date(endDate),
			status:null,/*状态*/
			orgId:null,/*担保机构*/
			keyWord:null,
			bankName:null,/*经办网点*/
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
		apiParams.taskId=pageBcData.taskId;
		apiParams.keyWord=$.trim($scope.$el.$searchInput.val());
		return apiParams;
	};
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'get',
			dataType:"json",
			url: $http.api('bankLoanAfter/getList',true),
			data: param,
			success: $http.ok(function(result) {
				pageBcData=param;
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
	};
	/*发起核查弹窗*/
	var openDialog=function(that,_data){
		that.openWindow({
			title:"请选择查询类型",
			content: dialogTml.wContent.btngroup,
			commit: dialogTml.wCommit.cancelSure,
			data:_data
		},function($dialog){
			var _arr=[];
			$dialog.find(".block-item-data:not(.not-selected)").click(function() {
				$(this).toggleClass("selected");	
				_arr.push($(this).text());			
			});
			$dialog.find(".w-sure").click(function() {
				$dialog.remove();
				console.log("选择了："+_arr);
				$.ajax({
					type: "post",
					url: $http.api('creditAudit/startVerify'),
					data:{
						apiKeys:"",
						orderNo:"",
						userId:""
					},
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
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$console.off("click",".gocheck").on("click",".gocheck", function() {
			var that=$(this);
			var _id=that.data("id");
			$.ajax({
				type: 'post',
				dataType:'json',
				url: $http.api('creditAudit/itemList'),
				data: {userId:_id},
				success: $http.ok(function(res) {
					if(res&&res.data&&res.data.length>0)
						openDialog(that,res.data);
					else
						openDialog(that,[]);
				})
			});
		});
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/active-inspect'), function() {
		$scope.def.listTmpl = render.$console.find('#activeInspectTmpl').html();
		$scope.def.toastTmpl = render.$console.find('#importResultTmpl').html();
		$scope.$context=$console.find('#active-inspect')
		$scope.$el = {
			$tbl: $scope.$context.find('#tableContext'),
			$paging: $scope.$context.find('#pageToolbar'),
			$resetBtn: $scope.$context.find('#search-reset'),
			$searchBtn: $scope.$context.find('#search'),
			$dateStart: $scope.$context.find('#dateStart'),
			$dateEnd: $scope.$context.find('#dateEnd'),
			$searchInput: $scope.$context.find('#searchInput')
		};
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
			var sourceData = {
				items: [
					{value:0,text:"未结清"},
					{value:1,text:"已结清"}
				],
				id: 'value',
				name: 'text'
			};
			cb(sourceData);
		},/*逾期状态*/
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
		},/*进件车商*/
		carTypeSel: function(t, p, cb) {
			var sourceData = {
				items: [
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
					{value:1,text:"未办理"},
					{value:2text:"已办理"}
				],
				id: 'value',
				name: 'text'
			};
			cb(sourceData);
		},/*抵押状态*/
		recordSel: function(t, p, cb) {
			cb({
				items:[
					{value:"0",text:"手动"}，
					{value:"1",text:"系统"}
				],
				id: 'value',
				name:'text'
			});
		}/*主动核查标记*/
	};
	// 下拉回调
	$scope.bankPicker=function(val){
		apiParams.bankName=val.name;
	};
	$scope.areaPicker=function(val){
		console.log(val)
	};
	$scope.statusPicker=function(val){
		apiParams.overDueStatus=val.id;
	};
	$scope.dealerPicker=function(val){
		apiParams.orgId=val.id;
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



