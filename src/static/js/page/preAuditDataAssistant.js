'use strict';
page.ctrl('preAuditDataAssistant', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		userType=[
			{userType:0,text:"主申请人"},
			{userType:1,text:"共同还款人"},
			{userType:2,text:"反担保人"}
		],
		apiParams = {
			orderNo: $params.orderNo,
			userId: $params.userId,	
			/*orderNo: 'nfdb2016102820480790',
			userId: '334232',*/
			sceneCode: $params.sceneCode		
		};
	/**
	* 设置面包屑
	*/
/*	var setupLocation = function() {
		if(!$scope.$params.path) return false;
		var $location = $scope.$context.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			secondLevelHref:"",
			secondLevelName:"",
		});
		$location.location();
	};*/
	// 查询列表数据
	var search=function(param,callback){
		$.ajax({
			type: 'post',
			dataType:"json",
			url: $http.api('verifyResult/resultDetail',true),
			data: param,
			success: $http.ok(function(res) {
				var _mout=res.data.data;
				var _platLend=_mout.body[1016];//同盾网贷信息核查
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
				if(res.data.loanUser&&res.data.loanUser.userName){
					_mout.body.userName=res.data.loanUser.userName;
					var _minObj=userType.filter(it=>it.userType==res.data.loanUser.userType);
					if(_minObj&&_minObj.length==1){
						_mout.body.userTypeName=_minObj[0].text;
					};
				};
				/*网贷平台借贷数据统计end*/
				/*模板绑定数据*/
				render.compile($scope.$el.$listDiv, $scope.def.listTmpl, _mout.body, true);
				/*回调*/
				if(callback && typeof callback == 'function') {
					callback();
				};
			})
		});
	};
	// 页面首次载入时绑定事件
 	var evt = function() {
		$scope.$el.$backspace.off("click","a").on("click","a",function() {
			var _href=$(this).data('href');
			var _param=$(this).data('param');
			var _cparam={};
			if(_param){
				if(typeof _param=='string')
					_cparam=JSON.parse(_param);
				else
					_cparam=_param;
			}
			if(_href){
				router.render(_href,_cparam);
			};
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
	render.$console.load(router.template('iframe/pre-audit-dataAssistant'), function() {
		$scope.def.crumbsTmpl = render.$console.find('#crumbsTmpl').html();
		$scope.def.listTmpl = render.$console.find('#preAuditDataAssistantTmpl').html();
		$scope.$context=$console.find('#pre-audit-dataAssistant');
		$scope.$el = {
			$backspace: $scope.$context.find('#backspace'),
			$listDiv: $scope.$context.find('#listDiv'),
		};
		if($params.backJson)
			render.compile($scope.$el.$backspace, $scope.def.crumbsTmpl, $params.backJson, true);
		search(apiParams, function() {
			evt();
			//setupLocation();
		});
	});
});



