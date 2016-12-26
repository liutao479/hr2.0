'use strict';
/**
* jQuery分页控件
* 使用方式 $(element).paging()
* <ele data-paging="{ajaxLoadingFunctionName}" data-max="{totalCount}" data-pages="{totalPage}" data-size="{pageSize}" data-current="{currentPage}"></ele>
<<<<<<< HEAD
* data-paging {function} 页面跳转请求函数，用于传递参数从新从服务器获取新的页面数据; 默认参数(page, pageSize, $el, cb)，函数需要绑定到window对象
=======
* data-paging {function} 页面跳转请求函数，用于传递参数从新从服务器获取新的页面数据; 默认参数(page, pageSize, $el, cb)
>>>>>>> origin/zhy
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
<<<<<<< HEAD
		self.opt.pages = self.opt.pages || Math.round(self.opt.max / self.opt.size + 0.5) || 0;
=======
>>>>>>> origin/zhy
		self.init(self.opt);
		return self;
	};

	paging.prototype.init = function(opt){
		var self = this;
<<<<<<< HEAD
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
=======
		var pageMap = {
			max: opt.pages || Math.round(opt.max / opt.size + 0.5),
			current: opt.current
		}
		self.$el.html(self.render(pageMap));
	};
	/**
	* 渲染控件
>>>>>>> origin/zhy
	*/
	paging.prototype.render = function(it) {
		var arr = [];
		arr.push('	<ul class="paginator clearfix">');
<<<<<<< HEAD
		arr.push('		<li class="page page-prev"><i class="iconfont">&#xe601;</i></li>');
=======
		arr.push('		<li class="page"><i class="iconfont">&#xe601;</i></li>');
>>>>>>> origin/zhy
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
<<<<<<< HEAD
		arr.push('		<li class="page page-next"><i class="iconfont">&#xe670;</i></li>');
		arr.push('		<li class="page-jump-area"><span>到第</span> <input type="text" class="input-text"> <span>页</span> <a class="button">确定</a></li>');
=======
		arr.push('		<li class="page"><i class="iconfont">&#xe670;</i></li>');
>>>>>>> origin/zhy
		arr.push('	</ul>');
		return arr.join('');
	};
	/**
<<<<<<< HEAD
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
=======
	* 前一页
	*/
	paging.prototype.prev = function(argument){
		
	};
	/**
	* 后一页
	*/
	paging.prototype.next = function(){
		
	};
	/**
	* 指定页
	*/
	paging.prototype.direct = function(){
		
	};
	/**
	* 回调匿名函数
	*/
	paging.prototype.anonymous = function() {
		
>>>>>>> origin/zhy
	};

	var internal = {
		onFocused: function(n, m) {
			return n == m ? ' focus' : '';
		},
		renderNormal: function(num) {
<<<<<<< HEAD
			return '		<li class="page page-item" data-page="{0}">{0}</li>'.format(num);
=======
			return '		<li class="page">{0}</li>'.format(num);
>>>>>>> origin/zhy
		},
		renderFull: function(min, max, cur) {
			var arr = [];
			for(var i = min; i <= max; i++) {
<<<<<<< HEAD
				arr.push('		<li class="page page-item{0}" data-page="{1}">{1}</li>'.format(internal.onFocused(i, cur), i));
			}
			return arr.join('');
		},
		empty: function(p, s, e, cb) {
			cb();
=======
				arr.push('		<li class="page{0}">{1}</li>'.format(internal.onFocused(i, cur), i));
			}
			return arr.join('');
>>>>>>> origin/zhy
		}
	}
})(jQuery);






