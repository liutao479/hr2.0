/**
* 分页控件
*/
(function(root, factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['$', 'query'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Paging = factory(window.Zepto || window.jQuery || $);
	}
})(this, function($) {

}) 