$('#menu > a').on('click', function() {
	var tar = $(this).data('href');
	window.location.href = window.location.href + '#' + tar;
	
})

<<<<<<< HEAD























































































































































































































































=======
>>>>>>> master
/**
* 模板渲染文件
* 处理服务端获取的模板、数据，渲染成指定的dom结构
* create on 2016-12-12
* by sjdong
**/
(function(global) {
	global.render = global.render || {
		/**
		* 加载模板
		* @params {string} templatePath 模板文件地址
		* @params {function} cb 回调函数 
		*/
		loadTemplate: function(templatePath, cb) {
			$.ajax({
				url: templatePath,
				success: function(xhr) { 
					cb(xhr)
				},
				error: function(err) {
					cb({err: err.message})
				}
			})
		},
		/*
		* 编译模板
		* @params {documentElement} $el 需要加载的dom节点
		* @params {string} template 模板内容或模板的地址
		* @params {object} data 需要渲染的数据
		* @params {boolean} raw 是否是纯模板内容
		**/
		compile: function($el, template, data, raw) {
			function _render(_$el, _t, _d) {
				try {
					var c = doT.template(_t);	
					_$el.html(c(_d));
				} catch(err) {
					_$el.html('模板文件编译错误：' + err.message);
				}	
			}
			if(raw) {
				_render($el, template, data);	
			} else {
				global.render.loadTemplate(template, function(str) {
					if(typeof str == 'object') {
						return $el.html('模板加载失败，请刷新重试');
					}
					_render($el, str, data);
				})
			}
		}
	};
})(window)
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
