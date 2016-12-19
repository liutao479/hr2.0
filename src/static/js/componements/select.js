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

$(function(){
	$('.select').hrSelect();
})


function Button(obj) {
    this.id = "";
    this.text = "确定";
    this.appendTo = "";
    this.state = "normal";
    this.self = null;
    this.events = null;

    //组建
    this.initComponent = function(){
        this.id = obj.id || this.id;
        this.text = obj.text || this.text;
        this.appendTo = obj.appendTo || this.appendTo;
        this.events = obj.events;
        this.renderer();
        this.stateFn(obj.state || this.state);
        this.addEventListener();
    },
    //初始化（渲染）
    this.renderer = function(){
        var btn = document.createElement("div");
        btn.className = "btn " + this.state;
        btn.id = this.id;
        btn.innerHTML = this.text;
        document.getElementById(this.appendTo).appendChild(btn);
        this.self = btn;
    };

    this.show = function(){
        this.self.style.display = "block";
    };
    this.hide = function(){
        this.self.style.display = "none";
    };

    //不传的时候 表getState;
    // 传参的时候 表示setState
    this.stateFn = function(state){
        // set
        if (state) {
            this.state = state;
            this.self.className = "btn " + this.state;
            this.addEventListener();
            //get
        } else {
            return this.state;
        }
    };
    this.css = function(obj){
        for ( var i in obj ) {
            this.self.style[i] = obj[i];
        }
    };
    this.addEventListener = function() {
        var _this = this;
        if( this.state == "disabled") {
            for(var i in this.events) {
                this.self["on" + i] = null;
            }
        } else {
            for (var i in this.events) {
                this.self["on" + i] = _this.events[i];
            }
        }
    }
    this.initComponent();
}
var btn1 = new Button({
    id : "btn1",
    text : "申请贷款",
    appendTo : "container",
    events : {
        "click" : function(){
            console.log(this);
            console.log("click");
        },
        "mouseover" : function(){
            console.log("mouseover");
            console.log(this);
        }
    }
});

var btn2 = new Button({
    id : "btn2",
    text : "放款预约",
    appendTo : "container",
    events : {
        "click" : function(){
            console.log(this);
            console.log("click");
        },
        "mouseover" : function(){
            console.log("mouseover");
            console.log(this);
        }
    }
});
btn2.css({
	"margin-left":"10px"
})




//btn1.hide();
