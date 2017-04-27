'use strict';
(function($, _) {
	$.fn.submitBar = function(cb) {
		return this.each(function() {
			this.$submitBar = new hsubmitBar($(this), $(this).data());
		});
	}

	/**
	* @params {element} $el 要渲染的对象
	* @params {object} data 要渲染的数据 
	**/
	function hsubmitBar($el, opt) {
		this.$el = $el;
		this.events = {};
		this.opt = opt || { taskId: 0};
		this.init();
	}

	/*
	* 初始化
	 */
	hsubmitBar.prototype.init = function() {
		this.getData();
	}

	hsubmitBar.prototype.getData = function(cb) {
		var self = this;
		$.ajax({
			type: 'post',
			url: $http.api('func/scene', 'zjy'),
			data: {
				taskId: self.opt.taskId 
			},
			dataType: 'json',
			success: $http.ok(function(xhr) {
				self.compile(xhr.data);
			})
		})
	}


	/**
	 * 绑定监听事件 public
	 * @param  {string}   evtName  事件名称
	 * @param  {function} callback 回调函数
	 */
	hsubmitBar.prototype.on = function(evtName, callback) {
		var self = this;
		var f = self.events[evtName];
		if(f) { return f.push(callback) }
		self.events[evtName] = [callback];
	}

	hsubmitBar.prototype.compile = function(data) {
		var self = this;
		var buttons = {
			cancelOrder: { css: 'button-orange'},
			backOrder: { css: 'button-orange'},
			rejectOrder: { css: ''},
			noAdvance: { css: 'button-check'},
			selfAdvance: { css: 'button-check'},
			applyAdvance: { css: 'button-check'},
			approvalPass: { css: 'button-deep'},
			taskSubmit: { css: 'button-deep'},
			creditQuery: { css: 'button-deep'}
		}
		for(var i = 0, len = data.length; i < len; i++) {
			var r = data[i];
			if(!buttons[r.funcId]) {
				continue;
			} else {
				var btn = buttons[r.funcId];
				btn.funcId = r.funcId;
				btn.text = r.funcName;
			}
			
		}
		var tf = _.template(tpl);
		self.$submitBar = $(tf(buttons)).appendTo(self.$el);
		self.addListener();
	}

	/**
	 * 添加内部事件监听
	 */
	hsubmitBar.prototype.addListener = function() {
		var self = this;
		['cancelOrder', 'backOrder', 'rejectOrder', 'noAdvance', 'selfAdvance', 'applyAdvance', 'approvalPass', 'taskSubmit', 'creditQuery'].forEach(function(key, idx) {
			if(key != "noAdvance" || key != "selfAdvance" || key != "applyAdvance") {
				self.$submitBar.find('#' + key).on('click', function() {
					var fns = self.events[key];
					if(fns && fns.length > 0) {
						for(var i = 0, len = fns.length; i < len; i++) {
							var fn = fns[i];
							if(fn && typeof fn == 'function') {
								fn();
							}
						}
					}
				})
			}
		});

		self.$checks = self.$submitBar.find('.checkItem');
		if(!self.$checks.length) return;
		self.$checks.eq(0).removeClass('checked').addClass('checked');
		self.$checks.eq(0).append('<i class="iconfont correct">&#xe659;</i>');
		self.$checks.on('click', function() {
			self.$checks.removeClass('checked');
			self.$checks.find('.iconfont').remove();
			$(this).addClass('checked').append('<i class="iconfont correct">&#xe659;</i>');
		});
	}

	var tpl = '<div class="commit-orders-box">\
					{{ for(var key in it) { var item = it[key]; if(!!item.funcId) { }}\
						{{ if(item.funcId == "noAdvance") { }}\
							<div id="{{=item.funcId}}" class="button {{=item.css}} checkItem" data-type="0">{{=item.text}}</div>\
						{{ continue;} }}\
						{{ if(item.funcId == "selfAdvance") { }}\
							<div id="{{=item.funcId}}" class="button {{=item.css}} checkItem" data-type="1">{{=item.text}}</div>\
						{{ continue;} }}\
						{{ if(item.funcId == "applyAdvance") { }}\
							<div id="{{=item.funcId}}" class="button {{=item.css}} checkItem" data-type="2">{{=item.text}}</div>\
						{{ continue;} }}\
						<div id="{{=item.funcId}}" class="button {{=item.css}}">{{=item.text}}</div>\
					{{ } }}\
					{{ } }}\
				</div>';
})(jQuery, doT);