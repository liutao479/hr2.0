/**
* jQuery多级下拉组建
* 使用方式：$(element).dropdown();
* <ele data-dropdown="" data-tabs="" data-trigger="" data-search="" data-selected=""></ele>
* data-dropdown {function} 选中后的回调 默认传递选中的结果，若存在多级，则返回每一级的值对象
* data-tabs {string} 层级对象，多个以|分割。 品牌|车系|车型
* data-trigger {function} 多级的数据请求函数，选中上级后触发请求子级数据
* data-search {function} 搜索触发时的请求函数，不传则表示不支持搜索
* data-forceload {boolean} 值为true时，每次打开下拉框均会再次请求下拉源数据
* data-selected {object key} 当前选中项
*/
'use strict';
(function($, _) {
	window.dropdownCollections = [];
	$.fn.dropdown = function() {
		return this.each(function() {
			var that = $(this);
			that.$dropdown = new dropdown(that, that.data());
			dropdownCollections.push(that.$dropdown);
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
		self.picked = {};
		self.text = [];
		self.textInstance = [];
		self.actionIdx = 0;
		self.defautKey = '__internaldefaultkey__';
		self.originKey = md5(new Date().getTime());
		self.defaults();

		self.setup();
		return this;
	}
	dropdown.prototype.defaults = function(){
		var self = this;
		self.opts.tabs = self.opts.tabs ? self.opts.tabs.split('|') : [];
		self.onDropdown = $.noop;
		self.onTrigger = internal.noop;
		if(self.opts.dropdown) {
			try {
				self.onDropdown = eval(self.opts.dropdown);
			} catch(e) {
				self.onDropdown = $.noop;
			}
			if(typeof self.onDropdown != 'function') {
				self.onDropdown = $.noop;
			}
		}
		if(self.opts.trigger) {
			try {
				self.onTrigger = eval(self.opts.trigger);
			} catch(e) {
				self.onTrigger = internal.noop;
			}
			if(typeof self.onTrigger != 'function') {
				self.onTrigger = internal.noop;
			}
		}
	};
	/**
	* 构造dropdown
	*/
	dropdown.prototype.setup = function() {
		var self = this;
		if(!self.opts.selected && self.opts.selected !='0') {
			self.opts.selected = '';
		}
		if(!self.opts.placeholder) {
			self.opts.placeholder = false;
		}
		self.$el.append(_.template(internal.template.fields)({readonly: !self.search, selected: self.opts.selected, placeholder: self.opts.placeholder}));
		self.$dropdown = $('<div class="select-box"></div>').appendTo(self.$el);
		self.$text = self.$el.find('.select-text');
		if(self.opts.tabs.length > 1) {
			self.$tabPanel = $(_.template(internal.template.tab)(self.opts.tabs)).appendTo(self.$dropdown);
			self.$tabs = self.$tabPanel.find('.select-tab-item');
			self.$content = $('<div class="select-content-box"></div>').appendTo(self.$dropdown);
			self.$items = $('<div class="select-content select-content-brand select-content-active"></div>').appendTo(self.$content);
		} else {
			self.$items = $('<ul class="select-area"></ul>').appendTo(self.$dropdown);
		}
		
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
			if(dropdownCollections.length > 0) {
				closeDropDowns(self);
			}
			if(self.opened) return false;
		})
	};
	/**
	* 渲染下拉列表
	*/
	dropdown.prototype.compileItems = function(idx, parentId){
		var self = this;
		var items = self.sourceData[self.opts.tabs[idx] || self.defautKey];
		if(!items || self.opts.forceload) {
			self.onTrigger(self.opts.tabs[idx], parentId, function(data) {
				if(idx == 0) {
					self.sourceData[self.opts.tabs[idx] || self.defautKey] = data;	
				}
				self.listenItem(data);
			});
		} else {
			self.listenItem(items);
		}
		
	};
	dropdown.prototype.listenItem = function(items){
		var self = this;
		items.actionName = self.text[self.actionIdx];
		if(self.opts.tabs.length <= 1) {
			self.$items.html(_.template(internal.template.single)(items));
		} else {
			self.$items.html(_.template(internal.template.brandContent)(items));
		}
		self.$items.find('.itemEvt').on('click', function() {
			var $that = $(this);
			var inputItem = $(this).parents(".select").siblings("input");
			var id = $that.data('id'),
				accountName = $that.data('accountname'),
				bankName = $that.data('bankname'),
				name = $that.text();
			self.text.push(name);
			//只有一级，选中即表示结束
			if(self.opts.tabs.length <= 1) {
				if(!accountName || !bankName){
					self.picked = {
						id: id,
						name: name
					}
				}else{
					self.picked = {
						id: id,
						name: name,
						accountName: accountName,
						bankName: bankName
					}
				}
				self.onDropdown(self.picked);
				if(inputItem){
					inputItem.val(id)
				}
				self.close(true);
			} else {
				self.picked[self.opts.tabs[self.actionIdx]] = {
					id: id,
					name: name
				}
				//选中最后一级，也关闭
				if(self.actionIdx == self.opts.tabs.length - 1) {
					self.onDropdown(self.picked);
					if(inputItem){
						inputItem.val(id)
					}
					self.close(true);
				} else {
					self.$tabs.eq(self.actionIdx).removeClass('select-tab-item-active');
					self.actionIdx++;
					self.$tabs.eq(self.actionIdx).addClass('select-tab-item-active');
					self.compileItems(self.actionIdx, id);
				}	
			}
		})
	};
	/**
	* 展开dropdown
	*/
	dropdown.prototype.open = function() {
		var self = this;
		self.textInstance = self.text;
		self.text = [];
		self.actionIdx = 0;
		self.$el.find('.select-box').show();
		self.$el.find('.select-area').scrollTop(0);
		self.$el.find('#arrow').removeClass('arrow-bottom').addClass('arrow-top');
		if(!!self.opts.tabs.length) {
			self.$tabPanel.find('.select-tab-item-active').removeClass('select-tab-item-active');
			self.$tabs.eq(0).addClass('select-tab-item-active');	
		}
		self.compileItems(self.actionIdx);
	};
	
	/**
	* 关闭dropdown
	*/
	dropdown.prototype.close = function(finished) {
		var self = this;
		if(finished) {
			self.$text.val(self.text.join('-'));
		} else {
			self.text = self.textInstance;
			self.textInstance = [];
		}
		self.opened = false;
		self.$el.find('.select-box').hide();
		self.$el.find('#arrow').removeClass('arrow-top').addClass('arrow-bottom');
	}
	function closeDropDowns(current) {
		for(var i = 0, len = dropdownCollections.length; i < len; i++) {
			var $d = dropdownCollections[i];
			if(current && current.originKey == $d.originKey) {
				continue;
			}
			if($d.opened)
				$d.close();
		}
	}
	$(document).on('click', function(e) {
		closeDropDowns();
	})
	var internal = {};
	internal.template = {};
	internal.template.fields = '<div class="select-field{{=(it.readonly ? \" readonly\": \"\")}}">\
									{{ if(it.placeholder) { }}\
									<input type="text" placeholder="{{=(it.readonly ? \"全部\" : \"可输入过滤条件\")}}" class="select-text" value="{{=it.selected}}" />\
									{{ } else { }}\
									<input type="text" placeholder="{{=(it.readonly ? \"请选择\" : \"可输入过滤条件\")}}" class="select-text" value="{{=it.selected}}" />\
									{{ } }}\
									<span class="arrow arrow-bottom" id="arrow"></span>\
									<a class="arrow-trigger"></a>\
								</div>';
	internal.template.tab = '<ul class="select-tab">\
								{{ for(var i = 0, len = it.length; i < len; i++) { var row = it[i]; }}\
									<li class="select-tab-item{{=(i==0?\" select-tab-item-active\":\"\")}}">{{= row }}</li>\
								{{ } }}\
							</ul>';
	internal.template.single = '{{ for(var i = 0, len = it.items.length; i < len; i++) { var row = it.items[i];if(row[it.bankName] && row[it.accountName]){ }}\
									<li class="select-item itemEvt" data-id="{{=row[it.id]}}" data-bankName="{{=row[it.bankName]}}" data-accountName="{{=row[it.accountName]}}">{{=row[it.name]}}</li>\
								{{ }else{ }}\
									<li class="select-item itemEvt" data-id="{{=row[it.id]}}">{{=row[it.name]}}</li>\
								{{ } }}\
								{{ } }}';
	internal.template.brandContent = '<dl class="word-area">\
										<dt>A</dt>\
										<dd class="clearfix">\
											{{ for(var i = 0, len=it.items.length; i < len; i++) { var row = it.items[i]; name=row[it.name]; }}\
											<a class="car-item{{=(it.actionName == name ? \" picked\":\"\")}} itemEvt" data-id="{{=row[it.id]}}">{{=row[it.name]}}</a>\
											{{ } }}\
										</dd>\
									</dl>';
	internal.noop = function(t, p, f) {
		f();
	}
})(jQuery, doT);
