'use strict';
page.ctrl('materialInspection', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			orderNo: $params.orderNo,
			//orderNo: 'nfdb2016102820480790',
			sceneCode:'loanApproval'
		},userType=[
			{userType:0,text:"主申请人"},
			{userType:1,text:"共同还款人"},
			{userType:2,text:"反担保人"}
		],
		toastArr=["bankWater","carBuy","houseInfo","submitCarInvoice","submitCertificate",
		"submitHouseInvoice","submitInsurancePolicy","submitRegister",
		"userCarInfoBuy"];/*非及时，除此之外都是及时的*/
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('verifyResult/resultDetail',true),
			data: param,
			success: $http.ok(function(res) {
				var _mout={body:[]};
				if(res.data&&res.data.data&&res.data.data.body)
					_mout=res.data.data;
				/*整理title中发起人，最新发起时间等信息*/
				if(_mout.verifyRecord&&_mout.verifyRecord.submitByName)
					_mout.submitByName=_mout.verifyRecord.submitByName;
				if(_mout.verifyRecord&&_mout.verifyRecord.updateTime)
					_mout.updateTime=_mout.verifyRecord.updateTime;
				if(_mout.itemNum)
					_mout.itemNum=_mout.itemNum;
				if(_mout.verifyingNum)
					_mout.verifyingNum=_mout.verifyingNum;
				render.compile($scope.$el.$listDiv, $scope.def.listTmpl, _mout, true);
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
					apiParams.serviceType='1';/*1材料验真，2数据辅证，必传*/
					apiParams.userId=res.data[0].userId;
					//apiParams.userId='334232';
					search(apiParams, function() {
						evt();
					});
				};
			})
		});
	};
	/*var openUserDialog=function(that,_data,key){		
		for(var z in _data){
			var _minObj=userType.filter(it=>it.userType==_data[z].userType);
			if(_minObj&&_minObj.length==1){
				_data[z].userTypeName=_minObj[0].text;
			};
		};
		that.openWindow({
			title:"———— 服务项目 ————",
			isContext:true,
			content: dialogTml.wContent.userBtnGroup,	
			commit: dialogTml.wCommit.cancelSure,			
			data:_data
		},function($dia){
			var _arr=[];
			$dia.find(".block-item-data:not(.not-selected)").click(function() {
				$(this).toggleClass("selected");	
				var _index=$(this).data("index");
				var _thisVal=_data[_index].userId;
				if($(this).hasClass("selected"))
					_arr.push(_thisVal);	
				else
					_arr.splice(_arr.indexOf(_thisVal),1);
			});
			$dia.find(".w-sure").click(function() {
				$dia.remove();
				if(_arr.length==0)
					return false;
				$.ajax({
					type: 'post',
					dataType:"json",
					url: $http.api('loanAudit/verifyCheck',true),
					data: {
						key:key,
						orderNo:apiParams.orderNo,
						serviceType:'1',
						userIds:_arr.join("_")
					},
					success: $http.ok(function(res) {
						var _oneObj=toastArr.filter(it=>it==key);
						var _el=$scope.def.toastTmpl;//及时提示
						if(_oneObj&&_oneObj.length==1)
							_el=$scope.def.toastTmpl2;//非及时提示
						var jc=$.dialog(_el,function($dialog){
							var context=$(".jconfirm .jconfirm-content").html();
							if(context){
								setTimeout(function() {
									jc.close();
									search(apiParams);
								},1500);
							};
						});
					})
				});
			});
		});	
	};*/
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
			isContext:true,
			content: dialogTml.wContent.serviceItems,				
			data:_data//0：未核查，1:未查询，缺少相关数据,2: 查询中,3：已核查
		},function($dialog){
			$dialog.find(".nextDialog").confirm({
				title:"提示",
				content:"<p class='blank'>确定要核查该项目吗？</p>",
			    buttons: {
			        close: {
			        	text:"取消",
						//btnClass: 'button-empty w-close',
			        	action:function(){}
			        },
			        ok: {
			        	text:"确定",
			        	//btnClass:'button-mini w-sure',
			        	action:function(){
							var _key=_data[this.$target.data('index')].key;
							$.ajax({
								type: 'post',
								dataType:"json",
								url: $http.api('loanAudit/verifyCheck',true),
								data: {
									key:_key,
									orderNo:apiParams.orderNo,
									serviceType:'2',/*1材料验真，2数据辅证，必传*/
									userIds:apiParams.userId
								},
								success: $http.ok(function(res) {
									$dialog.remove();
									var _oneObj=toastArr.filter(it=>it==_key);
									var _el=$scope.def.toastTmpl;//及时提示
									if(_oneObj&&_oneObj.length==1)
										_el=$scope.def.toastTmpl2;//非及时提示
									var jc=$.dialog(_el,function($dialog){
										var context=$(".jconfirm .jconfirm-content").html();
										if(context){
											setTimeout(function() {
												jc.close();
												search(apiParams);
											},1500);
										};
									});
								})
							});
				        }
			        }
			    }
			});
			/*$dialog.find(".nextDialog").click(function() {
				$dialog.remove();
				var _key=_data[$(this).data('index')].key;
				$.ajax({
					type: 'post',
					dataType:'json',
					url: $http.api('loanAudit/checkUserList','cyj'),
					data: {
						orderNo:apiParams.orderNo,
						key:_key
					},
					success: $http.ok(function(res) {
						if(res&&res.data&&res.data.length>0)
							openUserDialog(that,res.data,_key);
						else
							openUserDialog(that,[],_key);
					})
				});	
			});*/
		});		
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$scope.$el.$tab.off("click","a.role-item:not(.role-item-active)").on("click","a.role-item:not(.role-item-active)",function() {
			$(this).parent("li").siblings("li").find("a").removeClass("role-item-active");
			$(this).addClass("role-item-active");
			var _id=$(this).parent('li').data('id');
			if(_id){
				apiParams.userId=_id;
				search(apiParams);
			};
		});
		/*获取核查列表*/
		$scope.$el.$listDiv.off("click","#startCheck").on("click","#startCheck",function() {
			var that=$(this);
			$.ajax({
				type: 'post',
				dataType:'json',
				url: $http.api('loanAudit/verifyItemList','cyj'),
				data: {
					userId:apiParams.userId,
					orderNo:apiParams.orderNo
				},
				success: $http.ok(function(res) {
					if(res&&res.data&&res.data.length>0)
						openDialog(that,res.data);
					else
						openDialog(that,[]);
				})
			});
		});
		$scope.$el.$listDiv.off("click",".no-img").on("click",".no-img",function() {
			var _parent=$(this).parents('.no-img-group');
			var _imgs=[],
				_idx=$(this).parent(".no-img-list").index();
			_parent.find('.no-img-list').each(function(){
				var _src=$(this).find("img").attr('src');
				if(_src)
					_imgs.push({materialsPic:_src});
			});
			$.preview(_imgs, function(img, mark, cb) {
				cb();	
			}, {
				markable: false,
				idx: _idx
			});
		});
 	};
 	
	// 加载页面模板
	$console.load(router.template('iframe/material-inspection'), function() {
		$scope.def.tabTmpl = $console.find('#roleBarTabTmpl').html();
		$scope.def.listTmpl = $console.find('#materialInspectionTmpl').html();
		$scope.def.toastTmpl = $console.find('#importResultTmpl').html();
		$scope.def.toastTmpl2 = $console.find('#importResultTmpl2').html();
		$scope.$el = {
			$tab: $console.find('#roleBarTab'),
			$listDiv: $console.find('#listDiv')
		};
		searchUserList({
			orderNo:apiParams.orderNo,
		});
	});
});