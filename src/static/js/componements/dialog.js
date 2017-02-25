//弹窗 所需要的
var wDialog = {};
wDialog.alert = function(msg, cb) {
	var template = '<div class="window">\
		<div class="w-title">\
			<div class="w-title-content">'+ msg +'</div>\
			<div class="w-close"><i class="iconfont">&#xe65a;</i></div>\
		</div>\
		<div class="w-content">\
			<dl class="w-dropdown">\
				<dt>请选择需要套打的合同模板：</dt>\
				<dd>\
					<select name="" id="">\
						{{ for(var i = 0, len = it.length; i < len; i++) { var row = it[i]; }}\
						<option>{{=it.fileName}}</option>\
						{{ } }}\
					</select>\
				</dd>\
			</dl>\
			<div class="w-commit-area">\
				<div class="button button-empty">取消</div><div class="button">确定</div>\
			</div>\
		</div>\
	</div>';
	var $dialog = $('<div class="dialog" id="dialog"></dialog>').appendTo('body');
	


	if(cb && typeof cb == 'function')
		cb();
}
wDialog.confirm = function(msg, opt) {
	if(!opt) opt = {};
	var template = '<div class="ngdialog ngdialog-theme-confirm">\
			<div class="ngdialog-overlay"></div>\
			<div class="ngdialog-content">\
				<div>'+msg+'</div>\
				<div class="ngdialog-close"></div>\
				<a class="ngdialog-confirm-btn">确认</a>\
			</div>\
		</div>';
	var $dialog = $(template).appendTo('body');
	var $dialog_close = $dialog.find('.ngdialog-close'),
		$dialog_confirm = $dialog.find('.ngdialog-confirm-btn');
	$dialog_close.on('click', function() {
		if(opt.cancel && typeof opt.cancel == 'function')
			opt.cancel();
		$dialog.remove();
	})
	$dialog_confirm.on('click', function() {
		if(opt.confirm && typeof opt.confirm == 'function')
			opt.confirm();
		$dialog.remove();
	})
}
wDialog.showConfirm = function(msg, opt) {
	if(!opt) opt = {};
	var template = '<div class="ngdialog ngdialog-theme-confirm">\
			<div class="ngdialog-overlay"></div>\
			<div class="ngdialog-content">\
				<div>'+msg+'</div>\
			</div>\
		</div>';
	var $dialog = $(template).appendTo('body');
	var $dialog_close = $dialog.find('.ngdialog-close'),
		$dialog_confirm = $dialog.find('.ngdialog-confirm-btn');
}
