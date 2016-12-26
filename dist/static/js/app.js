//$('#menu > a').on('click', function() {
//	var tar = $(this).data('href');
//	window.location.href = window.location.href + '#' + tar;
//	
//})
//$('#pageToolbar').Paging({pagesize:10,count:85,toolbar:true});	
var isOpen = false; 
$("#remind-tips").on("click",function (){
	if(!isOpen) {
		$("#remind").animate({
			right: "155px"
		},500);
		$(this).find(".iconfont").html("&#xe605;");
		isOpen = true;
	} else {
		$("#remind").animate({
			right: "0"
		},500);
		$(this).find(".iconfont").html("&#xe697;");
		isOpen = false;
	}
});


//右边栏
$(".sideBar-item").hover(function() {
	$(this).find(".sideBar-content").show();	
},function() {
	$(this).find(".sideBar-content").hide();		
});

'use strict';
(function(global) {
	/**
	* 添加string.format方法
	*/
	if(!String.prototype.format) {
		String.prototype.format = function(){
			var args = arguments;
			return this.replace(/\{(\d+)\}/g,                
		    function(match, number){
		        return typeof args[number] != 'undefined' ? args[number] : match;
		    });
		};
	}
	/*
	* 本地验证规则
	*/
	var regulation = {
		number: /^[1-9]{1,}$/,
		phone: /^1[\d+]{10}$/,
		idc: /^[\d+]{14|17}[\d+|Xx]{1}$/i
	}
	global.regulation = $.extend(global.regulation || {}, regulation);
})(window);


























































































































































































































































'use strict';
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
})(window);

'use strict';
/**
* jQuery分页控件
* 使用方式 $(element).paging()
* <ele data-paging="{ajaxLoadingFunctionName}" data-max="{totalCount}" data-pages="{totalPage}" data-size="{pageSize}" data-current="{currentPage}"></ele>
* data-paging {function} 页面跳转请求函数，用于传递参数从新从服务器获取新的页面数据; 默认参数(page, pageSize, $el, cb)，函数需要绑定到window对象
* data-max {int} 当前列表最大记录数 默认 0，为0时，分页控件自动移除
* data-pages {int} 当前最大页数，与data-max二者传其一
* data-size {int} 每页显示的数量 默认 20
* data-current {int} 当前页码 默认 1
*/
(function($, _) {
	$.fn.paging = function() {
		return this.each(function() {
			var that = $(this);
			that.$paging = new paging(that, that.data());
		})
	};
	//分页函数
	function paging($el, options) {
		var self = this;
		self.opt = $.extend({
			request: undefined,
			pages: 0,
			max: 0,
			size: 20,
			current: 1
		}, options || {});
		self.$el = $el;
		if(self.opt.max == 0 && self.opt.pages == 0) {
			$el.hide();
			return self;
		}
		self.opt.pages = self.opt.pages || Math.round(self.opt.max / self.opt.size + 0.5) || 0;
		self.init(self.opt);
		return self;
	};

	paging.prototype.init = function(opt){
		var self = this;
		self.$el.on('selectstart', false);
		self.compile();
	};
	paging.prototype.compile = function() {
		var self = this;
		var pageMap = {
			max: self.opt.pages,
			current: self.opt.current
		}
		self.$el.html(self.render(pageMap));
		self.addEvent();
	};
	paging.prototype.update = function(){
		var self = this;
		self.compile();
	};
	/**
	* 渲染控件
	* @params {object} it 渲染所需要的数据对象
	*/
	paging.prototype.render = function(it) {
		var arr = [];
		arr.push('	<ul class="paginator clearfix">');
		arr.push('		<li class="page page-prev"><i class="iconfont">&#xe601;</i></li>');
		if(it.max < 8) {
			arr.push(internal.renderFull(1, it.max, it.current));
		} else {
			if(it.current < 7) {
				arr.push(internal.renderFull(1, it.current, it.current));
				if(it.current <= (it.max - 6)) {
					arr.push(internal.renderFull(it.current + 1, it.current + 2, it.current));
					arr.push('		<li class="page page-ellipse"><i class="iconfont">&#xe66f;</i></li>');
					arr.push(internal.renderNormal(it.max - 1));
					arr.push(internal.renderNormal(it.max));
				} else {
					arr.push(internal.renderFull(it.current + 1, it.max, it.current));
				}
			} else {
				arr.push(internal.renderNormal(1));
				arr.push(internal.renderNormal(2));
				arr.push('		<li class="page page-ellipse"><i class="iconfont">&#xe66f;</i></li>');
				if(it.current <= (it.max - 6)) {
					arr.push(internal.renderFull(it.current - 2, it.current + 2, it.current));
					arr.push('		<li class="page page-ellipse"><i class="iconfont">&#xe66f;</i></li>');
					arr.push(internal.renderNormal(it.max - 1));
					arr.push(internal.renderNormal(it.max));
				} else {
					arr.push(internal.renderFull(it.current - 2, it.max, it.current));
				}
			}
		}
		arr.push('		<li class="page page-next"><i class="iconfont">&#xe670;</i></li>');
		arr.push('		<li class="page-jump-area"><span>到第</span> <input type="text" class="input-text"> <span>页</span> <a class="button">确定</a></li>');
		arr.push('	</ul>');
		return arr.join('');
	};
	/**
	* 绑定事件
	*/
	paging.prototype.addEvent = function() {
		var self = this;
		var $page = self.$el.find('.page-item'),
			$prev = self.$el.find('.page-prev'),
			$next = self.$el.find('.page-next'),
			$input = self.$el.find('.input-text'),
			$jumb = self.$el.find('.button');
		$page.on('click', function() {
			var $that = $(this),
				page = $that.data('page');
			if($that.hasClass('focus') || $that.hasClass('page-ellipse')) return;
			self.direct(page);
		});
		$prev.on('click', function() {
			if(self.opt.current == 1) return;
			self.direct(self.opt.current - 1);
		})
		$next.on('click', function() {
			if(self.opt.current == self.opt.pages) return;
			self.direct(self.opt.current + 1);
		})
		$jumb.on('click', function() {
			var page = $input.val();
			if(!regulation.number.test(page)) {
				alert('无效的页码');
				return $input.val('');
			}
			self.direct(parseInt(page));
		})
	};
	/**
	* 指定页
	* @params {int} page 需要跳转的页码
	*/
	paging.prototype.direct = function(page) {
		var self = this;
		if(self.opt.request) {
			try {
				self.opt.request = eval(sel.opt.request)
			} catch(err) {
				self.opt.request = internal.empty;
			}
		} else {
			self.opt.request = internal.empty;
		}
		self.opt.request(page, self.opt.size, self.$el, function(data) {
			self.opt.current = page;
			self.update();
		})
	};

	var internal = {
		onFocused: function(n, m) {
			return n == m ? ' focus' : '';
		},
		renderNormal: function(num) {
			return '		<li class="page page-item" data-page="{0}">{0}</li>'.format(num);
		},
		renderFull: function(min, max, cur) {
			var arr = [];
			for(var i = min; i <= max; i++) {
				arr.push('		<li class="page page-item{0}" data-page="{1}">{1}</li>'.format(internal.onFocused(i, cur), i));
			}
			return arr.join('');
		},
		empty: function(p, s, e, cb) {
			cb();
		}
	}
})(jQuery);







(function(){
	$.fn.hrSelect = function() {
		var templates = {
			normal: '',
			area: '',
			car: ''
		}
		function select($el) {
			var options = {
				per: 'normal'
			}
			var per = $el.attr('jq-per');
			this.$el = $el;
			options.per = per;
			$el.html('<select></select>')
		}
		
		select.prototype.init = function() {
			var self = this;
			var dataSource = options.source;
			$.ajax({
				url: dataSource,
				success: function(data) {
					self.render(data);	
				}
			})
			
		}
		
		select.prototype.render = function(data) {
			var self = this, tpl;
			if(self.options.per == 'normal') {
				tpl = self.normalSelect();
			} else if(self.options.per == 'area') {
				tpl = self.areaSelect()
			} else {
				tpl = self.carSelect()
			}
			self.$el.html(doT.temlate(tpl)(data));
		}
		
		select.prototype.normalSelect = function(data) {
			return templates.normal;
		}
		
		select.prototype.areaSelect = function() {
			var tpl = '<div></div>\
				<div></div>';
			return tpl;
		}
		
		select.prototype.carSelect = function() {}
		
		return this.each(function(){
			var $that = $(this);
			select($that);
		})
	}
	
})()

//$(function(){
//	$('.select').hrSelect();
//})