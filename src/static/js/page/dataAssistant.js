'use strict';
page.ctrl('dataAssistant', function($scope) {
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
			url: $http.api('materialInspection'),
			data: param,
			success: $http.ok(function(result) {
				render.compile($scope.$el.$tab, $scope.def.tabTmpl, result.data, true);
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	/*发起核查*/
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
				//search();
			};
		});
		$scope.$el.$startCheck.click(function() {
			var that=$(this);
			$.ajax({
				type: 'post',
				dataType:'json',
				url: $http.api('loanAudit/evidenceItemList','cyj'),
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
		for(var i=0;i<circleCanvas.length;i++){
			fill(circleCanvas[i]);
		};
		/*画百分比相关end*/
 	};
 	
	// 加载页面模板
	render.$console.load(router.template('iframe/data-assistant'), function() {
		$scope.def.tabTmpl = render.$console.find('#roleBarTabTmpl').html();
		$scope.$context=$console.find('#data-assistant');
		$scope.$el = {
			$tab: $scope.$context.find('#roleBarTab'),
			$startCheck: $scope.$context.find('#startCheck'),
		};
		search(apiParams, function() {
			evt();
		});
	});
});



