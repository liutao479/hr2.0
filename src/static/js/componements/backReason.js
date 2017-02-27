'use strict';
(function($, _) {
	$.fn.backReason = function() {
		return this.each(function() {
			var that = $(this);
			that.$backReason = new hBackReason(that, that.data());
		});
	}

	/**
	* @params {element} $el 要渲染的对象
	* @params {object} data 要渲染的数据 
	* --@backUser {string} 退回人员
	* --@createDateStr {string} 订单日期
	**/
	function hBackReason($el, data) {
		if(!data.backReason) {
			$el.remove();
			return;
		}
		this.$backReason = $(_.template(tpl)(data)).insertAfter($el);
		$el.remove();
	}
	var tpl = '<div class="back-creditRes-bar mt15">\
					<div class="back-credit">\
						<div class="key-value-box">\
							<span class="key">退回人员：</span>\
							<span class="value">{{=it.backUser}}</span>\
							<span class="value">{{=it.backUserPhone}}</span>\
							<span class="value float-right">{{=it.backDate}}</span>\
						</div>\
						<div class="key-value-box">\
							<span class="key">退回原因：</span>\
							<span class="value">{{=it.backReason}}</span>\
						</div>\
					</div>\
				</div>';
})(jQuery, doT);