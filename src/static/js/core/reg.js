'use strict';
(function(g) {
	/**
	* 正则
	* key:  正则名称
	* value: 正则值
	*/
	g.regMap = {
		userName: /^[\u4E00-\u9FA5]{2,4}$/,
		accountName: /(^[\u4e00-\u9fa5]{1}[\u4e00-\u9fa5\.·。]{0,8}[\u4e00-\u9fa5]{1}$)|(^[a-zA-Z]{1}[a-zA-Z\s]{0,8}[a-zA-Z]{1}$)/,
		idCard: /(^\d{15}$)|(^\d{17}([0-9]|X)$)/,
		accountBankName: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
		bankName: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
		accountNumber: /^(\d{16}|\d{19})$/,
		account: /^(\d{16}|\d{19})$/
	}
})(window);