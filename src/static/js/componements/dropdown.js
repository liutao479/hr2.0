/**
* jQuery多级下拉组建
* 使用方式：$(element).dropdown();
* <ele data-dropdown="" data-tabs="" data-trigger="" data-search=""></ele>
* data-dropdown {function} 选中后的回调 默认传递选中的结果，若存在多级，则返回每一级的值对象
* data-tabs {string} 层级对象，多个以|分割。 品牌|车系|车型
* data-trigger {function} 多级的数据请求函数，选中上级后触发请求子级数据
* data-search {function} 搜索触发时的请求函数，不传则表示不支持搜索
*/
'use strict';
(function($, _) {
	$.fn.dropdown = function($scope) {
		return this.each(function() {
			var that = $(this);
			that.$dropdown = new dropdown(that, that.data(), $scope);
		})
	}

	/**
	* dropdown类
	* @params {element} $el 要渲染的节点对象
	* @params {object} options 配置参数
	*/
	function dropdown($el, options, $scope) {
		var self = this,
			opts = {
				dropdown: $.noop,
				trigger: $.noop
			};
		self.$el = $el;
		self.opts = $.extend(opts, options || {});
		var tabs = self.opts.tabs.split('|');
		self.opts.tabs = self.opts.tabs.split('|');	
		console.log(self.opts);
		self.$scope = $scope;
		self.setup();
		console.log(this)
		return this;
	}
	/**
	* 构造dropdown
	*/
	dropdown.prototype.setup = function() {
		var self = this;
		self.$el.append(_.template(internal.template.fields)({readonly: !self.search}));
		self.$content = $('<div class="select-box"></div>').appendTo(self.$el);
		if(self.opts.tabs) {
			self.$content.append(_.template(internal.template.tab)(self.opts.tabs));
		}

		self.__addEventListener();
	};
	/**
	* 绑定事件
	*/
	dropdown.prototype.__addEventListener = function() {
		var self = this;
		self.$el.find('.arrow-trigger').on('click', function() {
			self.open();
		})
		
	};
	/**
	* 展开dropdown
	*/
	dropdown.prototype.open = function() {
		self.$el.find('.select-box').show();
	};
	/**
	* 关闭dropdown
	*/
	dropdown.prototype.close = function() {

	}
	/**
	* 打开下一级
	*/
	dropdown.prototype.openNext = function() {
		
	};
	/**
	* 拉取数据
	*/
	dropdown.prototype.__getData = function() {
		
	};

	var internal = {};
	internal.template = {};
	internal.template.fields = '<div class="select-field{{=(it.readonly ? \" readonly\": \"\")}}">\
									<input type="text" placeholder="{{=(it.readonly ? \"请选择\":\"可输入过滤条件\")}}" class="select-text" />\
									<span class="arrow arrow-bottom"></span>\
									<a class="arrow-trigger"></a>\
								</div>';
	internal.template.tab = '<ul class="select-tab">\
								{{ for(var i = 0, len = it.length; i < len; i++) { var row = it[i]; }}\
								<li class="select-tab-item">{{= row }}</li>\
								{{ } }}\
							</ul>';
	internal.template.brandContent = '';
})(jQuery, doT);