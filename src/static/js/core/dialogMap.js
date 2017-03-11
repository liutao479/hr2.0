'use strict';
(function(g) {
	/**
	* 窗口面板内容模板
	* key:  窗口内容名
	* value: 窗口内容模板
	*/
	g.dialogTml = {};
	g.dialogTml.wContent = {
		suggestion: '<textarea name="" id="suggestion" cols="5" rows="5" class="remarks-box" placeholder="在此处填写处理意见"></textarea>',
		loanOrderApply: '<textarea name="" id="suggestion" cols="5" rows="5" class="remarks-box" placeholder="在此处填写处理意见"></textarea>\
						<dl class="w-dropdown">\
							<dt>请选择审核人：</dt>\
							<dd>\
								<span class="select select-bank">\
									<input class="placeholder" placeholder="请选择" />\
									<span class="arrow arrow-bottom"></span>\
								</span>\
							</dd>\
						</dl>',
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
								<div class="checkbox checkbox-normal" data-checked="true" data-type="1"></div>\
								<span class="w-select-item">反担保人</span>\
							</div>\
							<div class="w-select clearfix">\
								<div class="checkbox checkbox-normal" data-type="2"></div>\
								<span class="w-select-item">共同还款人</span>\
							</div>\
						</div>',
		makeLoan: '<dl class="w-dropdown">\
						<dt>用款时间：</dt>\
						<dd>\
							<span class="select select-bank">\
								<input class="placeholder required" placeholder="请选择" id="loaningDate" value="{{=(it.loaningDate ? tool.formatDate(it.loaningDate) : "")}}" />\
								<span class="arrow arrow-bottom"></span>\
							</span>\
						</dd>\
					</dl>\
					<dl class="w-dropdown">\
						<dt>垫资金额：</dt>\
						<dd>\
							<div class="input-text input-text-mini">\
								<input type="text required" id="paymentMoney" value="{{=it.paymentMoney || ""}}"><span class="unit">元</span>\
							</div>\
						</dd>\
					</dl>\
					<dl class="w-dropdown">\
						<dt>收款账户名称：</dt>\
						<dd>\
							<div class="input-text input-text-mini">\
								<input type="text required" id="receiveCompanyAddress" value="{{=it.receiveCompanyAddress || ""}}">\
							</div>\
						</dd>\
					</dl>\
					<dl class="w-dropdown">\
						<dt>收款账户：</dt>\
						<dd>\
							<div class="input-text input-text-mini">\
								<input type="text required" id="receiveAccount" value="{{=it.receiveAccount || ""}}">\
							</div>\
						</dd>\
					</dl>\
					<dl class="w-dropdown">\
						<dt>开户行：</dt>\
						<dd>\
							<div class="input-text input-text-mini">\
								<input type="text required" id="receiveAccountBank" value="{{=it.receiveAccountBank || ""}}">\
							</div>\
						</dd>\
					</dl>'
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