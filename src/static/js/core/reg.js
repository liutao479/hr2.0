'use strict';
(function(g) {
	/**
	* 正则
	* key:  正则名称
	* value: 正则值
	*/
	g.regMap = {
		userName: /^[\u4E00-\u9FA5]{1,15}$/,
		accountName: /^[\u4E00-\u9FA5]{1,25}$/,
		idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
		accountBankName: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
		bankName: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
		accountNumber: /^(\d{16}|\d{19})$/,
		account: /^(\d{16}|\d{19})$/,
		phone: /^1[\d+]{10}$/,
		mobile: /^1[\d+]{10}$/,
		creditReportId: /^[0-9a-zA-Z]{1,30}$/,
		remark: /<\/?[^>]*>/g,
		yymmddhhmm: /^\d{4,}\-(?:0?\d|1[12])\-(?:[012]?\d|3[01]) (?:[01]?\d|2[0-4]):(?:[0-5]?\d|60)$/,
		money: /^([1-9]\d{0,15}|0)(\.\d{1,4})?$/
	}
})(window);