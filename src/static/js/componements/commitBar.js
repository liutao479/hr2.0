'use strict';
(function($, _) {
	$.fn.commitBar = function(cb) {
		return this.each(function() {
			var that = $(this);
			this.$commitBar = new hcommitBar(that, that.data(), cb);
		});
	}

	/**
	* @params {element} $el 要渲染的对象
	* @params {object} data 要渲染的数据 
	**/
	function hcommitBar($el, data, cb) {
		if(tool.isEmptyObject(data)) {
			$el.remove();
			return;
		}
		this.$commitBar = $(_.template(tpl)(data)).appendTo($el);
	}
	var tpl = '<div class="commit-orders-box">\
					{{if(it.rejectModify) { }}\
						<div id="rejectModify" class="button button-orange">拒绝修改</div>\
					{{ } }}\
					{{if(it.approvalPass) { }}\
						<div id="approvalPass" class="button button-deep">审核通过</div>\
					{{ } }}\
					{{if(it.keepOrder) { }}\
						<div id="keepOrder" class="button button-orange">保留订单</div>\
					{{ } }}\
					{{if(it.terminateOrder) { }}\
						<div id="terminateOrder" class="button button-deep">终止订单</div>\
					{{ } }}\
					{{if(it.back) { }}\
						<div id="back" class="button button-orange">退回订单</div>\
					{{ } }}\
					{{if(it.verify) { }}\
						<div id="verify" class="button button-deep">审核通过</div>\
					{{ } }}\
					{{if(it.cancel) { }}\
						<div id="cancel" class="button button-orange">取消订单</div>\
					{{ } }}\
					{{if(it.submit) { }}\
						<div id="submit" class="button button-deep">{{=it.submit}}</div>\
					{{ } }}\
				</div>';
})(jQuery, doT);