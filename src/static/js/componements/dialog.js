// //弹窗 所需要的
// var wDialog = {};
// wDialog.alert = function(msg, cb) {
// 	var template = '<div class="window">\
// 		<div class="w-title">\
// 			<div class="w-title-content">'+ msg +'</div>\
// 			<div class="w-close"><i class="iconfont">&#xe65a;</i></div>\
// 		</div>\
// 		<div class="w-content">\
// 			<dl class="w-dropdown">\
// 				<dt>请选择需要套打的合同模板：</dt>\
// 				<dd>\
// 					<select name="" id="">\
// 						{{ for(var i = 0, len = it.length; i < len; i++) { var row = it[i]; }}\
// 						<option>{{=it.fileName}}</option>\
// 						{{ } }}\
// 					</select>\
// 				</dd>\
// 			</dl>\
// 			<div class="w-commit-area">\
// 				<div class="button button-empty">取消</div><div class="button">确定</div>\
// 			</div>\
// 		</div>\
// 	</div>';
// 	var $dialog = $('<div class="dialog" id="dialog"></dialog>').appendTo('body');
	


// 	if(cb && typeof cb == 'function')
// 		cb();
// }
// wDialog.confirm = function(msg, opt) {
// 	if(!opt) opt = {};
// 	var template = '<div class="ngdialog ngdialog-theme-confirm">\
// 			<div class="ngdialog-overlay"></div>\
// 			<div class="ngdialog-content">\
// 				<div>'+msg+'</div>\
// 				<div class="ngdialog-close"></div>\
// 				<a class="ngdialog-confirm-btn">确认</a>\
// 			</div>\
// 		</div>';
// 	var $dialog = $(template).appendTo('body');
// 	var $dialog_close = $dialog.find('.ngdialog-close'),
// 		$dialog_confirm = $dialog.find('.ngdialog-confirm-btn');
// 	$dialog_close.on('click', function() {
// 		if(opt.cancel && typeof opt.cancel == 'function')
// 			opt.cancel();
// 		$dialog.remove();
// 	})
// 	$dialog_confirm.on('click', function() {
// 		if(opt.confirm && typeof opt.confirm == 'function')
// 			opt.confirm();
// 		$dialog.remove();
// 	})
// }
// wDialog.showConfirm = function(msg, opt) {
// 	if(!opt) opt = {};
// 	var template = '<div class="ngdialog ngdialog-theme-confirm">\
// 			<div class="ngdialog-overlay"></div>\
// 			<div class="ngdialog-content">\
// 				<div>'+msg+'</div>\
// 			</div>\
// 		</div>';
// 	var $dialog = $(template).appendTo('body');
// 	var $dialog_close = $dialog.find('.ngdialog-close'),
// 		$dialog_confirm = $dialog.find('.ngdialog-confirm-btn');
// }

(function($, _){
    $.fn.openWindow = function(options,callback) {
        return this.each(function() {
            var that = $(this);
            that.$openWindow = new openWindow(that, options);
        });
    }

    function openWindow($el, options) {
    	var self = this;
    	self.opts = $.extend({}, $.fn.openWindow.defaults, options)
    	self.$el = $el;
    	self.init();
    }

    // 初始化窗口
    openWindow.prototype.init = function() {
    	var self = this;
    	self.$dialog = $(_.template(dialogTml)(self.opts)).prependTo("body");
    	self.$content = self.$dialog.find('.w-content');
    	self.close();
    	if(self.opts.move) {
    		self.move();
    	}
    	if(self.opts.html) {
    		self.render();
    	}
    }

    // 窗口关闭
    openWindow.prototype.close = function() {
    	var self = this;
    	self.$dialog.find('.w-close').on('click', function() {
    		self.$dialog.remove();
    	})
    }

    // 窗口移动
    openWindow.prototype.move = function() {
    	var self = this;
    	self.$dialog.find('.w-close').on('click', function() {
    		self.$dialog.remove();
    	})
    	self.$dialog.find('.w-title').on('mousedown', function(e) {
 			/*$(this)[0].onselectstart = function(e) { return false; }*///防止拖动窗口时，会有文字被选中的现象(事实证明不加上这段效果会更好)   		
    		$(this)[0].oncontextmenu = function(e) { return false; }//防止右击弹出菜单
    		var getStartX = e.pageX,
                getStartY =  e.pageY;
            var getPositionX = $('.window').offset().left,
                getPositionY = $('.window').offset().top;
            $(document).on("mousemove",function(e){
                var getEndX = e.pageX,
                    getEndY =  e.pageY;
                $('.window').css({
                    left: getEndX-getStartX+getPositionX,
                    top: getEndY-getStartY+getPositionY
                });
            });
            $(document).on("mouseup",function(){
                $(document).unbind("mousemove");
            })
    	})
    }

    // 窗口内容渲染
    openWindow.prototype.render = function() {
    	var self = this;
    	console.log($(_.template(self.opts.html)))
    	// $(_.template(self.opts.html)).prependTo(self.$content);
    }


	var dialogTml = '<div class="dialog">\
						<div class="window">\
							<div class="w-title">\
								<div class="w-title-content">{{=it.title}}</div>\
								<div class="w-x w-close"><i class="iconfont">&#xe65a;</i></div>\
							</div>\
							<div class="w-content">\
							</div>\
						</div>\
					</div>';


    $.fn.openWindow.defaults = {
        html: "",
        move: false,
		bgClose: false,
		addFunction: function(){}
    };
})(jQuery, doT);

