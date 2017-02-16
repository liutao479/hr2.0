'use strict';
/**
* 图片上传组件
* usage: <element data-code="" data-type="" data-scene="" data-user="" data-owner=""></element>
*/
(function($) {
	$.fn.imgUpload = function(opts) {
		return this.each(function() {
			var $self = $(this);
			$self.$imgUpload = new imgUpload($self, opts, $self.data());
		})
	}

	/**
	* 上传类
	* @params {object} opts 公共配置项
	* @params {object} params 渲染参数对象
	*/
	var imgUpload = function($el, opts, params) {
		var def = {
			no: undefined,
			code: undefined,
			type: 0,
			scene: undefined,
			user: undefined,
			owner: undefined
		}
		var self = this;
		self.$el = $el;
		self.options = $.extend(def, opts, params);
		self.init();
	}

	imgUpload.prototype.init = function() {
		//
		this.$widge = '';
		this.listen();
	};

	imgUpload.prototype.listen = function() {
		var self = this;
		self.$el.find('input.input-file').on('change', function() {
			self.onUpload();
		});
	};

	imgUpload.prototype.onUpload = function() {
		
	};

})(jQuery);