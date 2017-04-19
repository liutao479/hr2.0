/** 
 * 模仿android里面的Toast效果，主要是用于在不打断程序正常执行的情况下显示提示数据 
 * @param config 
 * @return 
 */  
'use strict';
(function(_) {
    var toast = function() {
        this.def = {
            opacity: .7,
            zIndex: 99999999
        }
        this.__init();
    }

    toast.prototype.__init = function() {
        this.background = '<div style="position: fixed; left: 50%; top: 50%; width:300px; margin-left: -150px; z-index:{1}; border-radius:2px; background-color: #000; opacity: {0};"></div>';
        this.content = '<div style="position: fixed; left: 50%; top: 50%; padding: 20px; color: #fff; line-height: 22px; z-index:{0};">{1}</div>';
        this.$el = $('body');
    }

    toast.prototype.__setup = function(msg, opts) {
        var self = this;
        opts = $.extend(self.def, opts);
        self.$background = $(self.background.format(opts.opacity, opts.zIndex)).appendTo(self.$el);
        self.$content = $(self.content.format(opts.zIndex+1, msg)).appendTo(self.$el);
        var width = self.$content.width() + 40;
        if(width > 300) {
            width = 300;
        }
        self.$content.css({
            width: width + 'px',
            marginLeft: -width/2 + 'px'
        });
        var height = self.$content.height() + 40;
        self.$background.css({
            height: height + 'px',
            marginTop: -height/2 +'px'
        });
        self.$content.css({
            marginTop: -height/2 + 'px'
        });
    }

    toast.prototype.show = function(msg, opts, callback) {
        var self = this;
        self.__setup(msg, opts || {});
        setTimeout(function() {
            self.close();
            callback && typeof callback == 'function' && callback();
        }, opts.timeout || 1500);
    }

    toast.prototype.close = function() {
        this.$background.remove();
        this.$content.remove();
    }

    var _toast = new toast();

    _.toast = function(msg, opts, callback) {
        if(typeof opts == 'function') {
            callback = opts;
            opts = {};
        }
        _toast.show(msg, opts, callback);
    }
})(jQuery);

/*
var Toast = function(config){  
    this.context = config.context==null?$('body'):config.context;//上下文  
    this.message = config.message;//显示内容  
    this.time = config.time==null?3000:config.time;//持续时间  
    this.left = config.left;//距容器左边的距离  
    this.top = config.top;//距容器上方的距离  
    this.init();  
}  
var msgEntity;  
Toast.prototype = {  
    //初始化显示的位置内容等  
    init : function(){  
        $("#toastMessage").remove();  
        //设置消息体  
        var msgDIV = new Array();  
        msgDIV.push('<div id="toastMessage" style="border-radius:18px;-moz-opacity:0.6;opacity:0.6;">');  
        msgDIV.push('<span>'+this.message+'</span>');  
        msgDIV.push('</div>');  
        msgEntity = $(msgDIV.join('')).appendTo(this.context);  
        //设置消息样式  
        var left = this.left == null ? this.context.width()/2-msgEntity.find('span').width()/2 : this.left;  
        var top = this.top == null ? '20px' : this.top;  
        msgEntity.css({position:'absolute',bottom:top,'z-index':'99',left:left,'background-color':'black',color:'white','font-size':'15px',padding:'10px',margin:'10px'});  
        msgEntity.hide();  
    },  
    //显示动画  
    show :function(){  
        msgEntity.fadeIn(this.time/2);  
        msgEntity.fadeOut(this.time/2);  
    }  
          
}  
*/
    // new Toast({context:$('body'),message:'Toast效果显示'}).show();    