'use strict';
(function($, _){
    $.fn.openWindow = function(options, cb) {
        return this.each(function() {
            var that = $(this);
            this.$openWindow = new openWindow(that, options, cb);
        });
    }

    function openWindow($el, options, cb) {
    	var self = this;
    	self.opts = $.extend({}, $.fn.openWindow.defaults, options);
    	self.$el = $el;
    	self.init();
        if(self.opts.addFunction){
            self.opts.addFunction();
        };
        if(cb && typeof cb == 'function') {
        	cb(self.$dialog);
        }
    }

    // 初始化窗口
    openWindow.prototype.init = function() {
    	var self = this;
        self.$dialog = $(_.template(dialogTml)(self.opts)).prependTo("body");
        self.$content = self.$dialog.find('.w-content');
        if(self.opts.move) {
            self.move();
        }
        if(self.opts.content) {
            self.render();
            if(self.opts.commit) {
                $(_.template(self.opts.commit)(self.opts)).appendTo(self.$content);
            }
            if(self.opts.remind) {
                $(_.template(self.opts.remind)(self.opts)).insertBefore(self.$content);
            }
        }

        self.close();
    }

    // 窗口关闭
    openWindow.prototype.close = function() {
    	var self = this;
    	self.$dialog.delegate('.w-close', 'click', function() {
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
    	$(_.template(self.opts.content)(self.opts.data)).prependTo(self.$content);
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
        data:{},
		addFunction: function(){}
    };
})(jQuery, doT);

