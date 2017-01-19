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
		myCustomer: 'http://192.168.0.112:8080/loanOrder/getMyCustomer',
		orderModifyAudit: 'orderModifyAudit',
		cancelOrderAudit: 'cancelOrderAudit',
		loanManage: 'loan.manage',
		marginManage: 'marginManage',
		moneyBussinessAuditPrint: 'moneyBussinessAuditPrint',
		mortgageProcess: 'http://127.0.0.1:8083/mock/mortgage.process',
		mortgageAudit: 'http://127.0.0.1:8083/mock/mortgage.audit',
		mortgageStatis: 'http://192.168.0.112:8080/loanPledge/getLoanPledgeList',
		operationsAnalysis: 'operationsAnalysis',
		organizationManage: 'organizationManage',
		licenceProcess: 'http://127.0.0.1:8083/mock/licence.process',
		licenceAudit: 'http://127.0.0.1:8083/mock/licence.audit',
		licenceStatis: 'http://192.168.0.112:8080/loanRegistration/getLoanRegistrationList',
		expireProcess: 'expire.process',
		creditArchiveDownload: 'http://192.168.0.112:8080/creditUser/getCreditMaterials',
		loadArchiveDownload: 'http://192.168.0.112:8080/creditUser/getCreditMaterials',
		moneyBusinessAuditPrint: 'http://192.168.0.112:8080/loanUserStage/getFinancialData',
		auditPrint: 'http://192.168.0.112:8080/loanUserStage/getFinancialData',
		operationsAnalysis: 'operationsAnalysis',
		organizationManage: 'organizationManage'
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
	 */
	tool.formatDate = function(_time) {
		var cDate = new Date(_time);
		return cDate.getFullYear() + '-' + tool.leftPad(cDate.getMonth() + 1, 2) + '-' + tool.leftPad(cDate.getDate(), 2);
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
})(window);


