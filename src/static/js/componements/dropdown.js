/**
* jQuery多级下拉组建
* 使用方式：$(element).dropdown();
* <ele data-dropdown="" data-level="" data-trigger="" data-search=""></ele>
* data-dropdown {function} 选中后的回调 默认传递选中的结果，若存在多级，则返回每一级的值对象
* data-level {int} 层级数
* data-trigger {function} 多级的数据请求函数，选中上级后触发请求子级数据
* data-search {function} 搜索触发时的请求函数，不传则表示不支持搜索
*/
'use strict';
(function($) {
	$.fn.dropdown = function() {
		return this.each(function() {
			var that = $(this);
			that.$dropdown = new dropdown(that, self.data());
		})
	}

	/**
	* dropdown类
	* @params {element} $el 要渲染的节点对象
	* @params {object} options 配置参数
	*/
	function dropdown($el, options) {

		return this;
	}
})(jQuery);