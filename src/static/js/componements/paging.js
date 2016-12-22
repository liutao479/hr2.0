'use strict';
/**
* jQuery分页控件
* 使用方式 $(element).paging()
* <ele data-paging="{ajaxLoadingFunctionName}" data-max="{totalCount}" data-pages="{totalPage}" data-size="{pageSize}" data-current="{currentPage}"></ele>
* data-paging {function} 页面跳转请求函数，用于传递参数从新从服务器获取新的页面数据; 默认参数(page, pageSize, $el, cb)
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
		self.init(self.opt);
		return self;
	};

	paging.prototype.init = function(opt){
		var self = this;
		var pageMap = {
			max: opt.pages || Math.round(opt.max / opt.size + 0.5),
			current: opt.current
		}
		self.$el.html(self.render(pageMap));
	};
	/**
	* 渲染控件
	*/
	paging.prototype.render = function(it) {
		var arr = [];
		arr.push('	<ul class="paginator clearfix">');
		arr.push('		<li class="page"><i class="iconfont">&#xe601;</i></li>');
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
		arr.push('		<li class="page"><i class="iconfont">&#xe670;</i></li>');
		arr.push('	</ul>');
		return arr.join('');
	};
	/**
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
		
	};

	var internal = {
		onFocused: function(n, m) {
			return n == m ? ' focus' : '';
		},
		renderNormal: function(num) {
			return '		<li class="page">{0}</li>'.format(num);
		},
		renderFull: function(min, max, cur) {
			var arr = [];
			for(var i = min; i <= max; i++) {
				arr.push('		<li class="page{0}">{1}</li>'.format(internal.onFocused(i, cur), i));
			}
			return arr.join('');
		}
	}
})(jQuery);






