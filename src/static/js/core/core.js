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
	_.$http.api = function(method) {
		return 'http://127.0.0.1:8083/mock/' + method;
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
		menu: 'menu',
		loanList: 'loan.list',
		myCustomer: 'myCustomer'
	};
	$(document).ajaxError(function(event, request, settings, error) {
		//todo show global error
		console.log(arguments);
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
})(window);


