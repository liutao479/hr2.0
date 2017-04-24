'use strict';
(function(g) {
	// g.urlStr = "http://192.168.1.86:9999";
	// g.urlStr = "http://192.168.1.124:8080";
	// g.urlStr = "http://192.168.0.22:8080";
	// g.urlStr = "http://192.168.1.55:8080";
	// g.urlStr = "http://192.168.1.74:8080";
	 g.urlStr = "http://192.168.0.187:9999";
	// g.urlStr = "http://192.168.0.186:9999";
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
	            "name":"私牌",
	            "value":"0"
	        },
	        {
	            "name":"公牌",
	            "value":"1"
	        }
	    ],
	    "isFinanceLeaseVehicle":[
	        {
	            "name":"否",
	            "value":"0"
	        },
	        {
	            "name":"是",
	            "value":"1"
	        }
	    ],
	    "isOperationVehicle":[
	        {
	            "name":"否",
	            "value":"0"
	        },
	        {
	            "name":"是",
	            "value":"1"
	        }
	    ],
	    "isInstallGps":[
	        {
	            "name":"否",
	            "value":"0"
	        },
	        {
	            "name":"是",
	            "value":"1"
	        }
	    ],
	    "isDiscount":[
	        {
	            "name":"否",
	            "value":"0"
	        },
	        {
	            "name":"是",
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
	            "name":"否",
	            "value":"0"
	        },
	        {
	            "name":"是",
	            "value":"1"
	        }
	    ],
	    "maritalStatus":[
	        {
	            "name":"未婚",
	            "value":"0"
	        },
	        {
	            "name":"已婚",
	            "value":"1"
	        },
	        {
	            "name":"单身离婚",
	            "value":"2"
	        },
	        {
	            "name":"丧偶",
	            "value":"3"
	        }
	    ],
	    "houseStatus":[
	        {
	            "name":"无",
	            "value":"0"
	        },
	        {
	            "name":"有商品房",
	            "value":"1"
	        },
	        {
	            "name":"有自建房",
	            "value":"2"
	        }
	    ],
	    "isEnterprise":[
	        {
	            "name":"否",
	            "value":"0"
	        },
	        {
	            "name":"是",
	            "value":"1"
	        }
	    ],
	    "userRelationship":[
//	        {
//	            "name":"本人",
//	            "value":"0"
//	        },
	        {
	            "name":"配偶",
	            "value":"1"
	        },
	        {
	            "name":"父母",
	            "value":"2"
	        },
	        {
	            "name":"子女",
	            "value":"3"
	        },
	        {
	            "name":"其他",
	            "value":"-1"
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
	    ],
	    "custsort":[
	        {
	            "name":"居民身份证",
	            "value":"0"
	        },
	        {
	            "name":"军官证",
	            "value":"2"
	        },
	        {
	            "name":"武警警官证",
	            "value":"9"
	        },
	        {
	            "name":"港澳居民来往大陆通行证",
	            "value":"4"
	        },
	        {
	            "name":"外国通行证",
	            "value":"7"
	        }
	    ],
	    "reltship1":[
	        {
	            "name":"夫妻",
	            "value":"5"
	        },
	        {
	            "name":"父子",
	            "value":"1"
	        },
	        {
	            "name":"母子",
	            "value":"2"
	        },
	        {
	            "name":"兄弟姐妹",
	            "value":"3"
	        }
	    ],
	    "reltship2":[
	        {
	            "name":"朋友",
	            "value":"8"
	        },
	        {
	            "name":"同事",
	            "value":"9"
	        }
	    ],
	    "drawmode":[
	        {
	            "name":"邮寄至单位地址",
	            "value":"1"
	        },
	        {
	            "name":"邮寄至住宅地址",
	            "value":"2"
	        },
	        {
	            "name":"自取",
	            "value":"3"
	        }
	    ],
	    "machgf":[
	        {
	            "name":"是",
	            "value":"1"
	        },
	        {
	            "name":"否",
	            "value":"0"
	        }
	    ],
	    "occptn":[
	        {
	            "name":"公务员",
	            "value":"1"
	        },
	        {
	            "name":"事业单位员工",
	            "value":"2"
	        },
	        {
	            "name":"工人",
	            "value":"6"
	        },
	        {
	            "name":"农民",
	            "value":"7"
	        },
	        {
	            "name":"军人",
	            "value":"4"
	        },
	        {
	            "name":"职员",
	            "value":"3"
	        },
	        {
	            "name":"私人业主",
	            "value":"30"
	        },
	        {
	            "name":"学生",
	            "value":"17"
	        },
	        {
	            "name":"自由职业者",
	            "value":"5"
	        },
	        {
	            "name":"无",
	            "value":"29"
	        }
	    ],
	    "modelcode":[
	        {
	            "name":"国有经济",
	            "value":"10"
	        },
	        {
	            "name":"集体经济",
	            "value":"20"
	        },
	        {
	            "name":"私营",
	            "value":"60"
	        },
	        {
	            "name":"民营",
	            "value":"110"
	        },
	        {
	            "name":"股份合作",
	            "value":"90"
	        },
	        {
	            "name":"其他股份制",
	            "value":"100"
	        },
	        {
	            "name":"三资",
	            "value":"50"
	        },
	        {
	            "name":"其他",
	            "value":"190"
	        }
	    ],
	    "mrtlstat":[
	        {
	            "name":"已婚",
	            "value":"2"
	        },
	        {
	            "name":"未婚",
	            "value":"1"
	        },
	        {
	            "name":"其他",
	            "value":"6"
	        }
	    ],
	    "yesNo":[
	        {
	            "name":"是",
	            "value":"1"
	        },
	        {
	            "name":"否",
	            "value":"0"
	        }
	    ]
	},
	g.urlApiMap = {
		"serviceTypeCode": urlStr+"/loanConfigure/getItem",//业务类型
		"brand": urlStr+"/demandBank/selectBank",//经办银行
		"busiSourceTypeCode": urlStr+"/loanConfigure/getItem",//业务来源类型
		"busiArea": urlStr+"/area/get",//三级下拉省市县
		"busiSourceId": urlStr+"/carshop/list",//业务来源方名称
		"busiSourceNameSearch": urlStr+"/carshop/searchCarShop",//业务来源方名称模糊搜索
		"onLicensePlace": urlStr+"/area/get",//三级下拉省市县
		"busimode": urlStr+"/loanConfigure/getItem",//业务模式
		"carName": urlStr+"/car/carBrandList",//三级车辆型号:车辆品牌
		"carNameSearch":  urlStr+"/car/searchCars",//车辆型号模糊搜索
		"repayPeriod": urlStr+"/loanConfigure/getItem", //还款期限
		"businessModel": urlStr+"/loanConfigure/getItem", // 业务模式
		"remitAccountNumber": urlStr+"/demandCarShopAccount/getAccountList" //打款账号
	};

})(window);