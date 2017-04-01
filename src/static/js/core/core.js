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
			return 'http://192.168.1.90:8083/mock/' + method;
		else
			// switch (name) {
			// 	// 周宜俭ip
			// 	case 'zyj':
			// 		return 'http://192.168.0.22:8080/' + method;
			// 		break;
			// 	// 蔡延军ip
			// 	case 'cyj':
			// 		return 'http://192.168.1.116:8080/' + method;
			// 		break;
			// 	// 季本松ip
			// 	case 'jbs':
			// 		return 'http://192.168.1.124:8080/' + method;
			// 		break;
			// 	// 王亮ip 
			// 	case 'wl':
			// 		return 'http://192.168.1.113:8888/' + method;
			// 		break;
			// 	// 李艳波ip 
			// 	case 'lyb':
			// 		return 'http://192.168.1.44:8080/' + method;
			// 		break;
			// }
			
			return 'http://192.168.1.86:8080/' + method;
			// return 'http://192.168.0.186:9999/' + method;
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
					case 6011:
						$.alert({
							title: '提示',
							content: tool.alert('账户已存在'),
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
					default:
						// statements_def
						break;
				}
				console.log('请求失败');
			}
		}
	};
	

	var gUrl='http://192.168.1.90:8083/';
	_.$http.apiMap = {
		menu: gUrl+'mock/menu',
		loanList: gUrl+'mock/loan.list',
		myCustomer: 'http://192.168.0.114:8080/loanOrder/getMyCustomer',
		orderModifyAudit: gUrl+'mock/orderModifyAudit',
		cancelOrderAudit: gUrl+'mock/cancelOrderAudit',
		loanManage: gUrl+'mock/loan.manage',
		marginManage: gUrl+'mock/marginManage',
		moneyBussinessAuditPrint: gUrl+'mock/moneyBussinessAuditPrint',
		mortgageProcess: gUrl+'mock/mortgage.process',
		mortgageAudit: gUrl+'mock/mortgage.audit',
		mortgageStatis: 'http://192.168.0.114:8080/loanPledge/getLoanPledgeList',
		operationsAnalysis: gUrl+'mock/operationsAnalysis',
		licenceProcess: gUrl+'mock/licence.process',
		licenceAudit: gUrl+'mock/licence.audit',
		licenceStatis: 'http://192.168.0.114:8080/loanRegistration/getLoanRegistrationList',
		expireProcess: gUrl+'mock/expire.process',
		creditArchiveDownload: 'http://192.168.0.114:8080/creditUser/getCreditMaterials',
		loadArchiveDownload: 'http://192.168.0.114:8080/creditUser/getCreditMaterials',
		moneyBusinessAuditPrint: 'http://192.168.0.114:8080/loanUserStage/getFinancialData',
		auditPrint: 'http://192.168.0.114:8080/loanUserStage/getFinancialData',
		organizationManage: gUrl+'mock/organizationManage',
		creditInput: gUrl+'mock/creditInput',
//		loanInfo: 'http://192.168.0.135:8080/loanInfoInput/info',
		loanInfo: gUrl+'mock/loan.infoBak',
//		loanInfo: gUrl+'mock/loan.infoBakChange',
		loanAudit: gUrl+'mock/loan.info',
		cardAudit: gUrl+'mock/openCardSheet',
		openCardSheet: gUrl+'mock/openCardSheet',
		lendAudit: gUrl+'mock/loan.info',
		phoneAudit: gUrl+'mock/phoneAudit',
		carTwohand: gUrl+'mock/car.towhand',
		carAudit: gUrl+'mock/loan.infoBak',
		mortgageTable: 'http://192.168.0.184:8080/loanPledge/getLoanPledgeList',
		licenceTable: 'http://192.168.0.184:8080/loanRegistration/getLoanRegistrationList',
		organizationManageBank: 'http://192.168.0.184:8080/demandBank/getDemandBankList',
		organizationManageCar: 'http://192.168.0.184:8080/demandCarShop/getDemandCarShop',
		creditMaterialsUpload: 'http://192.168.0.189:8080/creditMaterials/index',
		loanMaterialsUpload: 'http://192.168.0.189:8080/loanMaterials/index',
		addCreditUser: 'http://192.168.0.189:8080/creditUser/add',
		delCreditUser: 'http://192.168.0.189:8080/creditUser/del'

	};
	$(document).ajaxError(function(event, request, settings, error) {
		//todo show global error
		// console.log(arguments);
	});
	/*****************http end*******************/
	function unAuth() {
		$.alert({
			title: '提示',
			content: tool.alert('你的登录授权无效或已过期'),
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
		// _.$http.authorization(u.token);
		_.hrLocalInformation = u;
	}
	// localAuth();
	//授权校验 end

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
	/**
	* for plugin
	*/
	jconfirm.defaults = {
		useBootstrap: false,
		theme: 'material'
	}
})(window);
