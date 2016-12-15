var router = {
	routers: {
		'customer': {
			templateUrl: ''
		}
	},
	init:function() {
		var hash = window.location.hash;
		if(!hash) {

		} else {
			router.direct(router.routers[hash]);
		}

	},
	direct:function() {
		//跳转逻辑
	}
}
