(function(g, tpl) {
	g.render.def.location = tpl;
})(window, 
'<div class="path-back-bar">\
	<div class="path-back">\
		<i class="iconfont">&#xe626;</i>\
		<a href="#" data-href="{{=it.backspace}}">返回列表</a>&nbsp;&gt;\
		<span class="current-page">{{=it.current}}</span>\
	</div>\
	{{ if(it.loanUser) { }}\
	<div class="key-value-box">\
		<span class="key">借款人：</span>\
		<span class="value">{{=it.loanUser}}</span>\
	</div>\
	{{ } }}\
	<div class="key-value-box">\
		<span class="key">订单生成时间：</span>\
		<span class="value">{{=it.orderDate}}</span>\
	</div>\
</div>');