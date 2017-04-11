/**
 * Description: cardry.datepicker.js
 * Modified by: 
 * Modified contents: 
**/
if(typeof WdatePicker == 'undefined'){
	
	document.write('<script type="text/javascript" src="../dist/static/js/vendor/WdatePicker.js"><\/script>');
	
}

(function($){
	
	$.fn.datepicker = function(opts){
		
		opts = $.extend({}, {
			
			eventType: 'click',
			
			errDealMode: 1,
			
			qsEnabled: false,
			
			readOnly: true
			
		}, opts);
		
		return this.each(function(){
			var target = $(this), div, input, icon;
			var io = target.data();
			var internalOpts = $.extend({}, opts);
			if(io.min) {
				internalOpts.minDate = "#F{$dp.$D("+io.min+")}";
			}
			if(io.max) {
				internalOpts.maxDate = "#F{$dp.$D("+io.max+")}";
			}
			
			if(target.is('div')){
				div = target;
				
				// 文本框
				input = $(':text', div);
				
				// 为文本框赋值id属性
				input.attr('id', div.attr('id') + '-text');
				
				// 图标
				icon = $('i.ui-text-date', div);
				
			}else if(target.is(':text')){
				
				div = target.parent();
				
				// 文本框
				input = target;
				
				// 图标
				icon = input.next('i.ui-text-date');
				
			}
			
			div.addClass('ui-datepicker');
			
			var id = input.attr('id');
			
			if(id){
				
				// 文本框触发日历控件
				input[internalOpts.eventType](function(){
					
					// 隐藏或清除其他控件
//					cardry.controls.hide();
					
					// 设置 el 参数，指定文本框用于存储日历值
					internalOpts['el'] = input.attr('id');
					WdatePicker(internalOpts);
					
				});
				
				// 图标触发日历控件
				icon.click(function(){
					
					// 隐藏或清除其他控件
//					cardry.controls.hide();
					
					// 设置 el 参数，指定文本框用于存储日历值
					internalOpts['el'] = input.attr('id');
					WdatePicker(internalOpts);
					
				});
				
			}
			
		});
		
	};
	
})(jQuery);
