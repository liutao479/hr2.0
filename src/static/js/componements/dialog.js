//弹窗 所需要的
var wDialog = {};
wDialog.alert = function(msg, cb) {
	var template = '<div class="ngdialog ngdialog-theme-alert">\
					<div class="ngdialog-overlay"></div>\
					<div class="ngdialog-content">\
						'+msg+'<div class="ngdialog-close"></div>\
					</div>\
				</div>';
	var $dialog = $(template).appendTo('body');
	var $dialog_close = $dialog.find('.ngdialog-close');
	$dialog_close.on('click', function() {
		if(cb && typeof cb == 'function')
			cb();
		$dialog.remove();
	})
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
