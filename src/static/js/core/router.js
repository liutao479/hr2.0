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
		if(typeof fn != 'function') {
			fn = $.noop;
		}
		page.ctrl[name] = {
			refer: refer,
			fn: fn
		}
		page.$scope[name] = { def: {} };
	}
	/**
	* 加载依赖文件
	* @params {string} name 控制器名称
	* @params {stirng} 当前路由地址
	* @params {object} params 参数
	*/
	page.excute = function(name, path, params) {
		var _ctrl = page.ctrl[name],
			_$scope = page.$scope[name],
			args = [];
		router.closeRefresh = false;
		if(!_$scope) return false;
		_$scope.$params = params || {};
		_$scope.$path = path;
		if(_ctrl.refer && _ctrl.refer.length > 0) {
			for(var i = 0, len = _ctrl.refer.length; i < len; i++) {
				var referName = _ctrl.refer[i];
				if(!page.refers[referName]) {
					var referPath = internal.script(referName, true);
					page.refers[referName] = referPath;
					args.push($.getScript(referPath));	
				}
			}
		}
		if(!!args.length) {
			var promise = $.when.apply(args);
			promise.done(function() {
				setTimeout(function() {
					_ctrl.fn(_$scope);
				}, 0);
			});
		} else {
			_ctrl.fn(_$scope);	
		}
	}
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
			page: "loan"
		},
		'myCustomer': {
			title: '我的客户',
			page: 'myCustomer'
		},
		'loanManage': {
			title: '借款管理',
			refer: ['navigator'],
			page: 'loanManage'
		},
		'marginManage': {
			title: '保证金管理',
			refer: [],
			page: 'marginManage'
		},
		'licenceProcess': {
			title: '上牌办理',
			refer: [],
			page: 'licenceProcess'
		},
		'licenceAudit': {
			title: '上牌审核',
			refer: [],
			page: 'licenceAudit'
		},
		'licenceStatis': {
			title: '上牌进度统计',
			refer: [],
			page: 'licenceStatis'
		},
		'mortgageProcess': {
			title: '抵押办理',
			refer: [],
			page: 'mortgageProcess'
		},
		'mortgageAudit': {
			title: '抵押审核',
			refer: [],
			page: 'mortgageAudit'
		},
		'mortgageStatis': {
			title: '抵押进度统计',
			refer: [],
			page: 'mortgageStatis'
		},
		'moneyBusinessAuditPrint': {
			title: '财务业务审批表',
			refer: [],
			page: 'moneyBusinessAuditPrint'
		},
		'auditPrint': {
			title: '审批表',
			refer: [],
			page: 'auditPrint'
		},
		'expireProcess': {
			title: '逾期处理',
			refer: [],
			page: 'expireProcess'
		},
		'operationsAnalysis': {
			title: '运营分析',
			refer: [],
			page: 'operationsAnalysis'
		},
		'organizationManage': {
			title: '合作机构维护',
			refer: [],
			page: 'organizationManage'
		},
		'loanProcess/creditUpload': {
			title: '征信结果录入',
			page: 'creditUpload'
		},
		'loanManage/ordersDetail': {
			title: '订单详情',
			page: 'ordersDetail'
		},
		'loanProcess/loanInfo': {
			title: '贷款信息表录入',
			page: 'loanInfo'
		},
		'loanProcess/secondhandInput': {
			title: '二手车评估信息录入',
			page: 'carTwohand'
		},
		'loanProcess/phoneAudit': {
			title: '电审',
			page: 'electricCheck'
		},
		'loanProcess/loanAudit': {
			title: '贷款审核',
			page: 'loanAudit'
		},
		'loanProcess/lendAudit': {
			title: '放款审核',
			page: 'lendAudit'
		},
		'loanProcess/cardAudit': {
			title: '开卡审核',
			page: 'cardAudit'
		},
		'loanProcess/creditAudit':{
			title: '开卡审核',
			page: 'operateAnalysis'
		}

	}
	/**
	* router 内部方法
	*/
	var internal = {}
	internal.script = function(name, refer) {
		if(refer) {
			return 'static/js/' + name + '.js';
		}
		else {
			return 'static/js/page/' + name + '.js';
		}
	}; 
	/**
	* 获取路由模板
	*/
	router.template = function(key) {
		return 'iframe/' + key + '.html';
	}
	router.closeRefresh = false;
	/**
	* 执行渲染
	* @params {string} key 要渲染的页面键名
	* @params {object} params 要传递的参数
	* @params {object} opts 参数
	* --@opts.bStatic 是否更新路由
	*/
	router.render = function(key, params, opts) {
		render.$console.html('');
		router.closeRefresh = true;
		if(!opts || !opts.bStatic) {
			g.location.hash = key + (!$.isEmptyObject(params) ? '?' + $.param(params) : '');
		}
		var item = g.routerMap[key];
		if(!item) {
			return g.location.href = '404.html';
		}
		g.render.renderTitle(item.title);
		var __currentPage = item.page;
		$.getScript(internal.script(__currentPage))
			.done(function() {
				page.excute(__currentPage, key, params);
			});
	}
	/**
	* 初始化界面
	* @params {function} cb 回调函数
	*/
	router.init = function(cb) {
		var hash = g.location.hash.replace(/\?+/g, '?').substr(1);
		if(!hash) { return cb(); }
		var sp = hash.split('?');
		var _origin = sp[0],
			_search = !!sp[1] ? ('?' + sp[1]) : undefined;
		var _paths = _origin.split('/'),
			_params = !!_search ? $.parseParams(_search) : undefined;
		router.render(_origin, _params);
		cb && typeof cb == 'function' && cb(_paths[0]);
	}
	$(window).bind('hashchange', function() {
		var path = g.location.hash.substr(1).split('?')[0];
		if(!path) return false;
		if(router.closeRefresh) {
			router.closeRefresh = false;	
			return false;
		}
		g.location.reload();
	});
})(window);
