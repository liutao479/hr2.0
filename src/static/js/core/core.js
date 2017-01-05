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
	_.query = function(name, source) {

	}
	/**
	* json 转 search
	*/
	_.j2search = function(o) {
		if(!o || toString.call(o) != '[object Object]') return '';
		var arr = [];
		Object.keys(o).map(function(key) {
			arr.push(key + '=' + o[key]);
		})
		return arr.join('&');
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
				cb(response.data);
			} else {
				console.log('faile');
			}
		}
	};
	_.$http.apiMap = {
		myCustomer: 'my/customer'
	};
	$(document).ajaxError(function(event, request, settings, error) {
		//todo show global error
		console.log(arguments);
	});		
	/*****************http end*******************/

})(window);


