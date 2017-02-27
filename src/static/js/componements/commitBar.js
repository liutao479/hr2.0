'use strict';
(function($, _) {
	$.fn.commitBar = function() {
		return this.each(function() {
			var that = $(this);
			that.$commitBar = new hcommitBar(that, that.data());
		});
	}

	/**
	* @params {element} $el 要渲染的对象
	* @params {object} data 要渲染的数据 
	**/
	function hcommitBar($el, data) {
		// if(!data.commitBar) {
		// 	$el.remove();
		// 	return;
		// }
		this.$commitBar = $(_.template(tpl)(data)).insertAfter($el);
		$el.remove();
	}
	var tpl = '<div class="commit-orders-box">\
					{{if(it.back) { }}\
						<div id="back" class="button button-deep">{{=it.back}}</div>\
					{{ } }}\
				</div>';
})(jQuery, doT);