'use strict';
(function(_) {
	/**
	* 添加string.format方法
	*/
	if(!String.prototype.format) {
		String.prototype.format = function(){
			var args = arguments;
			return this.replace(/\{(\d+)\}/g,                
		    function(match, number){
		        return typeof args[number] != 'undefined' ? args[number] : match;
		    });
		};
	}
	/**
	* 添加string.trim方法
	*/
	if(!String.prototype.trim) {
		String.prototype.trim = function(){
			return this.replace(/(^\s*)|(\s*$)/g, '');
		};
	}
	/*
	* 本地验证规则
	*/
	var regulation = {
		number: /^[1-9]{1,}$/,
		phone: /^1[\d+]{10}$/,
		idc: /^[\d+]{14|17}[\d+|Xx]{1}$/i
	};
	_.regulation = regulation;

	/*****************************************
	* 全局http请求配置
	*/
	_.$http = {};
	_.$http.api = function(method, name) {
		// name不传值，代表取mock中假数据
		if(!name) 
			//return 'http://192.168.1.92:8083/mock/' + method;
			return 'http://192.168.1.90:8083/mock/' + method;
		else
			// return 'http://192.168.1.86:8089/' + method;
			return 'http://192.168.0.186:9999/' + method;
			// return 'http://192.168.1.194:8686/' + method;//cyj
			// return 'http://192.168.1.55:8080/' + method;
			// return 'http://192.168.1.124:8080/' + method;
			// return 'http://192.168.1.132:8080/' + method;
			// return 'http://192.168.0.22:8080/' + method;
			
		//Todo 发布时增加prefix
		// return 'http://192.168.0.113:8080/' + method;
	}
	_.$http.authorization = function(key) {
		$.ajaxSetup({
			headers: {'Authorization': "Bearer " + key }
		})
	}
	/**
	* 全局ajax success拦截器
	* @params {function} cb
	*/
	_.$http.ok = function(cb) {
		return function(response) {
			if(response && !response.code) {
				cb(response);
			} else {
				//统一的失败处理
				var code = response.code;
				switch (code) {
					case 1000:
						$.alert({
							title: '提示',
							content: tool.alert('合同模板不存在！'),
							buttons:{
								ok: {
									text: '确定',
									action: function() {
										// location.href = 'login.html';
										// alert(1)
									}
								}
							}
						})
						return false;
						break;
					case 1001:
						$.alert({
							title: '提示',
							content: tool.alert('非法的参数！'),
							buttons:{
								ok: {
									text: '确定',
									action: function() {
										// location.href = 'login.html';
										// alert(1)
									}
								}
							}
						})
						break;
					case 1003:
						unAuth();
						break;
					case 1004:
						unAuth();
						break;
					case -1:
						$.alert({
							title: '提示',
							content: tool.alert('系统异常！'),
							buttons:{
								ok: {
									text: '确定',
									action: function() {
									}
								}
							}
						})
						break;
					case 6001:
						$.alert({
							title: '提示',
							content: tool.alert(response.msg),
							buttons:{
								ok: {
									text: '确定'
								}
							}
						})
						break;
					case 6011:
						$.alert({
							title: '提示',
							content: tool.alert('账户已存在'),
							buttons:{
								ok: {
									text: '确定'
								}
							}
						})
						break;
					case -2:
						$.alert({
							title: '提示',
							content: tool.alert(response.data.msg),
							buttons:{
								ok: {
									text: '确定'
								}
							}
						})
						break;	
					default:
						$.alert({
							title: '提示',
							content: tool.alert(response.msg),
							buttons:{
								ok: {
									text: '确定',
									action: function() {
										// router.render('loanProcess');
									}
								}
							}
						})
						break;
				}
				console.log('请求失败');
			}
		}
	};

	/**
	 * ajax全局
	 */
	$.LoadingOverlaySetup({
	    image: 'data:image/gif;base64,R0lGODlhcwBzAMQfAPb4/Nne5N3i6N/k6uXq7uLn7PL1+u7x9f///7LP+evv86HE98HY+oq19fn//I649s7g+9nn/JW89vD19/z8/unx/ePs+ufs8PP5+fb7+vL4+Ovx84Wy9fn7/tfc4wAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjczRDc3OEFEQ0NDMDExRTY5QkRFQTFCQ0Y5MDJEQjU1IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjczRDc3OEFFQ0NDMDExRTY5QkRFQTFCQ0Y5MDJEQjU1Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzNENzc4QUJDQ0MwMTFFNjlCREVBMUJDRjkwMkRCNTUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzNENzc4QUNDQ0MwMTFFNjlCREVBMUJDRjkwMkRCNTUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94Onht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'
	});
	$(document).ajaxSend(function(event, jqxhr, settings){
		if(!_.__onloading)  {
			$.LoadingOverlay("show");
			_.__onloading = true;
		}
	});
	$(document).ajaxComplete(function(event, jqxhr, settings){
		if(_.__onloading) {
	    	$.LoadingOverlay("hide");
	    	_.__onloading = false;
		}
	});
	$(document).ajaxError(function(event, request, settings, error) {
		//todo show global error
		// console.log(arguments);
	});

	/************功能辅助类 begin************/
	var tool = _.tool = {};
	/**
	* 获取页码 
	*/
	tool.pages = function(total, pageSize) {
		if(!total) return 0;
		return Math.floor(total / pageSize) + (total % pageSize == 0 ? 0 : 1);
	}
	/**
	 * 添加日期格式化方法
	 * @params {number} time 时间戳
	 * @params {boolean} isTime 是否输出时分秒
	 */
	tool.formatDate = function (time, isTime) {
		var cDate = new Date(parseInt(time)),
			_year = cDate.getFullYear(),
			_month = tool.leftPad(cDate.getMonth() + 1, 2),
			_date = tool.leftPad(cDate.getDate(), 2),
			_hours = tool.leftPad(cDate.getHours(), 2),
			_minutes = tool.leftPad(cDate.getMinutes(), 2);
		if(isTime) {
			return _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes;
		}
		return _year + '-' + _month + '-' + _date;
	}
	tool.leftPad = function (s, n) {
		var l = '';
		s = s + '';
		if(s.length < n) {
			for(var i = 0, len = n - s.length; i < len; i++) {
				l += "0";
			}
			return l + s;
		}
		return s;
	}

	/**
	 * 获取上个月的函数
	 * @param  {string} date 格式为yyyy-mm-dd
	 */
	tool.getPreMonth = function(date) {
		var arr = date.split('-');  
		var year = arr[0]; //获取当前日期的年份  
		var month = arr[1]; //获取当前日期的月份  
		var day = arr[2]; //获取当前日期的日  
		var days = new Date(year, month, 0);  
		days = days.getDate(); //获取当前日期中月的天数  
		var year2 = year;  
		var month2 = parseInt(month) - 1;  
		if (month2 == 0) {  
			year2 = parseInt(year2) - 1;  
			month2 = 12;  
		}  
		var day2 = day;  
		var days2 = new Date(year2, month2, 0);  
		days2 = days2.getDate();  
		if (day2 > days2) {  
			day2 = days2;  
		}  
		if (month2 < 10) {  
			month2 = '0' + month2;  
		}  
		var t2 = year2 + '-' + month2 + '-' + day2;  
		return t2;  
	}

	/**
	 * 添加计算超期倒计时方法
	 * @params {number} pickDate 提车日期时间戳
	 * @params {boolean} deadline 上牌截止时间戳
	 */
	tool.overdue = function (pickDate, deadline) {
		var currentTime = new Date().getTime(); //当前时间
		var termTime = deadline - pickDate; //超期期限
		var duringTime = currentTime - pickDate; //至今距离提车日期的时间
		var result = termTime - duringTime;  //相差的毫秒数（倒计时）
		if(result <= 0) return '已超期';
		var _date = Math.floor(result / (24 * 3600 * 1000));
		var remain1 = result % (24 * 3600 * 1000);
		var	_hours = Math.floor(remain1 / (3600 * 1000));
		var remain2 = remain1 % (3600 * 1000);
		var	_minutes = Math.floor(remain2/(60 * 1000));
		var remain3 = remain2 % (60 * 1000);
		var _seconds = Math.round(remain2 / 1000);
		if(_date > 0) return _date + '天';	
		if(_hours > 0) return _hours + '小时';
		if(_minutes > 0) return _minutes + '分钟';
		return '不足1分钟';
		
	}

	/**
	 * 添加弹窗的提示内容html格式化方法
	 * @params {number} pickDate 提车日期时间戳
	 * @params {boolean} deadline 上牌截止时间戳
	 */
	 tool.alert = function(str) {
	 	return '<div class="w-content"><div class="w-text">' + str + '</div></div>';
	 }

	/**
	 * 添加材料名称转换方法
	 * @params {number} materialsCode 材料code
	 */
	tool.formatCode = function(materialsCode) {
		return _.materialsCodeMap[materialsCode];
	}
	tool.cfgMaterials = [{
			materialsCode: 'sfzzm',
			name: '身份证正面'
		},{
			materialsCode: 'sfzfm',
			name: '身份证反面'
		},{
			materialsCode: 'zxsqs',
			name: '征信授权书'
		},{
			materialsCode: 'xtsyzqs',
			name: '系统授权通知书'
		},{
			materialsCode: 'zxsqszp',
			name: '授权书签字照片'
		}];

	
	/*****************http end*******************/
	function unAuth() {
		$.alert({
			title: '提示',
			content: tool.alert('你的登录授权无效或已过期'),
			buttons:{
				ok: {
					text: '确定',
					action: function() {
						location.href = 'login.html';
						// alert(1)
					}
				}
			}
		})
	}
	//授权校验 begin
	function localAuth() {
		var u = {};
		u.token = Cookies.get('_hr_token');
		u.account = Cookies.get('_hr_account');
		u.dept = Cookies.get('_hr_dept');
		u.role = Cookies.get('_hr_role');
		u.phone = Cookies.get('_hr_phone');
		if(!u.token || !u.account) {
			return unAuth();
		}
		_.$http.authorization(u.token);
		_.hrLocalInformation = u;
	}
	localAuth();
	//授权校验 end

	
})(window);
