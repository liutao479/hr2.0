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
	/*发起核查*/
	var openDialog=function(_data){
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
		var dialogHtml = doT.template(dialogTml.wContent.serviceItems)(_data);
		$.dialog({
			title: '———— 服务项目 ————',
			boxWidth:"70%",
			offsetBottom: "50px",
			content:dialogHtml,
			onContentReady:function(){
				var _title="提示";
				var _srvDialog=this;
				_srvDialog.$content.find(".nextDialog").confirm({
					title:_title,
					content:"<p class='blank'>请确认是否发起本次核查？</p>",
					onOpenBefore:function(){
						_title=_data[this.$target.data('index')].funcName;
						this.setTitle(_title);
					},
				    buttons: {
				        close: {
				        	text:"取消",
				        	action:function(){}
				        },
				        ok: {
				        	text:"确定",
				        	action:function(){
				        		var _conDialog=this;
								var _key=_data[_conDialog.$target.data('index')].key;
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
										_conDialog.close();
										_srvDialog.close();
										var _oneObj=toastArr.filter(it=>it==_key);
										var _el=dialogTml.wContent.realTimeMsg//及时提示
										if(_oneObj&&_oneObj.length==1)
											_el=dialogTml.wContent.nonRealTimeMsg;//非及时提示
										var _tipHtml = doT.template(_el)();
										$.dialog({
											title:false,
											content:_tipHtml,
											onContentReady:function(){
												var _tioDialog=this;
												setTimeout(function() {
													_tioDialog.close();
													search(apiParams);
												},1500);
											}
										});
									})
								});
					        }
				        }
				    }
				});
			}
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
						openDialog(res.data);
					else
						openDialog([]);
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
		$scope.$el = {
			$tab: $console.find('#roleBarTab'),
			$listDiv: $console.find('#listDiv')
		};
		searchUserList({
			orderNo:apiParams.orderNo,
		});
	});
});