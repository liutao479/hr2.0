/**
* jQuery多级下拉组建
* 使用方式：$(element).dropdown();
* <ele data-dropdown="" data-tabs="" data-trigger="" data-search="" data-selected=""></ele>
* data-dropdown {function} 选中后的回调 默认传递选中的结果，若存在多级，则返回每一级的值对象
* data-tabs {string} 层级对象，多个以|分割。 品牌|车系|车型
* data-trigger {function} 多级的数据请求函数，选中上级后触发请求子级数据
* data-search {function} 搜索触发时的请求函数，不传则表示不支持搜索
* data-selected {object key} 当前选中项
*/
'use strict';
(function($, _) {
	$.fn.dropdown = function() {
		return this.each(function() {
			var that = $(this);
			that.$dropdown = new dropdown(that, that.data());
		})
	}

	/**
	* dropdown类
	* @params {element} $el 要渲染的节点对象
	* @params {object} options 配置参数
	*/
	function dropdown($el, options) {
		var self = this,
			opts = {
				dropdown: $.noop,
				trigger: $.noop
			};
		self.$el = $el;
		self.opts = $.extend(opts, options || {});
		self.sourceData = {};
		self.defautKey = '__internaldefaultkey__';
		self.setup();
		return this;
	}
	/**
	* 构造dropdown
	*/
	dropdown.prototype.setup = function() {
		var self = this;
		self.$el.append(_.template(internal.template.fields)({readonly: !self.search}));
		self.$dropdown = $('<div class="select-box"></div>').appendTo(self.$el);
		if(self.opts.tabs) {
			self.opts.tabs = self.opts.tabs.split('|');
			self.$dropdown.append(_.template(internal.template.tab)(self.opts.tabs));
		}
		self.$content = $('<div class="select-content-box"></div>').appendTo(self.$dropdown);
		self.$items = $('<div class="select-content select-content-brand select-content-active"></div>').appendTo(self.$content);
		// self.$items.append(_.template(internal.template.brandContent)())

		self.__addEventListener();
	};
	/**
	* 绑定事件
	*/
	dropdown.prototype.__addEventListener = function() {
		var self = this;
		self.$el.find('.arrow-trigger').on('click', function() {
			self.opened = true;
			self.open();
		})
		self.$el.on('click', function (evt) {
			if(self.opened) return false;
		})
		$(document).on('click', function(e){
			// if(self.$el.has($(e.target)).length === 0)
			if(self.opened) {
				self.opened = false;
				self.close();
			}
		})
	};
	/**
	* 渲染下拉列表
	*/
	dropdown.prototype.compileItems = function(idx){
		var self = this;
		var items = self.sourceData[self.opts.tabs[idx] || self.defautKey];
		if(!items) {
			self.__getData(self.opts.tabs[idx], null, function(data) {
				self.sourceData[self.opts.tabs[idx] || self.defautKey] = data;
				self.listenItem(data);
				
			});
		} else {
			self.listenItem(items);
		}
		
	};
	dropdown.prototype.listenItem = function(items){
		var self = this;
		self.$items.append(_.template(internal.template.brandContent)(items));
		self.$items.find('.itemEvt').on('click', function() {
			var $that = $(this);
			var id = $that.data('id'),
				name = $that.text();
			
		})
	};
	/**
	* 展开dropdown
	*/
	dropdown.prototype.open = function() {
		var self = this;
		self.$el.find('.select-box').show();
		self.$el.find('#arrow').removeClass('arrow-bottom').addClass('arrow-top');
		self.compileItems(0);
	};
	
	/**
	* 关闭dropdown
	*/
	dropdown.prototype.close = function() {
		var self = this;
		self.$el.find('.select-box').hide();
		self.$el.find('#arrow').removeClass('arrow-top').addClass('arrow-bottom');
	}
	/**
	* 打开下一级
	*/
	dropdown.prototype.openNext = function() {
		
	};
	/**
	* 拉取数据
	* @params {int} parentId 父节点ID
	* @params {function} internalCallback 内部回调方法
	*/
	dropdown.prototype.__getData = function(tab, parentId, internalCallback) {
		var fn, self = this;
		if(self.opts.trigger) {
			try {
				fn = eval(self.opts.trigger);
			} catch(e) {
				fn = internal.noop;
			}
			if(typeof fn != 'function') {
				fn = internal.noop;
			}
		} else {
			fn = internal.noop;
		}
		fn(tab, parentId, function(data) {
			internalCallback(data);
		})
	};

	var internal = {};
	internal.template = {};
	internal.template.fields = '<div class="select-field{{=(it.readonly ? \" readonly\": \"\")}}">\
									<input type="text" placeholder="{{=(it.readonly ? \"请选择\":\"可输入过滤条件\")}}" class="select-text" />\
									<span class="arrow arrow-bottom" id="arrow"></span>\
									<a class="arrow-trigger"></a>\
								</div>';
	internal.template.tab = '<ul class="select-tab">\
								{{ for(var i = 0, len = it.length; i < len; i++) { var row = it[i]; }}\
								<li class="select-tab-item">{{= row }}</li>\
								{{ } }}\
							</ul>';
	internal.template.brandContent = '<dl class="word-area">\
										<dt>A</dt>\
										<dd class="clearfix">\
											{{ for(var i = 0, len=it.items.length; i < len; i++) { var row = it.items[i]; }}\
											<a class="car-item itemEvt" data-id="{{=row[it.id]}}">{{=row[it.name]}}</a>\
											{{ } }}\
										</dd>\
									</dl>';
	internal.noop = function(t, p, f) {
		f();
	}
})(jQuery, doT);
