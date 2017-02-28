'use strict';
(function(g) {
	/**
	* 窗口面板内容模板
	* key:  窗口内容名
	* value: 窗口内容模板
	*/
	g.dialogTml = {};
	g.dialogTml.wContent = {
		suggestion: '<textarea name="" id="suggestion" cols="5" rows="5" class="remarks-box" placeholder="在此处填写申请理由"></textarea>',
		creditQuery: '<dl class="w-dropdown">\
				<dt>经办银行：</dt>\
				<dd>\
					<span class="select select-bank">\
						<input class="placeholder" placeholder="请选择" />\
						<span class="arrow arrow-bottom"></span>\
					</span>\
				</dd>\
			</dl>\
			<dl class="w-dropdown">\
				<dt>业务发生地：</dt>\
				<dd>\
					<span class="select select-bank">\
						<input class="placeholder" placeholder="请选择" />\
						<span class="arrow arrow-bottom"></span>\
					</span>\
				</dd>\
			</dl>',
		addCreditUsers: '<div class="w-add clearfix">\
				<div class="w-select clearfix">增加征信人员：</div>\
				<div class="w-select clearfix">\
					<div class="checkbox checkbox-normal" data-checked="true" name="addCreditUsers" data-type="1"></div>\
					<span class="w-select-item">反担保人</span>\
				</div>\
				<div class="w-select clearfix">\
					<div class="checkbox checkbox-normal"  name="addCreditUsers" data-type="2"></div>\
					<span class="w-select-item">共同还款人</span>\
				</div>\
			</div>'
	}
	g.dialogTml.wCommit = {
		sure: '<div class="w-commit-area">\
				<div class="button">确定</div>\
			</div>',
		cancelSure: '<div class="w-commit-area">\
				<div class="button button-empty w-close">取消</div><div class="button w-sure">确定</div>\
			</div>',
		cancelNext: '<div class="w-commit-area">\
				<div class="button button-empty w-close">取消</div><div class="button w-next">下一步</div>\
			</div>'
	}
	g.dialogTml.wRemind = {
		addCreditUsers: '<div class="w-remind">\
							<span class="tips"><i class="iconfont">&#xe67f;</i></span>\
							提示：更改后，订单将被退回到征信材料上传节点。\
						</div>'
	}
})(window);