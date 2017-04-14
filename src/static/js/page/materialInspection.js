'use strict';
page.ctrl('materialInspection', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			//orderNo: $params.orderNo,
			orderNo: 'nfdb2016102820480790',
			sceneCode:'creditApproval'
		},userType=[
			{userType:0,text:"主申请人"},
			{userType:1,text:"共同还款人"},
			{userType:2,text:"反担保人"}
		];
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('verifyResult/resultDetail',true),
			data: param,
			success: $http.ok(function(res) {
				render.compile($scope.$el.$listDiv, $scope.def.listTmpl, res.data.data, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	/*查询该订单下用户列表*/
	var searchUserList=function(param){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('loanAudit/userList',true),
			data: param,
			success: $http.ok(function(res) {
				if(res&&res.data&&res.data.length>0){
					for(var i in res.data){
						var _minObj=userType.filter(it=>it.userType==res.data[i].userType);
						if(_minObj&&_minObj.length==1){
							res.data[i].userTypeName=_minObj[0].text;
						};
					};
					render.compile($scope.$el.$tab, $scope.def.tabTmpl, res.data, true);
					//apiParams.userId=res.data[0].userId;
					apiParams.userId='334232';
					search(apiParams, function() {
						evt();
					});
				};
			})
		});
	};
	/*发起核查*/
	var openDialog=function(that,_data){
		var _loalList=[
			{text:"购车",isBank:true,class:"bacf09054",icon:"&#xe676;"},
			{text:"购房",isBank:true,class:"bac73c7df",icon:"&#xe6bb;"},
			{text:"银行",isBank:true,class:"bacAgain",icon:"&#xe673;"},
			{text:"房产证",isBank:true,class:"bac59cfb7",icon:"&#xe679;"},
			{text:"合格证",isBank:false,class:"bac82b953",icon:"&#xe672;"},
			{text:"保单",isBank:false,class:"bac84bef0",icon:"&#xe642;"},
			{text:"车辆",isBank:false,class:"bacf5bf5b",icon:"&#xe6cc;"},
		];
		for(var i in _data){
			for(var j=0;j<_loalList.length;j++){
				if(_data[i].funcName.indexOf(_loalList[j].text)!=-1){
					_data[i].isBank=_loalList[j].isBank;
					_data[i].class=_loalList[j].class;
					_data[i].icon=_loalList[j].icon;
					break;
				};
				if(j==_loalList.length-1){
					_data[i].isBank=false;
					_data[i].class="bac73c7df";
					_data[i].icon="&#xe6bb;";					
				};
			};
		};
		that.openWindow({
			title:"———— 服务项目 ————",
			width:"70%",
			content: dialogTml.wContent.serviceItems,				
			data:_data//0：未核查，1:未查询，缺少相关数据,2: 查询中,3：已核查
		},function($dialog){
			$dialog.find(".nextDialog").click(function() {
				$dialog.remove();
				var userData=[
					{checkStatus:0,funcName:"王可可"},
					{checkStatus:1,funcName:"李冰冰"},
					{checkStatus:2,funcName:"弘毅"},
				];
				that.openWindow({
					title:"———— 服务项目 ————",
					width:"70%",
					content: dialogTml.wContent.btngroup,	
					commit: dialogTml.wCommit.cancelSure,			
					data:userData
				},function($dia){
					var _arr=[];
					$dia.find(".block-item-data:not(.not-selected)").click(function() {
						$(this).toggleClass("selected");	
						var _index=$(this).data("index");
						var _thisVal=userData[_index].funcName;
						if($(this).hasClass("selected"))
							_arr.push(_thisVal);	
						else
							_arr.splice(_thisVal,1);
					});
					$dia.find(".w-sure").click(function() {
						$dia.remove();
						if(_arr.length==0)
							return false;
						$.ajax({
							type: 'post',
							dataType:"json",
							url: $http.api('creditAudit/startVerify'),
							data: {
								apiKeys:"",
								orderNo:apiParams.orderNo,
								userIds:_arr.join("_")
							},
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
			});
		});		
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$scope.$el.$tab.off("click","li.role-bar-li").on("click","li.role-bar-li",function() {
			if($(this).siblings("li").length>0){
				$(this).siblings("li").find("a").removeClass("role-item-active");
				$(this).find("a").addClass("role-item-active");
				search();
			};
		});
		/*获取核查列表*/
		$scope.$el.$startCheck.click(function(){
			var that=$(this);
			$.ajax({
				type: 'post',
				dataType:'json',
				url: $http.api('loanAudit/verifyItemList','cyj'),
				data: {
					userId:"334232",
					orderNo:'nfdb2016102820480790'
					//orderNo:apiParams.orderNo
				},
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
	render.$console.load(router.template('iframe/material-inspection'), function() {
		$scope.def.tabTmpl = render.$console.find('#roleBarTabTmpl').html();
		$scope.def.listTmpl = render.$console.find('#materialInspectionTmpl').html();
		$scope.def.toastTmpl = render.$console.find('#importResultTmpl').html();
		$scope.$el = {
			$tab: $console.find('#roleBarTab'),
			$listDiv: $console.find('#listDiv'),
			$startCheck: $console.find('#startCheck'),
		};
		searchUserList({
			orderNo:apiParams.orderNo,
		});
	});
});