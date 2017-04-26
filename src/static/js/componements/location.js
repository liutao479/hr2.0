'use strict';
(function($, _) {
	$.fn.location = function(opts) {
		return this.each(function() {
			var that = $(this);
			that.$location = new hLocation(that, opts || that.data());
		});
	}

	/**
	* @params {element} $el 要渲染的对象
	* @params {object} data 要渲染的数据 
	* --@backspace {string} 返回的路由地址
	* --@current {string} 当前的地址
	* --@loanUser {string} 当前的借款人
	* --@orderDate {string} 订单日期
	**/
	function hLocation($el, data) {
		if(typeof data.backspace == 'string') {
			data.backspace = [{ title: '返回上级', href: data.backspace }];
		}
		self.opts = data;
		this.$location = $(_.template(tpl)(data)).insertAfter($el);
		$el.remove();
		this.setupLocation();
	}

	hLocation.prototype.setupLocation = function(){
		this.$location.find('.backEvt').on('click', function() {
			var that = $(this),
				idx = that.data('idx'),
				bsp = self.opts.backspace[idx];
			router.render(bsp.href, bsp.params);
		})
	};

	var tpl = '<div class="path-back-bar">\
					<div class="path-back">\
						<i class="iconfont">&#xe626;</i>\
						{{ for(var i = 0, len = it.backspace.length; i < len; i++) { var bsp = it.backspace[i]; }}\
						<a href="javascript:;" class="link backEvt" data-idx="{{=i}}" data-href="{{=bsp.href}}">{{=bsp.title || "返回上级"}}</a>&nbsp;&gt;&nbsp;\
						{{ } }}\
						<span class="current-page">{{=it.current}}</span>\
					</div>\
					{{ if(it.pmsDept) { }}\
					<div class="key-value-box">\
						<span class="key">分公司：</span>\
						<span class="value">{{=it.pmsDept}}</span>\
					</div>\
					{{ } }}\
					{{ if(it.loanUser) { }}\
					<div class="key-value-box">\
						<span class="key">借款人：</span>\
						<span class="value">{{=it.loanUser}}</span>\
					</div>\
					{{ } }}\
					{{ if(it.orderDate) { }}\
					<div class="key-value-box">\
						<span class="key">订单生成时间：</span>\
						<span class="value">{{=it.orderDate}}</span>\
					</div>\
					{{ } }}\
				</div>'
})(jQuery, doT);