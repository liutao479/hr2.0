'use strict';
(function($, _) {
	$.fn.checking = function() {
		return this.each(function() {
			var that = $(this);
			that.$checking = new checking(that, that.data());
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
	function checking($el, data) {
		this.$location = $(_.template(tpl)(data)).insertAfter($el);
		$el.remove();
		this.setupLocation();
	}

	checking.prototype.setupLocation = function(){
		this.$location.find('#backspace').on('click', function() {
			var that = $(this),
				params = that.data();
			var href = params.href;
			delete params['href'];
			router.render(href, params);
		})
	};

	var tpl = '<div class="path-back-bar">\
					<div class="path-back">\
						<i class="iconfont">&#xe626;</i>\
						<a href="javascript:;" id="backspace" class="link" data-href="{{=it.backspace}}">返回列表</a>&nbsp;&gt;&nbsp;\
						<span class="current-page">{{=it.current}}</span>\
					</div>\
					{{ if(it.loanUser) { }}\
					<div class="key-value-box">\
						<span class="key">借款人：</span>\
						<span class="value">{{=it.loanUser}}</span>\
					</div>\
					{{ } }}\
					<div class="key-value-box">\
						<span class="key">订单生成时间：</span>\
						<span class="value">{{=it.orderDate}}</span>\
					</div>\
				</div>'
})(jQuery, doT);