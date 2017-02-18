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
	_.$http.api = function(url) {
		return url;
		//Todo 发布时增加prefix
		// return 'http://192.168.0.113:8080/' + method;
	}
	_.$http.authorization = function(key) {
		$.ajaxSetup({
			beforeSend: function(xhr) {
				xhr.setRequestHeader('Authorization', btoa('test'));
			}		
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
				console.log('failed');
			}
		}
	};
	_.$http.apiMap = {
		menu: 'http://127.0.0.1:8083/mock/menu',
		loanList: 'http://127.0.0.1:8083/mock/loan.list',
		myCustomer: 'http://192.168.0.184:8080/loanOrder/getMyCustomer',
		orderModifyAudit: 'http://192.168.0.184:8080/loanOrderApply/getLoanOrderApply',
		cancelOrderAudit: 'http://192.168.0.184:8080/loanOrderApply/getLoanOrderApply',
		loanManage: 'http://127.0.0.1:8083/mock/loan.manage',
		marginManage: 'http://127.0.0.1:8083/mock/marginManage',
		moneyBussinessAuditPrint: 'http://127.0.0.1:8083/mock/moneyBussinessAuditPrint',
		mortgageProcess: 'http://127.0.0.1:8083/mock/mortgage.process',
		mortgageAudit: 'http://127.0.0.1:8083/mock/mortgage.audit',
		mortgageTable: 'http://192.168.0.184:8080/loanPledge/getLoanPledgeList',
		operationsAnalysis: 'http://127.0.0.1:8083/mock/operationsAnalysis',
		organizationManage: 'http://127.0.0.1:8083/mock/organizationManage',
		licenceProcess: 'http://127.0.0.1:8083/mock/licence.process',
		licenceAudit: 'http://127.0.0.1:8083/mock/licence.audit',
		licenceTable: 'http://192.168.0.184:8080/loanRegistration/getLoanRegistrationList',
		expireProcess: 'http://127.0.0.1:8083/mock/expire.process',
		creditArchiveDownload: 'http://192.168.0.184:8080/creditUser/getCreditMaterials',
		loadArchiveDownload: 'http://192.168.0.184:8080/creditUser/getCreditMaterials',
		moneyBusinessAuditPrint: 'http://192.168.0.184:8080/loanUserStage/getFinancialData',
		auditPrint: 'http://192.168.0.184:8080/loanUserStage/getFinancialData',
		operationsAnalysis: 'http://127.0.0.1:8083/mock/operationsAnalysis',
		organizationManageBank: 'http://192.168.0.184:8080/demandBank/getDemandBankList',
		organizationManageCar: 'http://192.168.0.184:8080/demandCarShop/getDemandCarShop',
		// creditInput: 'http://127.0.0.1:8083/mock/creditInput'
		creditInput: 'http://192.168.0.148:8080/creditUser/getCreditInfo',
		creditMaterialsUpload: 'http://192.168.0.189:8080/creditMaterials/index',
		loanMaterialsUpload: 'http://192.168.0.189:8080/loanMaterials/index',
		addCreditUser: 'http://192.168.0.189:8080/creditUser/add',
		delCreditUser: 'http://192.168.0.189:8080/creditUser/del',
	};
	$(document).ajaxError(function(event, request, settings, error) {
		//todo show global error
		// console.log(arguments);
	});		
	/*****************http end*******************/
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
		var currentTime = Math.round(new Date().getTime()/1000) * 1000;
		var termTime = deadline - pickDate; //期限
		var duringTime = currentTime - pickDate; //至今距离提车日期的时间
		var result = termTime - duringTime;
		if(result <= 0) return '已超期';
		var _date = new Date(result).getDate(),
			_hours = new Date(result).getHours();
			_minutes = new Date(result).getMinutes();
			_seconds = new Date(result).getSeconds();
		console.log(_date)
		if(_date > 0) return _date + '天';	
		if(_hours > 0) return _hours + '小时';
		if(_seconds > 0 && _minutes < 60) return '1小时';
		
	}
	/**
	 * 添加材料名称转换方法
	 * @params {number} materialsCode 材料code
	 */
	tool.formatCode = function(materialsCode) {
		return _.materialsCodeMap[materialsCode];
	}

})(window);


