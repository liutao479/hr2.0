'use strict';
(function($) {
	$.fn.checking = function(cb) {
		return this.each(function() {
			var that = $(this);
			that.$checking = new checking(that, that.data());
			if(cb && typeof cb == 'function') {
				cb(that);
			} 
		});
	}

	/**
	* @params {element} $el 要渲染的对象
	* @params {object} data 要渲染的数据 
	* --@checked {string} 是否被选中
	**/
	function checking($el, data) {
		var self = this;
		self.opt = $.extend({
			checked: undefined
		}, data);
		self.$el = $el;
		self.init();
	}

	checking.prototype.init = function() {
		var self = this;
		self.onselectstart = function(e) { return false };
		if(!self.opt.checked) {
			self.empty();
		} else {
			self.full();
		}
		self.setupEvt();
	};

	checking.prototype.setupEvt = function() {
		var self = this;
		self.$el.on('click', function() {
			// console.log(1)
			if(!self.$el.attr('checked')) {
				self.full();
			} else {
				self.empty();
			}
		})
	}

	checking.prototype.full = function() {
		var self = this;
		self.$el.addClass('checked').attr('checked', true);
		self.$el.html('<i class="iconfont">&#xe659;</i>');
	}


	checking.prototype.empty = function() {
		var self = this;
		self.$el.removeClass('checked').attr('checked', false);
		self.$el.html();
	}
})(jQuery);