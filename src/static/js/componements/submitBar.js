'use strict';
(function($, _) {
	$.fn.submitBar = function(cb) {
		return this.each(function() {
			var that = $(this);
			that.$submitBar = new hsubmitBar(that, that.data(), cb);
		});
	}

	/**
	* @params {element} $el 要渲染的对象
	* @params {object} data 要渲染的数据 
	**/
	function hsubmitBar($el, opt, cb) {
		var self = this;
		self.opt = opt;
		self.getData(function() {
			self.$submitBar = $(_.template(tpl)(self.opt.xhr)).insertAfter($el);
			$el.remove();
			cb(self.$submitBar);
		});
	}

	hsubmitBar.prototype.getData = function(cb) {
		var self = this;
		console.log(self)
		$.ajax({
			type: 'post',
			url: $http.api('func/scene', 'zjy'),
			data: {
				taskId: self.opt.taskId 
			},
			dataType: 'json',
			success: $http.ok(function(xhr) {
				xhr.class = {
					cancelOrder: 'button-orange',
					backOrder: 'button-orange',
					rejectOrder: '',
					approvalPass: 'button-deep',
					taskSubmit: 'button-deep',
					creditQuery: 'button-deep',
					noAdvance: 'button-orange',
					selfAdvance: '',
					applyAdvance: 'button-deep'
				}
				self.opt = $.extend({
					xhr: xhr
				}, self.opt || {});
				if(cb && typeof cb == 'function') {
					cb();
				}
			})
		})
	}

	var tpl = '<div class="commit-orders-box">\
					{{ for(var i = 0, len = it.data.length; i < len; i++) { var row = it.data[i]; }}\
						<div id="{{=row.funcId}}" class="button {{=it.class[row.funcId]}}">{{=row.funcName}}</div>\
					{{ } }}\
				</div>';
})(jQuery, doT);