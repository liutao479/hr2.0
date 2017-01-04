'use strict';
/**
* 模板渲染文件
* 处理服务端获取的模板、数据，渲染成指定的dom结构
* create on 2016-12-12
* by sjdong
**/
(function(global) {
	var titlePrefix = '惠融车贷业务云';
	var render = global.render = {
		/**
		* router内容绑定对象
		*/
		$console: $('#console'),
		/**
		* 渲染标题
		*/
		renderTitle: function(title) {
			$('title').html(title + '-' + titlePrefix);
		},
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
		* @params {function} fn 回调函数
		* @params {boolean} raw 是否是纯模板内容
		**/
		compile: function($el, template, data, fn, raw) {
			function _render(_$el, _t, _d, _f) {
				try {
					var c = doT.template(_t);	
					console.log(_d);
					_$el.html(c(_d));
				} catch(err) {
					_$el.html('模板文件编译错误：' + err.message);
				}
				_f.apply();
			}
			if(typeof fn == 'boolean' || !fn) {
				fn = $.noop;
				raw = fn;
			}
			if(raw) {
				_render($el, template, data, fn);	
			} else {
				global.render.loadTemplate(template, function(str) {
					if(typeof str == 'object') {
						return $el.html('模板加载失败，请刷新重试');
					}
					_render($el, str, data, fn);
				})
			}
		}
	};

})(window);