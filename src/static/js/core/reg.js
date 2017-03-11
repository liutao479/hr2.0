'use strict';
(function(g) {
	/**
	* 正则
	* key:  正则名称
	* value: 正则值
	*/
	g.regMap = {
		userName: /^[\u4E00-\u9FA5]{2,4}$/,
		idCard: /(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\d)$/
	}
})(window);