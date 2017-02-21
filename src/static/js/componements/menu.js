'use strict';
/**
* 左侧菜单栏
*/
(function(w) {
	var menuMap = {
		loanProcess: {
			name: '贷款办理',
			route: 'loanProcess',
			icon: '&#xe6f9;'
		},
		myCustomer: {
			name: '我的客户',
			route: 'myCustomer',
			icon: '&#xe6c3;'
		},
		orderManage: {
			name: '订单管理',
			route: '',
			icon: '&#xe60e;'
		},
		'orderModifyAudit': {
			parent: 'orderManage',
			name: '信息修改审核',
			route: 'orderModifyAudit'
		},
		'cancelOrderAudit': {
			parent: 'orderManage',
			name: '终止订单审核',
			route: 'cancelOrderAudit'
		},
		moneyManage: {
			name: '财务管理',
			route: '',
			icon: '&#xe623;'
		},
		'loanManage': {
			parent: 'moneyManage',
			name: '借款管理',
			route: 'loanManage'
		},
		'marginManage': {
			parent: 'moneyManage',
			name: '保证金管理',
			route: 'marginManage'
		},
		licenceManage: {
			name: '上牌管理',
			route: '',
			icon: '&#xe61b;'
		},
		'licenceProcess': {
			parent: 'licenceManage',
			name: '上牌办理',
			route: 'licenceProcess'
		},
		'licenceAudit': {
			key: 'licenceManage',
			name: '上牌审核',
			route: 'licenceAudit'
		},
		'licenceStatis': {
			key: 'licenceManage',
			name: '上牌进度统计',
			route: 'licenceStatis'
		},
		mortgageManage: {
			name: '抵押管理',
			route: '',
			icon: '&#xe65d;'
		},
		'mortgageProcess': {
			parent: 'mortgageManage',
			name: '抵押办理',
			route: 'mortgageProcess'
		},
		'mortgageAudit': {
			key: 'mortgageManage',
			name: '抵押审核',
			route: 'mortgageAudit'
		},
		'mortgageStatis': {
			key: 'mortgageManage',
			name: '抵押进度统计',
			route: 'mortgageStatis'
		},
		expireManage: {
			name: '逾期管理',
			route: '',
			icon: '&#xe654;'
		},
		'expireInfoInput': {
			parent: 'expireManage',
			name: '逾期信息录入',
			route: 'expireInfoInput'
		},
		'expireProcess': {
			parent: 'expireManage',
			name: '逾期处理',
			route: 'expireProcess'
		},
		archiveDownload: {
			name: '资料下载',
			route: '',
			icon: '&#xe60a;'
		},
		'creditArchiveDownload': {
			parent: 'archiveDownload',
			name: '征信资料',
			route: 'creditArchiveDownload'
		},
		'loadArchiveDownload': {
			parent: 'archiveDownload',
			name: '贷款资料',
			route: 'loadArchiveDownload'
		},
		archivePrint: {
			name: '资料打印',
			route: '',
			icon: '&#xe60a;'
		},
		'moneyBusinessAuditPrint': {
			parent: 'archivePrint',
			name: '财务业务审批表',
			route: 'moneyBusinessAuditPrint'
		},
		'auditPrint': {
			parent: 'archivePrint',
			name: '审批表',
			route: 'auditPrint'
		},
		operationsAnalysis: {
			name: '统计分析',
			route: 'operationsAnalysis',
			icon: '&#xe603;'
		},
		organizationManage: {
			name: '合作机构维护',
			route: 'organizationManage',
			icon: '&#xe6cb;'
		}
	}
	/**
	* menu 类
	* @params {string|element}
	*/
	function menu(selector, data, router) {
		var $el = selector instanceof jQuery ? selector : $(selector),
			that = this;
		that.activeCss = 'menu-item-active';
		that.$el = $el;
		that.data = data;
		that.router = router;
		that.$dom = that._render();
		$el.remove();
		that.$el = undefined;
		that._listen();
		return that;
	}

	menu.prototype._render = function(){
		var self = this,
			arr = [];
		arr.push('<div class="menu">');
		$.each(self.data, function(key, obj) {
			if(!$.isArray(obj)) return;
			var len = obj.length;
			var menuItem = menuMap[key];
			if(len === 0) {
				arr.push('<a class="menu-item" data-href="{2}" id="menu{3}">\
							<i class="iconfont mark">{0}</i>\
							<span>{1}</span>\
						  </a>'.format(menuItem.icon, menuItem.name, menuItem.route, key));
			} else {
				arr.push('<div class="menu-group">');
				arr.push('<div class="menu-group-title menu-group-title-active">\
							<i class="iconfont mark">{0}</i>\
							<span>{1}</span>\
							<i class="iconfont iconfont-arrow">&#xe66c;</i>\
						  </div>'.format(menuItem.icon, menuItem.name));
				for(var i = 0; i < len; i++) {
					var innerKey = obj[i];
					var innerItem = menuMap[innerKey];
					arr.push('<a class="menu-group-item" id="menu{0}" data-href="{1}">{2}</a>'.format(innerKey, innerItem.route, innerItem.name));
				}
				arr.push('</div>');
			}
		})
		arr.push('</div>');
		return $(arr.join('')).insertAfter(self.$el);
	};

	menu.prototype._listen = function() {
		var self = this;
		self.$dom.on('selectstart', false);
		self.$dom.find('.menu-item, .menu-group-item').on('click', function() {
			var $that = $(this);
			var route = $that.data('href');
			self._trigger(route, $that);
		});
		self.$dom.find('.menu-group-title').on('click', function() {
			$(this).siblings().toggle();
			$(this).toggleClass('menu-group-title-active');
		});
	};

	menu.prototype._trigger = function(route, $item, unRouter) {
		var self = this;
		// if($item.hasClass(self.activeCss)) return;
		if(self.$selected) {
			self.$selected.removeClass(self.activeCss);
		}
		$item.addClass(self.activeCss);
		self.selectedKey = route;
		self.$selected = $item;
		if(!unRouter && self.router && typeof self.router == 'function') {
			self.router(route);
		}
	};

	menu.prototype.setup = function(key, unRouter){
		var self = this;
		var $item = self.$dom.find('#menu'+key);
		self._trigger(key, $item, unRouter);
	};

	w.menu = menu;
})(window);