'use strict';
(function(_) {

	function Todo($el) {
		this.$el = $el;
		this.opts = {
			timeout: 100000,
			animation: 200
		}
		this.items = {};
		this.total = 0;
		this.page = {
			ch: $('body').height() - 100
		}
		if(this.page.ch < 172) {
			return false;
		}
		this.init();
	}

	Todo.prototype.init = function() {
		var self = this;
		self.$el.html(template.box);
		self.$trigger = self.$el.find('#remindTips');
		self.$icon = self.$trigger.find('.iconfont');
		self.$number = self.$el.find('.message-number');
		self.$items = self.$el.find('.remind-box');
		self.listen();
		self.connect(true);
	};

	Todo.prototype.listen = function() {
		var self = this;
		self.$trigger.on('click', function() {
			if(!self.total) return false;
			if(self.opened) {
				self.close();
			} else {
				self.open();
			}
		});
		$(document).on('click', '.remindEvt', function() {
			var key = $(this).data('code');
			router.render('loanProcess', {
				process: key,
				name: self.items[key].name
			});
			self.close();
		})
		$(window).on('resize', function() {
			self.page.ch = $('body').height() - 100;
		});
	};

	Todo.prototype.open = function() {
		var self = this;
		self.$el.animate({right: '155px'}, self.opts.animation);
		self.$icon.html('&#xe605;');
		self.opened = true;
	};

	Todo.prototype.close = function() {
		var self = this;
		self.$el.animate({right: 0}, self.opts.animation);
		self.$icon.html('&#xe697;');
		self.opened = false;
	};

	Todo.prototype.addItems = function(data) {
		var self = this;
		var total = data.taskSize,
			list = data.taskCategorys,
			tmpl = {};
		self.$number.html(total);
		self.total = total;
		for(var i = 0, len = list.length; i < len; i++) {
			var row = list[i],
				item = self.items[row.sceneCode];
			if(item) {
				if(item.size != row.size) {
					item.$number.html(row.size);
					item.size = row.size;
				}
			} else {
				item = {};
				item.key = row.sceneCode;
				item.name = row.category;
				item.size = row.size;
				item.$body = $(template.item.format(row.category, row.size, row.sceneCode)).appendTo(self.$items);
				item.$number = item.$body.find('.message-number');
			}
			tmpl[row.sceneCode] = item;
			delete self.items[row.sceneCode];
		}
		$.each(self.items, function(key, o) {
			o.$body.remove();
		});
		self.items = tmpl;
		self.connect();
		self.$items.removeAttr('style');
		var boxHeight = self.$items.height();
		if(boxHeight > (self.page.ch - 50)) {
			self.$items.css({
				'height': self.page.ch - 50,
				'overflow': 'hidden',
				'overflowY': 'scroll'
			});
		}
	};

	Todo.prototype.connect = function(immediately) {
		var self = this;
		function internal(e) {
			$.ajax({
				url: 'http://localhost:8083/mock/todo?t='+new Date(),
				beforeSend: function(xhr) {
					xhr.closeLoading = true;
					return true;
				},
				success: function(xhr) {
					if(!xhr.code && xhr.data) {
						e.addItems(xhr.data);
					}
				}
			})
		}
		if (immediately) {
			internal(self);
		} else {
			setTimeout(function() {
				internal(self);
			}, self.opts.timeout);
		}
	};

	var template = {
		box: '<div class="remind-tips" id="remindTips">\
					<i class="iconfont">&#xe697;</i>\
					<div class="remind-tips-text">待办提醒</div>\
					<span class="message-number">0</span>\
				</div>\
				<div class="remind-content">\
					<ul class="remind-box"></ul>\
				</div>',
		item: '<li class="remind-item remindEvt" data-code="{2}">{0}<span class="message-number">{1}</span></li>'
	};

	_.Todo = Todo
})(window)