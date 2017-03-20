'use strict';
(function(g) {
	var urlStr = "http://192.168.1.108:8080";
	g.dataMap = {
	    "sex":[
	        {
	            "name":"男",
	            "value":"0"
	        },
	        {
	            "name":"女",
	            "value":"1"
	        }
	    ],
	    "isSecond":[
	        {
	            "name":"新车",
	            "value":"0"
	        },
	        {
	            "name":"二手车",
	            "value":"1"
	        }
	    ],
	    "licenseType":[
	        {
	            "name":"公牌",
	            "value":"0"
	        },
	        {
	            "name":"私牌",
	            "value":"1"
	        }
	    ],
	    "isFinanceLeaseVehicle":[
	        {
	            "name":"是融资租赁车",
	            "value":"0"
	        },
	        {
	            "name":"不是融资租赁",
	            "value":"1"
	        }
	    ],
	    "isOperationVehicle":[
	        {
	            "name":"运营车",
	            "value":"0"
	        },
	        {
	            "name":"非运营车",
	            "value":"1"
	        }
	    ],
	    "isInstallGps":[
	        {
	            "name":"是",
	            "value":"0"
	        },
	        {
	            "name":"否",
	            "value":"1"
	        }
	    ],
	    "isDiscount":[
	        {
	            "name":"贴息",
	            "value":"0"
	        },
	        {
	            "name":"不贴息",
	            "value":"1"
	        }
	    ],
	    "renewalMode":[
	        {
	            "name":"自行办理",
	            "value":"0"
	        },
	        {
	            "name":"单位承保",
	            "value":"1"
	        }
	    ],
	    "renewalModeList":[
	        {
	            "name":"自行办理",
	            "value":"0"
	        },
	        {
	            "name":"单位承保",
	            "value":"1"
	        }
	    ],
	    "isAdvanced":[
	        {
	            "name":"需要垫资",
	            "value":"0"
	        },
	        {
	            "name":"不需要垫资",
	            "value":"1"
	        }
	    ],
	    "maritalStatus":[
	        {
	            "name":"已婚",
	            "value":"0"
	        },
	        {
	            "name":"未婚",
	            "value":"1"
	        }
	    ],
	    "houseStatus":[
	        {
	            "name":"有商品房",
	            "value":"0"
	        },
	        {
	            "name":"有房",
	            "value":"1"
	        }
	    ],
	    "isEnterprise":[
	        {
	            "name":"是企业法人",
	            "value":"0"
	        },
	        {
	            "name":"不是企业法人",
	            "value":"1"
	        }
	    ],
	    "userRelationship":[
	        {
	            "name":"父母",
	            "value":"0"
	        },
	        {
	            "name":"子女",
	            "value":"1"
	        }
	    ],
	    "relationship":[
	        {
	            "name":"同事",
	            "value":"0"
	        },
	        {
	            "name":"朋友",
	            "value":"1"
	        }
	    ]
	}
//	,
//	g.urlApiMap = {
//		"serviceType": urlStr+"/loanConfigure/getItem",//业务类型
//		"brand": urlStr+"/demandBank/selectBank",//经办银行
//		"busiSourceType": urlStr+"/loanConfigure/getItem",//业务来源类型
//		"busiArea": urlStr+"/area/get",//三级下拉省市县
//		"busiSourceName": urlStr+"/carshop/list",//业务来源方名称
//		"busiSourceNameSearch": urlStr+"/carshop/searchCarShop",//业务来源方名称模糊搜索
//		"onLicensePlace": urlStr+"/area/get",//三级下拉省市县
//		"busimode": urlStr+"/loanConfigure/getItem",//业务模式
//		"carName": urlStr+"/car/carBrandList",//三级车辆型号:车辆品牌
//		"carNameSearch":  urlStr+"/car/searchCars",//车辆型号模糊搜索
//		"repaymentTerm": urlStr+"/loanConfigure/getItem", //还款期限
//		"remitAccountNumber": urlStr+"/demandCarShopAccount/getAccountList" //打款账号
//	};
})(window);