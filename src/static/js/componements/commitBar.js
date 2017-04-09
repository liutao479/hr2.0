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
		// if(!data.commitBar) {
		// 	$el.remove();
		// 	return;
		// }
		this.$commitBar = $(_.template(tpl)(data)).insertAfter($el);
		$el.remove();
	}
	var tpl = '<div class="commit-orders-box">\
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