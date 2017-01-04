'use strict';
(function(g) {
	var router = g.router = {};
	/**
	* 页面控制器
	*/
	var page = g.page = {};
	/**
	* 页面作用域集合
	*/
	page.$scope = {};
	/**
	* 页面关联文件集合，用于保存引用文件的缓存
	* 如果在refers中存在的文件，则不再重新加载
	*/
	page.refers = {};
	/**
	* 页面控制器集合
	*/
	page.ctrls = {};
	/**
	* 页面控制器注册函数
	* @params {string} name 页面名称，即控制器名称，与页面文件名称相同
	* @params {array} refer 依赖文件列表
	* @params {function} fn 页面回调执行函数
	*/
	page.ctrl = function(name, refer, fn) {
		if(!name) { return false; }
		if(!fn) { 
			fn = refer; 
			refer = []; 
		}
		page.ctrl[name] = {
			refer: refer,
			fn: fn
		}
		page.$scope[name] = {};
	}
	/**
	* 加载依赖文件
	* @params {string} name 控制器名称
	* @params {object} params 参数
	*/
	page.excute = function(name, params) {
		var _ctrl = page.ctrl[name],
			_$scope = page.$scope[name];
		_$scope.$params = params || {};
		if(_ctrl.refer && _ctrl.refer.length > 0) {
			var args = [];
			for(var i = 0, len = _ctrl.refer.length; i < len; i++) {
				var referName = _ctrl.refer[i];
				if(!page.refers[referName]) {
					var referPath = internal.script(referName);
					page.refers[referName] = referPath;
					args.push($.getScript(referPath));	
				}
			}
			if(!!args.length) {
				return $.when.apply(args)
						.done(function() {
							_ctrl.fn.apply(_$scope);
						})	
			}
		}
		_ctrl.fn(_$scope);
	}
	//Todo 待删除
	var ctrl = g.pageCtrl = {};
	/**
	* 页面路由
	* routerKey: {
	* 	template: 'template url',
	* 	paegs: ['page js url'],
	* 	style: ['page style url']
	* }
	*/
	g.routerMap = {
		'loanProcess': {
			title: '车贷办理',
			refer: ['navigator'],
			page: "loan"
		},
		'myCustomer': {
			title: '我的客户',
			refer: ['navigator'],
			page: 'customer'
		},
		'loanManage': {
			title: '借款管理',
			refer: ['navigator'],
			page: 'loanMagage'
		},
		creditInput: {
			title: '征信结果录入'
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
	router.render = function(key, params) {
		g.location.hash = key + (params ? '?' + j2search(params) : '');
		var item = g.routerMap[key];
		if(!item) {
			return g.location.href = '404.html';
		}
		g.render.renderTitle(item.title);
		var __currentPage = item.page;
		$.getScript(internal.script(__currentPage))
			.done(function() {
				page.excute(__currentPage, params);
			});
		/*
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
		*/
	}
	/**
	* 初始化界面
	* @params {function} cb 回调函数
	*/
	router.init = function(cb) {
		var hash = g.location.hash;
		if(!hash) { return cb(); }
		var loc = hash.replace('#', '').split('/');
		router.render(loc[loc.length - 1]);
		cb(loc[0]);
	}
})(window)