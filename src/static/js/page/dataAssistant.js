'use strict';
page.ctrl('dataAssistant', function($scope) {
	var $params = $scope.$params,
		$console = $params.refer ? $($params.refer) : render.$console,
		apiParams = {
			orderNo: $params.orderNo,
			//orderNo: 'nfdb2016102820480790',
			//orderNo: "vxnfdb20170412105846795",
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
		];
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
				var _platLend=_mout.body[1018];
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
				if(_platLend&&_platLend.length>0){
					for(var k in _platLend){
						var platJson=_platLend[k].multipleJSON;
						if(platJson&&platJson['seven_day'])
							repeatPlat(platJson,'seven_day');
						if(platJson&&platJson['one_month'])
							repeatPlat(platJson,'one_month');
						if(platJson&&platJson['three_month'])
							repeatPlat(platJson,'three_month');
						if(platJson&&platJson['six_month'])
							repeatPlat(platJson,'six_month');
						if(platJson&&platJson['twelve_month'])
							repeatPlat(platJson,'twelve_month');
					};
					_mout.body[1018]=_platArr;
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
	/*发起核查*/
	var openUserDialog=function(that,_data,key){
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
						serviceType:'2',/*1材料验真，2数据辅证，必传*/
						userIds:_arr.join("_")
					},
					success: $http.ok(function(res) {
						var jc=$.dialog($scope.def.toastTmpl,function($dialog){
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
	};
	var openDialog=function(that,_data){
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
		that.openWindow({
			title:"———— 服务项目 ————",
			isContext:true,
			content: dialogTml.wContent.serviceItems,				
			data:_data//0：未核查，1:未查询，缺少相关数据,2: 查询中,3：已核查
		},function($dialog){
			$dialog.find(".nextDialog").click(function() {
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
			});
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
			var that=$(this);
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
		$scope.def.toastTmpl = $console.find('#importResultTmpl').html();
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