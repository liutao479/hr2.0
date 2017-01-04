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
			$el.html('<select></select>');
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