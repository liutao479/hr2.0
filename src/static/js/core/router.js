'use strict';
(function(g) {
	var router = g.router = {};
	var ctrl = g.pageCtrl = {};
	/**
	* 页面路由
	* routerKey: {
	* 	template: 'template url',
	* 	paegs: ['page js url'],
	* 	style: ['page style url']
	* }
	*/
	var routerMap = {
		'loanProcess': {
			title: '车贷办理',
			refer: ['test'],
			page: "loan"
		},
		'myCustomer': {
			title: '我的客户',
			refer: [],
			page: 'customer'
		}
	}
	/**
	* router 内部方法
	*/
	var internal = {}
	internal.script = function(name) {
		return 'static/js/page/' + name + '.js';
	}; 
	/**
	* 获取路由模板
	*/
	router.template = function(key) {
		return 'iframe/' + key + '.html';
	}
	/**
	* 执行渲染
	* @params {string} key 要渲染的页面键名
	*/
	router.render = function(key) {
		g.location.hash = key;
		var item = routerMap[key];
		if(!item) {
			return g.location.href = '404.html';
		}
		g.render.renderTitle(item.title);
		var refer = item.refer,
			loadpage = function() {
				$.getScript(internal.script(item.page));
			};
		if(refer && !!refer.length) {
			var args = [];
			for(var i = 0, len = refer.length; i < len; i++) {
				args.push($.getScript(internal.script(refer[i])));
			}
			$.when.apply(args)
			.done(loadpage)
		} else {
			loadpage();
		}
	}
})(window)