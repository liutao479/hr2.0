//弹窗 所需要的
var wDialog = {};
wDialog.alert = function(msg, cb) {
	var template = '<div class="dialog"><div class="window">\
		<div class="w-title">\
			<div class="w-title-content">退回</div>\
			<div class="w-close"><i class="iconfont">&#xe65a;</i></div>\
		</div>\
		<div class="w-content">\
			<textarea name="" id="" cols="5" rows="5" class="remarks-box" placeholder="在此处填写意见"></textarea>\
			<!-- 选择区域 -->\
			<div class="w-select-area clearfix">\
				<div class="w-select">\
					<div class="checkbox checkbox-normal checked" checked="checked" >\
						<i class="iconfont">&#xe659;</i>\
					</div>\
					<span class="w-select-item">材料不全或不合规</span>\
				</div>\
				<div class="w-select">\
					<div class="checkbox checkbox-normal"></div>\
					<span class="w-select-item">其他</span>\
				</div>\
			</div>\
			<!-- 提交区域 -->\
			<div class="w-commit-area">\
				<div class="button button-empty">取消</div><div class="button">确定</div>\
			</div>\
		</div>\
	</div></div>';
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
