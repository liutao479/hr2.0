'use strict';
(function($, _) {
	/**
	* tab导航控件
	* @params {jquery element} $el 渲染对象
	* @params {array} tabItems tab列表
	* @params {object} selectedItem 选中项下标
	* @params {function} tabChange 更改选中项触发的事件
	*/
	$.tabNavigator = function($el, tabItems, selectedItem, tabChange) {
		if(!tabItems || tabItems.length <= 1) return $el.remove();
		$el.$tabNavigator = new Tab($el, tabItems, selectedItem, tabChange);
		return $el;
	}

	function Tab($el, tabItems, selectedItem, change) {
		this.$el = $el;
		this.items = tabItems;
		this.selected = selectedItem || 0;
		this.change = change || $.noop;
		this.activeClass = 'role-item-active';
		this.init();
	}

	Tab.prototype.init = function() {
		var self = this;
		self.$el.html(_.template(template)({
			items: self.items,
			selected: self.selected
		}));
		self.$items = self.$el.find('.itemEvt');
		self.$selected = self.$items.eq(self.selected);
		self.listen();
	};

	Tab.prototype.listen = function() {
		var self = this;
		self.$items.on('click', function() {
			var $this = $(this),
				idx = $this.data('idx');
			if($this == self.$selected) return false;
			self.$selected.removeClass(self.activeClass);
			$this.addClass(self.activeClass);
			self.$selected = $this;
			self.selected = idx;
			self.change(idx, self.items[idx]);
		});
	}

	var template = '<ul class="role-bar-ul clearfix">\
						{{ for(var i = 0, len = it.items.length; i < len; i++) { var item = it.items[i]; }}\
						<li class="role-bar-li"><a class="role-item itemEvt{{=(i==it.selected?\" role-item-active\":\"\")}}" data-idx="{{=i}}">{{=item.name}}</a></li>\
						{{ } }}\
					</ul>';
})(jQuery, doT);