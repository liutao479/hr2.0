'use strict';
page.ctrl('openCardSheet', function($scope) {
	var $console = render.$console,
		$params = $scope.$params,
		apiParams = {
			process: $params.process || 0,
			page: $params.page || 1,
			pageSize: 20
		};
//	var urlStr1 = "http://192.168.0.134:8080";
	var urlStr = "http://127.0.0.1:8083";
	var urlStr1 = "http://127.0.0.1:8083";
	var apiMap = {
		"dealerName": urlStr+"/mock/sex",
		"dealerId": urlStr+"/mock/busiSourceName",
		"sex": urlStr+"/mock/sex",
		"hprovince": urlStr+"/mock/province",
		"hcity": urlStr+"/mock/city",
		"hcounty": urlStr+"/mock/country",
		"cprovince": urlStr+"/mock/province",
		"ccity": urlStr+"/mock/city",
		"ccounty": urlStr+"/mock/country",
		"isSecond": urlStr+"/mock/busiSourceName"
		}
	/**
	* 加载车贷办理数据
	* @params {object} params 请求参数
	* @params {function} cb 回调函数
	*/
	var loadLoanList = function(params, cb) {
		var data={};
			data['taskId']=80871;
		$.ajax({
			url: urlStr1+'/icbcCreditCardForm/queryICBCCreditCardForm',
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				console.log(result.data);
				render.compile($scope.$el.$tbl, $scope.def.listTmpl, result.data, true);
				console.log(result.data);
				if(cb && typeof cb == 'function') {
					cb();
				}
				loanFinishedInput();
				loanFinishedInputPic();
				loanFinishedSelect();
			})
		})
	}
//页面加载完成对所有带“*”的input进行必填绑定
	var loanFinishedInput = function(){
		$(".info-key").each(function(){
			var jqObj = $(this);
			if(jqObj.has('i').length > 0){
				$(this).siblings().find("input").addClass("required");
			}
			loanFinishedInputReq();
		});
	}
//页面加载完成对所有带“*”的input进行必填绑定,不需要必填的删除required
	var loanFinishedInputReq = function(){
		$("input[type='hidden'],input[type='text']").each(function(){
			var required = $(this).attr("name");
			if(!required){
				$(this).removeClass("required");
			}
		});
	}
//页面加载完成对图片上传框进行设置
	var loanFinishedInputPic = function(){
		var imgSrc = $("#creditCardImgUrl").val();
		if(!imgSrc){
			$("#preview").hide();
		}else{
			$("#preview").show();
			$("#preview").attr('src',urlStr+'/'+imgSrc);
		}
	}

//页面加载完成对所有下拉框进行赋值	
	var loanFinishedSelect = function(){
		$(".selecter").each(function(){
			var that =$("div",$(this));
			var key = $(this).data('key');
			var boxKey = key + 'Box';
			$(this).attr("id",boxKey);
			var data={};
                data['code'] = key;
			$.ajax({
				url: apiMap[key],
				data: data,
				dataType: 'json',
				async:false,
				success: $http.ok(function(result) {
					render.compile(that, $scope.def.selectOpttmpl, result.data, true);
//					$source.selectType = result.data;
					var selectOptBox = $(".selectOptBox");
					selectOptBox.attr("id",key);
				})
			})
			var value1 = $("input",$(this)).val();
			$("li",$(this)).each(function(){
				var val = $(this).val();
				var text = $(this).text();
				if(value1 == val){
					$(this).parent().parent().siblings(".placeholder").html(text);
					$(this).parent().parent().siblings("input").val(val);
					$(this).parent().parent().siblings(".placeholder").attr('title',val);
					var value2 = $(this).parent().parent().siblings("input").val();
					if(!value2){
						$(this).parent().parent().siblings(".placeholder").html("请选择")
					}
					$(".selectOptBox").hide(); 
				}
			})
			
		});
	}
//单位电话特殊处理
	$(document).on('change','#cophone', function() {
		var cophone = $(this).val();
		var cophone1 = cophone.substring(0,4),
			cophone2 = cophone.substring(cophone.length-8,cophone.length-4),
			cophone3 = cophone.substring(cophone.length-4,cophone.length);
		console.log('第一段：'+cophone1+'，第二段'+cophone2+'，第三段'+cophone3);
		$("#cophozono").val(cophone1);
		$("#cophoneno").val(cophone2);
		$("#cophonext").val(cophone3);
	})

//为完善项更改去掉错误提示
	$(document).on('input','input', function() {
		$(this).parents().removeClass("error-input");
		$(this).siblings("i").remove();
	})
	$(document).on('change','#creditCardImg', function() {
		$(this).parent().removeClass("error-input");
		$(this).next("i").remove();
		$("#preview").show();
		var $file = $(this);
		var fileObj = $file[0];
		var windowURL = window.URL || window.webkitURL;
		var dataURL;
		var $img = $("#preview");
		 
		if(fileObj && fileObj.files && fileObj.files[0]){
			dataURL = windowURL.createObjectURL(fileObj.files[0]);
			$img.attr('src',dataURL);
		}else{
			dataURL = $file.val();
			var imgObj = document.getElementById("preview");
			// 两个坑:
			// 1、在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
			// 2、src属性需要像下面的方式添加，上面的两种方式添加，无效；
			imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
			imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
		}
	})
	
//点击详细地址显示地址框
	$(document).on('click','.addInput', function() {
		$(this).siblings(".addressDetail").show();
	})
	$(document).on('click','.addressDetail > .info-value', function() {
		var divOP = $('.opcity0');
		if(divOP){
			console.log('chufaleshijiang');
			$(this).next().removeClass('pointDisabled');
		}
	})
    
	$(document).on('click','.addComplete', function() {
		var adKey = $(this).data('key');
		var valInput = $(this).siblings().find('input');
		valInput.each(function(){ 
			if(!$(this).val()){
				alert("请完善地址");
				return false;
			}else{
				if(adKey == 'had'){
					var provincetext = $('#shprovince').siblings('.placeholder').text();
					var citytext = $('#shcity').siblings('.placeholder').text();
					var countrytext = $('#shcounty').siblings('.placeholder').text();
					var addresstext = $('#shaddress').val();
					$('#hprovince1').val(provincetext);
					$('#hcity1').val(citytext);
					$('#hcounty1').val(countrytext);
					$('#haddress1').val(addresstext);
					console.log($('#hcounty1').val());
					var commentext = '';
					    commentext = $('#hprovince1').val()+$('#hcity1').val()+$('#hcounty1').val()+$('#haddress1').val();
				    $("#homeAdd").val(commentext);
				    $("#homeAdd").attr('title',commentext);
				}else{
					var provincetext = $('#scprovince').siblings('.placeholder').text();
					var citytext = $('#sccity').siblings('.placeholder').text();
					var countrytext = $('#sccounty').siblings('.placeholder').text();
					var addresstext = $('#scaddress').val();
					$('#cprovince1').val(provincetext);
					$('#ccity1').val(citytext);
					$('#ccounty1').val(countrytext);
					$('#caddress1').val(addresstext);
					console.log($('#ccounty1').val());
					var commentext = '';
					    commentext = $('#cprovince1').val()+$('#ccity1').val()+$('#ccounty1').val()+$('#caddress1').val();
				    $("#comeAdd").val(commentext);
				    $("#comeAdd").attr('title',commentext);
				}
			    $(this).parent().parent().parent(".addressDetail").hide();
			}
		})
//		$(this).parent(".addressDetail").hide();
	})
//模糊搜索
	$(document).on('input','.searchInp', function() {
		var that = $(this).parent().siblings(".selecter").find("div");
		var key = $(this).data('key');
		var boxKey = key + 'Box';
		$(this).attr("id",boxKey);
		var data={};
            data['code'] = key;
		$.ajax({
			url: apiMap[key],
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile(that, $scope.def.selectOpttmpl, result.data, true);
//				$source.selectType = result.data;
				var selectOptBox = $(".selectOptBox");
				selectOptBox.attr("id",key);
			})
		})
	})
//点击下拉框拉取选项	
	$(document).on('click','.selecter', function() {
		var that =$("div",$(this));
		var key = $(this).data('key');
		var boxKey = key + 'Box';
		$(this).attr("id",boxKey);
		var data={};
            data['code'] = key;
		$.ajax({
			url: apiMap[key],
			data: data,
			dataType: 'json',
			success: $http.ok(function(result) {
				render.compile(that, $scope.def.selectOpttmpl, result.data, true);
//				$source.selectType = result.data;
				var selectOptBox = $(".selectOptBox");
				selectOptBox.attr("id",key);
			})
		})
	})
	/***
	* 保存按钮
	*/
	$(document).on('click', '.saveBtn', function() {
		var email = $("#email").val();
		if(!email){
			$("#emladdrf").val(0);
		}else{
			$("#emladdrf").val(1);
		}
		var isTure = true;
		var requireList = $("#dataform").find(".required");
		requireList.each(function(){
			var value = $(this).val();
			if(!value){
				$(this).parent().addClass("error-input");
				$(this).after('<i class="error-input-tip">请完善该必填项</i>');
				console.log($(this).index());
				isTure = false;
//				return false;
			}
		});
		if(isTure){
	        var params = $("#dataform").serialize();
            params = decodeURIComponent(params,true);
            var paramArray = params.split("&");
            var data1 = {};
            for(var i=0;i<paramArray.length;i++){
                var valueStr = paramArray[i];
                data1[valueStr.split('=')[0]] = valueStr.split('=')[1];
            }
			console.log(data1);
	        
			$.ajax({
				type: 'POST',
				url: urlStr1+'/icbcCreditCardForm/saveICBCCreditCardForm',
				data:JSON.stringify(data1),
				dataType:"json",
				contentType : 'application/json;charset=utf-8',
				success: function(result){
					console.log(result.msg);
				}
			});
		}
	})
	
	/***
	* 加载页面模板
	*/
	render.$console.load(router.template('open-card-sheet'), function() {
		$scope.def.listTmpl = render.$console.find('#openCardSheettmpl').html();
		$scope.def.selectOpttmpl =  render.$console.find('#selectOpttmpl').html();
		$scope.$el = {
			$tbl: $console.find('#openCardSheet'),
		}
		if($params.process) {
			
		}
		loadLoanList(apiParams);
	});
});

