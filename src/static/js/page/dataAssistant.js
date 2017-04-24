'use strict';
page.ctrl('dataAssistant', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			orderNo: $params.orderNo,
			//orderNo: 'nfdb2016102820480790',
			sceneCode:'loanApproval'
		},
		userType=[
			{userType:0,text:"主申请人"},
			{userType:1,text:"共同还款人"},
			{userType:2,text:"反担保人"}
		],
		operator=[
			{type:1,text:"中国电信"},
			{type:2,text:"中国移动"},
			{type:3,text:"中国联通"}
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
				var _mobil=_mout.body[1021];
				var _usedCar=_mout.body[1025];
				var _platLend=_mout.body[1016];//同盾网贷信息核查
				/*在网列表的运营商数据处理*/
				if(_mobil){
					for(var i in _mobil){
						var _thisOperator=operator.filter(it=>it.type==_mobil[i].OPERATOR);
						if(_thisOperator&&_thisOperator.length==1)
							_mout.body[1021][i].operatorName=_thisOperator[0].text;
					};
				};
				/*网贷平台借贷数据统计start*/
				var _platArr=[];
				var repeatPlat=function(platJson,attr){
					for(var u in platJson[attr]){/*循环某个月下面的借贷对象*/
						if(_platArr.length==0){
							_platArr.push({name:u,seven_day:0,one_month:0,three_month:0,six_month:0,twelve_month:0});
							_platArr[_platArr.length-1][attr]=Number(platJson[attr][u]);			
						}else{
							for(var r=0;r<_platArr.length;r++){
								if(_platArr[r].name==u){
									_platArr[r][attr]+=Number(platJson[attr][u]);
									break;
								};
								if(r==_platArr.length-1){
									_platArr.push({name:u,seven_day:0,one_month:0,three_month:0,six_month:0,twelve_month:0});
									_platArr[_platArr.length-1][attr]=Number(platJson[attr][u]);
									break;
								};
							};
						};
					};
				};
				/*借贷记录数据整理*/
				if(_platLend&&_platLend.length>0){
					for(var c=0;c<_platLend.length;c++){
						_platArr=[];
						if(_platLend[c]&&_platLend[c].credit&&_platLend[c].credit.multipleJSON){
							var platObj=_platLend[c].credit.multipleJSON;
							if(platObj['seven_day'])
								repeatPlat(platObj,'seven_day');
							if(platObj['one_month'])
								repeatPlat(platObj,'one_month');
							if(platObj['three_month'])
								repeatPlat(platObj,'three_month');
							if(platObj['six_month'])
								repeatPlat(platObj,'six_month');
							if(platObj['twelve_month'])
								repeatPlat(platObj,'twelve_month');
						};	
						_mout.body[1016][c].plat=_platArr;					
					};
				};
				/*整理title中发起人，最新发起时间等信息*/
				if(_mout.verifyRecord&&_mout.verifyRecord.submitByName)
					_mout.body.submitByName=_mout.verifyRecord.submitByName;
				if(_mout.verifyRecord&&_mout.verifyRecord.updateTime)
					_mout.body.updateTime=_mout.verifyRecord.updateTime;
				if(_mout.itemNum)
					_mout.body.itemNum=_mout.itemNum;
				if(_mout.verifyingNum)
					_mout.body.verifyingNum=_mout.verifyingNum;
				/*网贷平台借贷数据统计end*/
				/*模板绑定数据*/
				render.compile($scope.$el.$listDiv, $scope.def.listTmpl, _mout.body, true);
				/*如果有二手车模块则使用画布画百分比*/
				if(_usedCar)
					setCanvas();
				/*回调*/
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	/*查询该订单下用户列表*/
	var searchUserList=function(param){
		$.ajax({
			type: 'get',
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
					apiParams.serviceType='2';/*1材料验真，2数据辅证，必传*/
					apiParams.userId=res.data[0].userId;
					//apiParams.userId='334232';
					search(apiParams, function() {
						evt();
					});
				};
			})
		});
	};
	var openDialog=function(_data){
		var _loalList=[
			{text:"实名",isBank:true,class:"bac6b78fa",icon:"&#xe677;"},
			{text:"人脸",isBank:true,class:"bacc8a5df",icon:"&#xe67c;"},
			{text:"公安",isBank:true,class:"bac6b78fa",icon:"&#xe661;"},
			{text:"法院",isBank:false,class:"bacc8a5df",icon:"&#xe6a5;"},
			{text:"网贷平台",isBank:false,class:"bacf09054",icon:"&#xe666;"},
			{text:"网贷逾期",isBank:false,class:"bac73c7df",icon:"&#xe671;"},
			{text:"学历",isBank:false,class:"bac59cfb7",icon:"&#xe679;"},
			{text:"手机在网",isBank:false,class:"bacAgain",icon:"&#xe66e;"},
			{text:"二手车",isBank:false,class:"bac73c7df",icon:"&#xe64f;"},
			{text:"车辆登记",isBank:false,class:"bac82b953",icon:"&#xe642;"},
			{text:"车辆保养",isBank:false,class:"bacf5bf5b",icon:"&#xe674;"},
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
					_data[i].class="bac6b78fa";
					_data[i].icon="&#xe666;";					
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
										var _el=dialogTml.wContent.realTimeMsg;//及时提示
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
	var setCanvas=function(){
		/*画百分比相关start*/
		var percentage=function(x){
			var c=document.getElementById(x.id);
			var ctx=c.getContext("2d");
			ctx.canvas.width=x.width;
			ctx.canvas.height=x.width;
			/*画背景*/
			ctx.beginPath();
			ctx.lineWidth=x.lineWidth;
			ctx.strokeStyle=x.color[0];
			ctx.arc(x.width/2,x.width/2,x.width/2-x.lineWidth,0,2*Math.PI);
			ctx.stroke();
			/*画百分比*/
			ctx.beginPath();
	        ctx.lineWidth = x.lineWidth;
	        ctx.strokeStyle = x.color[1];
	        ctx.arc(x.width/2,x.width/2,x.width/2-x.lineWidth,-90*Math.PI/180,(x.startPerent*3.6-90)*Math.PI/180);
	        ctx.stroke();
	        ctx.font = 'Arial';
	        ctx.textBaseline = "middle";
	        ctx.textAlign = 'center';
	        ctx.fillText(x.startPerent + '%', x.width / 2, x.width / 2);
	        return ctx;
		};
		var circleCanvas=[
			{
				id:"smCanvas",
				width:50,
				lineWidth:7,
				color:["#ddd","#60c4f5"],
				startPerent:0,
				endPerent:15,
				obj:null
			},
			{
				id:"mdCanvas",
				width:75,
				lineWidth:11,
				color:["#ddd","#ff5c57"],
				startPerent:0,
				endPerent:50,
				obj:null
			},
			{
				id:"lgCanvas",
				width:50,
				lineWidth:8,
				color:["#ddd","#5084fc"],
				startPerent:0,
				endPerent:45,
				obj:null
			}
		];
		var _fill=function(it){
			return function(){
				fill(it);
			};
		};
		var fill=function(it){
			if(++it.startPerent<=it.endPerent){
				if(it.obj)
					it.obj.clearRect(0, 0, it.width, it.width);
				it.obj=percentage(it);//canver画百分比
				setTimeout(_fill(it),10);
			};
		};
		var canlen=$scope.$el.$listDiv.find("canvas").length;
		for(var i=0;i<canlen;i++){
			var _thisId=$($scope.$el.$listDiv.find("canvas")[i]).attr('id');
			var _rate=$($scope.$el.$listDiv.find("canvas")[i]).data('rate');
			var _mod=i%3;
			circleCanvas[_mod].id=_thisId;
			circleCanvas[_mod].endPerent=_rate;
			fill(circleCanvas[_mod]);
		};
		/*画百分比相关end*/
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
		$scope.$el.$listDiv.off("click","#startCheck").on("click","#startCheck",function() {
			$.ajax({
				type: 'post',
				dataType:'json',
				url: $http.api('loanAudit/evidenceItemList','cyj'),
				data: {
					userId:apiParams.userId,
					orderNo:apiParams.orderNo
				},
				success: $http.ok(function(res) {
					if(res&&res.data&&res.data.length>0)
						openDialog(res.data);
					else
						$.alert({
							title: '提示',
							content: tool.alert("您尚未开通该核查权限！"),
							buttons:{
								ok: {
									text: '确定',
								}
							}
						});
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
	$console.load(router.template('iframe/data-assistant'), function() {
		$scope.def.tabTmpl = $console.find('#roleBarTabTmpl').html();
		$scope.def.listTmpl = $console.find('#listTmpl').html();
		$scope.$context=$console.find('#data-assistant');
		$scope.$el = {
			$tab: $scope.$context.find('#roleBarTab'),
			$listDiv: $scope.$context.find('#listDiv'),
		};
		if(apiParams.orderNo)
			searchUserList({
				orderNo:apiParams.orderNo,
			});
	});
});