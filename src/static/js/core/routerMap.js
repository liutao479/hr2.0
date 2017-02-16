'use strict';
(function(g) {
	/**
	* 页面路由
	* routerKey: {
	* 	template: 'template url',
	* 	paegs: ['page js url'],
	* 	style: ['page style url']
	* }
	*/
	g.routerMap = {
		'loanProcess': {
			title: '车贷办理',
			page: "loan"
		},
		'myCustomer': {
			title: '我的客户',
			page: 'myCustomer'
		},
		'orderModifyAudit': {
			title: '订单修改审核',
			page: 'orderModifyAudit'
		},
		'cancelOrderAudit': {
			title: '订单修改审核',
			page: 'cancelOrderAudit'
		},
		'loanManage': {
			title: '借款管理',
			refer: ['navigator'],
			page: 'loanManage'
		},
		'marginManage': {
			title: '保证金管理',
			refer: [],
			page: 'marginManage'
		},
		'licenceProcess': {
			title: '上牌办理',
			refer: [],
			page: 'licenceProcess'
		},
		'licenceAudit': {
			title: '上牌审核',
			refer: [],
			page: 'licenceAudit'
		},
		'licenceStatis': {
			title: '上牌进度统计',
			refer: [],
			page: 'licenceStatis'
		},
		'mortgageProcess': {
			title: '抵押办理',
			refer: [],
			page: 'mortgageProcess'
		},
		'mortgageAudit': {
			title: '抵押审核',
			refer: [],
			page: 'mortgageAudit'
		},
		'mortgageStatis': {
			title: '抵押进度统计',
			refer: [],
			page: 'mortgageStatis'
		},
		'moneyBusinessAuditPrint': {
			title: '财务业务审批表',
			refer: [],
			page: 'moneyBusinessAuditPrint'
		},
		'auditPrint': {
			title: '审批表',
			refer: [],
			page: 'auditPrint'
		},
		'expireInfoInput': {
			title: '逾期信息录入',
			refer: [],
			page: 'expireInfoInput'
		},
		'expireProcess': {
			title: '逾期处理',
			refer: [],
			page: 'expireProcess'
		},
		'creditArchiveDownload': {
			title: '征信资料下载',
			refer: [],
			page: 'creditArchiveDownload'
		},
		'loadArchiveDownload': {
			title: '贷款资料下载',
			refer: [],
			page: 'loadArchiveDownload'
		},
		'operationsAnalysis': {
			title: '运营分析',
			refer: [],
			page: 'operationsAnalysis'
		},
		'organizationManage': {
			title: '合作机构维护',
			refer: [],
			page: 'organizationManage'
		},
		'loanProcess/creditMaterialsUpload': {
			title: '征信材料上传',
			page: 'creditMaterialsUpload'
		},
		'loanProcess/creditInput': {
			title: '征信结果录入',
			page: 'creditInput'
		},
		'loanProcess/loanInfo': {
			title: '信息表修改',
			page: 'loanInfo'
		},
		'loanManage/ordersDetail': {
			title: '订单详情',
			page: 'ordersDetail'
		}
		

	}
})(window);