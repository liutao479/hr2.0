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
		'activeInspect': {
			title: '发起主动抽查',
			refer: [],
			page: 'activeInspect'
		},
		'historyInspect': {
			title: '历史核查记录',
			refer: [],
			page: 'historyInspect'
		},
		'historyInspectDetail': {
			title: '历史核查记录详情',
			refer: [],
			page: 'historyInspectDetail'
		},
		'materialInspection': {
			title: '材料验真',
			refer: [],
			page: 'materialInspection'
		},
		'dataAssistant': {
			title: '数据辅证',
			refer: [],
			page: 'dataAssistant'
		},
		'riskManagement': {
			title: '风控服务统计',
			refer: [],
			page: 'riskManagement'
		},
		'riskManagementDetail': {
			title: '风控服务统计明细',
			refer: [],
			page: 'riskManagementDetail'
		},
		'preAudit': {
			title: '预审核',
			refer: [],
			page: 'preAudit'
		},
		'preAuditDataAssistant': {
			title: '预审核数据辅证',
			refer: [],
			page: 'preAuditDataAssistant'
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
			page: 'expireInfoInputHead'
		},
		'expire/expireInfoInput': {
			title: '逾期信息批量导入',
			refer: [],
			page: 'expireInfoInput'
		},
		'expire/importHistory': {
			title: '逾期信息历史记录',
			refer: [],
			page: 'importHistory'
		},
		'expire/expireInfoPrev': {
			title: '逾期信息导入详情',
			refer: [],
			page: 'expireInfoPrev'
		},
		'expire/expireInfoSingle': {
			title: '逾期信息单笔录入',
			refer: [],
			page: 'expireInfoInputSingle'
		},
		'expire/expireInfoDetail': {
			title: '批量导入详情',
			refer: [],
			page: 'expireInfoDetail'
		},
		'expireProcess': {
			title: '逾期处理',
			refer: [],
			page: 'expireProcessInputList'
		},
		'expireProcess/expireProcessDetail': {
			title: '逾期处理详情',
			refer: [],
			page: 'expireProcessDetail'
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
		'operations/operationsTab1': {
			title: '风控服务统计',
			refer: [],
			page: 'operationsTab1'
		},
		'operations/operationsTab2': {
			title: '业务量日统计',
			refer: [],
			page: 'operationsTab2'
		},
		'operations/operationsTab3': {
			title: '业务量区间统计',
			refer: [],
			page: 'operationsTab3'
		},
		'operations/operationsTab4': {
			title: '放款调度统计',
			refer: [],
			page: 'operationsTab4'
		},
		'operations/operationsTab5': {
			title: '逾期情况统计',
			refer: [],
			page: 'operationsTab5'
		},
		'operations/operationsTab6': {
			title: '报表下载',
			refer: [],
			page: 'operationsTab6'
		},



		'organizationManage': {
			title: '合作机构维护',
			refer: [],
			page: 'organizationManage'
		},
		'loanProcess/detail': {
			page: 'detail',
			title: '贷款办理'
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
		'loanProcess/loanMaterialsUpload': {
			title: '贷款材料上传',
			page: 'loanMaterialsUpload'
		},
		'loanProcess/homeMaterialsUpload': {
			title: '上门材料上传',
			page: 'homeMaterialsUpload'
		},
		'loanProcess/signMaterialsUpload': {
			title: '签约材料上传',
			page: 'signMaterialsUpload'
		},
		'loanProcess/advanceMaterialsUpload': {
			title: '垫资材料上传',
			page: 'advanceMaterialsUpload'
		},
		'loanProcess/pickMaterialsUpload': {
			title: '提车材料上传',
			page: 'pickMaterialsUpload'
		},
		'loanProcess/loanMaterialsChoose': {
			title: '贷款材料选择',
			page: 'loanMaterialsChoose'
		},
		'myCustomer/orderDetails': {
			title: '订单详情',
			page: 'orderDetails'
		},
		'orderModifyAudit/orderDetails': {
			title: '信息修改审核',
			page: 'orderDetails'
		},
		'cancelOrderAudit/orderDetails': {
			title: '终止订单审核',
			page: 'orderDetails'
		},
		'loanProcess/loanInfoInput': {
			title: '贷款信息表录入',
			page: 'loanInfo'
		},
		'loanProcess/secondhandInput':{
			title: '二手车评估信息录入',
			page: 'secondhandInput'
		},
		'loanProcess/secondhandAudit':{
			title: '二手车评估信息审核',
			page: 'secondhandAudit'
		},
		'loanProcess/newBusiness':{
			title: '新建业务',
			page: 'newBusiness'
		},



		'loanProcess/loanTelApproval': {
			title: '电审',
			page: 'phoneCheck'
		},
		'loanProcess/makeLoanApproval': {
			title: '放款审核',
			page: 'lendAudit'
		},
		'loanProcess/loanApproval': {
			title: '贷款审核',
			page: 'loanApproval'
		},
		'loanProcess/pickMaterialsApproval': {
			title: '提车审核',
			page: 'pickMaterialsApproval'
		},





		'loanProcess/phoneAudit': {
			title: '电核',
			page: 'phoneAudit'
		},
		'loanProcess/loanInfoAudit': {
			title: '贷款信息表审核',
			page: 'loanInfoAudit'
		},
		'loanProcess/loanLog': {
			title: '订单日志',
			page: 'loanLog'
		},
		'loanProcess/creditMaterialsApproval': {
			title: '征信材料审核',
			page: 'creditMaterialsApproval'
		},
		'loanProcess/cardInfoApproval': {
			title: '开卡审核',
			page: 'cardInfoApproval'
		},
		'loanProcess/cardInfoInput': {
			title: '开卡信息录入',
			page: 'openCardSheet'
		},
		'loanProcess/creditAudit':{
			title: '开卡审核',
			page: 'operateAnalysis'
		},
		'loanProcess/usedCarInfoInput':{
			title: '二手车信息录入',
			page: 'secondhandInput'
		},
//		'loanProcess/usedCarInfoInput':{
//			title: '二手车信息录入',
//			page: 'carTwohand'
//		},
		'loanProcess/busiModeChoose':{
			title: '业务类型选择',
			page: 'surviceType'
		},
		'loanProcess/creditApproval': {
			title: '征信预审核',
			page: 'creditApproval'
		},
		'loanProcess/creditResult': {
			title: '征信结果',
			page: 'creditResult'
		},
		'expireProcess/importHistory':{
			title: '逾期导入历史记录',
			page: 'importHistory'
		},
		'expireProcess/expireProcessDetail':{
			title: '逾期处理',
			page: 'expireProcessDetail'
		},
		'expireProcess/expireRecord':{
			title: '逾期记录',
			page: 'expireRecord'
		},
		'expireProcess/expireInfoPrev':{
			title: '逾期记录',
			page: 'expireInfoPrev'
		},
		'expireProcess/expireTaskDistribute':{
			title: '逾期记录',
			page: 'expireTaskDistribute'
		},
		'expireProcess/expireInfoInputSingle':{
			title: '逾期记录',
			page: 'expireInfoInputSingle'
		},
		'expireProcess/expireProcessInputList':{
			title: '逾期记录',
			page: 'expireProcessInputList'
		},
		'expireProcess/expireSingleDetail':{
			title: '逾期记录',
			page: 'expireSingleDetail'
		},
		'licenceProcess/licenceProcessDetail': {
			title: '上牌办理详情',
			page: 'licenceProcessDetail'
		},
		'licenceAudit/licenceAuditDetail': {
			title: '上牌审核详情',
			page: 'licenceAuditDetail'
		},
		'licenceStatis/licenceStatisDetail': {
			title: '上牌办理进度详情',
			page: 'licenceStatisDetail'
		},
		'mortgageProcess/mortgageProcessDetail': {
			title: '抵押办理详情',
			page: 'mortgageProcessDetail'
		},
		'mortgageAudit/mortgageAuditDetail': {
			title: '抵押审核详情',
			page: 'mortgageAuditDetail'
		},
		'mortgageStatis/mortgageStatisDetail': {
			title: '抵押办理进度详情',
			page: 'mortgageStatisDetail'
		},
		'organizationManage/newBank': {
			title: '新建/编辑合作银行',
			page: 'newBank'
		},
		'organizationManage/newCar': {
			title: '新建/编辑合作车商',
			page: 'newCar'
		},

		'test': {
			title: '测试文件',
			page: 'test'
		}
	}
	g.subRouterMap = {
		'T0013': 'loanMaterialsUpload',//贷款材料
		'T0015': 'loanLog',//订单日志
		'T0023': 'loanMaterialsUpload',//贷款材料
//		'T0024': 'cardAudit',//开卡信息表
		'T0024': 'cardInfoApproval',//开卡信息表
		'T0025': 'materialInspection',//材料验真
		'T0026': 'dataAssistant',//数据辅证
		'T0027': '',//材料交叉验证
		'T0028': 'loanLog',//订单日志
		'T0038': 'loanLog',//订单日志
		'T0040': '',//材料验真
		'T0041': '',//数据辅证
		'T0042': '',//材料交叉验证
		'T0043': 'loanLog',//订单日志
		'T0046': 'phoneAudit',//电核结果
		'T0047': 'loanInfoAudit',//贷款信息表结果
		'T0048': 'creditResult',//征信结果
		'T0049': 'homeMaterialsUpload',//上门材料
		'T0050': 'loanInfoAudit',//贷款信息表结果
		'T0051': 'creditResult',//征信结果
		'T0052': 'secondhandAudit',//二手评估结果
		'T0053': 'homeMaterialsUpload',//上门材料
		'T0054': 'signMaterialsUpload',//签约材料
		'T0055': 'phoneAudit',//电核结果
		'T0056': 'loanInfoAudit',//贷款信息表结果
		'T0057': 'loanInfoAudit',//贷款信息表结果
		'T0058': 'pickMaterialsUpload',//提车材料审核
		'T0059': 'pickMaterialsUpload',//提车材料审核
		'T0061': 'loanInfoAudit',
		'T0062': 'loanInfoAudit',
		'T0063': 'creditResult',//征信结果
		'T0064': 'secondhandAudit',//二手评估结果
		'T0065': 'loanMaterialsUpload',//贷款材料
		'T0066': 'homeMaterialsUpload',//上门材料
		'T0067': 'signMaterialsUpload',//签约材料
		'T0068': 'pickMaterialsUpload',//提车材料审核
		'T0069': '',//材料验真
		'T0070': '',//数据辅证
		'T0071': '',//材料交叉验证
		'T0072': 'loanLog',//订单日志
		'T0073': 'loanInfoAudit',
		'T0074': 'loanInfoAudit',//待审核信息
		'T0075': 'loanLog',//订单日志
		'T0076': 'loanInfoAudit',//贷款信息表结果
		'T0077': 'creditResult',//征信结果
		'T0078': 'secondhandAudit',//二手评估结果
		'T0079': 'loanMaterialsUpload',//贷款材料
		'T0080': 'homeMaterialsUpload',//上门材料
		'T0081': 'signMaterialsUpload',//签约材料
		'T0082': 'pickMaterialsUpload',//提车材料审核
		'T0083': '',//材料验真
		'T0084': '',//数据辅证
		'T0085': '',//材料交叉验证
		'T0086': 'loanLog',//订单日志


		'T00108': 'loanMaterialsUpload',//贷款材料
		'T00109': 'signMaterialsUpload',//签约材料
		'T00110': 'loanMaterialsUpload',//贷款材料
		'T00111': 'homeMaterialsUpload'//上门材料
	}
	var todoMap = {'T0004': '',
	'T0005': '',
	'T0006': '',
	'T0007': '',
	'T0008': '',
	'T0009': '',
	'T0010': '',
	'T0046': '',
	'T0047': '',
	'T0048': '',
	'T0013': '',
	'T0049': '',
	'T0015': '',
	'T0016': '',
	'T0017': '',
	'T0018': '',
	'T0050': '',
	'T0051': '',
	'T0052': '',
	'T0023': '',
	'T0053': '',
	'T0054': '',
	'T0024': '',
	'T0055': '',
	'T0058': '',
	'T0025': '',
	'T0026': '',
	'T0027': '',
	'T0028': '',
	'T0029': '',
	'T0033': '',
	'T0034': '',
	'T0035': '',
	'T0036': '',
	'T0037': '',
	'T0056': '',
	'T0038': '',
	'T0057': '',
	'T0059': '',
	'T0040': '',
	'T0041': '',
	'T0042': '',
	'T0043': '',
	'T0044': '',
	'T0045': '',
	'T0001': '',
	'T0060': '',
	'T0061': ''}
})(window);