'use strict';
(function(g) {
	/**
	* 窗口面板内容模板
	* key:  窗口内容名
	* value: 窗口内容模板
	*/
	g.dialogTml = {};
	g.dialogTml.wContent = {
		back: '<div class="w-content">\
					<textarea name="" id="suggestion" cols="5" rows="5" class="remarks-box" placeholder="在此处填写处理意见"></textarea>\
					{{ for(var i = 0, len = it.length; i < len; i++) { var row = it[i]; }}\
					<div class="w-select-area mt15 clearfix">\
						<div class="w-select clearfix">\
							<div class="checkbox checkbox-radio" data-checked="false" data-id="{{=row.id}}"></div>\
							<div class="w-select-item">退回至{{=row.jumpName}}</div>\
						</div>\
						{{ for(var j = 0, len2 = row.jumpReason.length; j < len2; j++) { }}\
						<div class="w-select w-select-left clearfix">\
							<div class="checkbox checkbox-normal" data-checked="false" data-value="{{=row.jumpReason[j]}}"></div>\
							<div class="w-select-item">{{=row.jumpReason[j]}}</div>\
						</div>\
						{{ } }}\
					</div>\
					{{ } }}\
				</div>',
		handelSuggestion: '<div class="w-content"><div class="w-text">请填写处理意见！</div></div>',
		complete: '<div class="w-content"><div class="w-text">请完善必填项！</div></div>',
		suggestion: '<div class="w-content">\
						<textarea name="" id="suggestion" cols="5" rows="5" class="remarks-box" placeholder="在此处填写处理意见"></textarea>\
					</div>',
		loanOrderApply: '<div class="w-content">\
							<textarea name="" id="suggestion" cols="5" rows="5" class="remarks-box" placeholder="在此处填写处理意见"></textarea>\
							<dl class="w-dropdown">\
								<dt class="dt">请选择审核人：</dt>\
								<dd class="dd">\
									<div class="select select-bank" id="approvalUser" data-selected="" data-dropdown="page.$scope[\'{0}\'].approvalUserPicker" data-trigger="page.$scope[\'{0}\'].dropdownTrigger.approvalUser"></div>\
								</dd>\
							</dl>\
						</div>',
		applyModify: '<div class="w-content">\
							<dl class="w-dropdown">\
								<dt class="dt">请选择审核人：</dt>\
								<dd class="dd">\
									<div class="select select-bank" id="approvalUser" data-selected="" data-dropdown="page.$scope[\'{0}\'].approvalUserPicker" data-trigger="page.$scope[\'{0}\'].dropdownTrigger.approvalUser"></div>\
								</dd>\
							</dl>\
						</div>',
		creditQuery: '<div class="w-content">\
						<dl class="w-dropdown">\
							<dt class="dt">经办银行：</dt>\
							<dd class="dd">\
								<div class="select select-bank" id="demandBank" data-dropdown="page.$scope[\'{0}\'].demandBankPicker" data-trigger="page.$scope[\'{1}\'].dropdownTrigger.demandBank" data-selected="{2}"></div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">业务发生地：</dt>\
							<dd class="dd">\
								<div class="select select-bank select-two-tab" id="areaSource" data-tabs="省|市" data-dropdown="page.$scope[\'{0}\'].areaSourcePicker" data-trigger="page.$scope[\'{1}\'].dropdownTrigger.areaSource" data-selected="{3}"></div>\
							</dd>\
						</dl>\
					</div>',
		addCreditUsers: '<div class="w-content">\
							<div class="w-add clearfix">\
								<div class="w-select clearfix">增加征信人员：</div>\
								<div class="w-select clearfix">\
									<div class="checkbox checkbox-normal" data-checked="true" data-type="1"></div>\
									<span class="w-select-item">反担保人</span>\
								</div>\
								<div class="w-select clearfix">\
									<div class="checkbox checkbox-normal" data-type="2"></div>\
									<span class="w-select-item">共同还款人</span>\
								</div>\
							</div>\
						</div>',
		makeLoan: '<div class="w-content">\
						<dl class="w-dropdown">\
							<dt class="dt">用款时间：</dt>\
							<dd class="dd">\
								<div class="input-text input-date">\
									<input id="loaningDate" type="text" class="dateBtn" readonly="readonly" value="{{=it.loaningDateStr || \"\"}}" />\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">垫资金额：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="paymentMoney" value="{{=it.paymentMoney || \"\"}}"><span class="unit">元</span>\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">收款账户名称：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveCompanyAddress" value="{{=it.receiveCompanyAddress || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">收款账户：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccount" value="{{=it.receiveAccount || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">开户行：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccountBank" value="{{=it.receiveAccountBank || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
					</div>',
		zxdzContent: '<div class="w-content">\
						<dl class="w-dropdown">\
							<dt class="dt">用款时间：</dt>\
							<dd class="dd">\
								<div class="input-text input-date">\
								<input type="text" class="dateBtn" data-max="dateEnd" readonly="readonly" value="{{=it.date}}" />\
							</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">垫资金额：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="paymentMoney" value="{{=it.paymentMoney || ""}}"><span class="unit">元</span>\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">收款账户名称：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveCompanyAddress" value="{{=it.receiveCompanyAddress || ""}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">收款账户：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccount" value="{{=it.receiveAccount || ""}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">开户行：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccountBank" value="{{=it.receiveAccountBank || ""}}">\
								</div>\
							</dd>\
						</dl>\
						<textarea name="" id="suggestion" cols="5" rows="5" class="remarks-box" placeholder="在此处填写处理意见"></textarea>\
					</div>',
		ptsqdzContent: '<div class="w-content">\
						<dl class="w-dropdown">\
							<dt class="dt">用款时间：</dt>\
							<dd class="dd">\
								<div class="input-text input-date">\
								<input type="text" class="dateBtn" data-max="dateEnd" readonly="readonly" value="{{=it.date}}" />\
							</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">垫资金额：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="paymentMoney" value="{{=it.paymentMoney || ""}}"><span class="unit">元</span>\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">收款账户名称：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveCompanyAddress" value="{{=it.receiveCompanyAddress || ""}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">收款账户：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccount" value="{{=it.receiveAccount || ""}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown">\
							<dt class="dt">开户行：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccountBank" value="{{=it.receiveAccountBank || ""}}">\
								</div>\
							</dd>\
						</dl>\
						<textarea name="" id="suggestion" cols="5" rows="5" class="remarks-box" placeholder="在此处填写处理意见"></textarea>\
					</div>',
		viewFee: '<div class="w-content">\
					<table border="0" cellpadding="" width="100%" class="orders-table orders-table-borders">\
						<thead>\
							<tr class="orders-bar-title">\
								<td class="orders-item-data">序号</td>\
									<td class="orders-item-data">新手车/二手车</td>\
									<td class="orders-item-data">省份</td>\
									<td class="orders-item-data">12期利率</td>\
									<td class="orders-item-data">18期利率</td>\
									<td class="orders-item-data">24期利率</td>\
									<td class="orders-item-data">30期利率</td>\
									<td class="orders-item-data">36期利率</td>\
									<td class="orders-item-data">48期利率</td>\
									<td class="orders-item-data">60期利率</td>\
							</tr>\
						</thead>\
						<tbody class="tbody">\
							{{for(var j = 0, len2 = it.length; j < len2; j++) { var col = it[j]; }}\
								{{ if(j % 2 !== 0) { }}\
								<tr class="orders-item tr-even">\
								{{ } else if(j % 2 == 0 && j == 0) { }}\
								<tr class="orders-item tr-odd tr-noborder">\
								{{ } else { }}\
								<tr class="orders-item tr-odd">\
								{{ } }}\
									<td class="orders-item-data">{{=(j + 1)}}</td>\
									<td class="orders-item-data">{{=(col.isSecond == 0 ? \"新车\" : \"二手车\")}}</td>\
									<td class="orders-item-data">{{=col.provinceName}}</td>\
									<td class="orders-item-data">{{=col.interestRate12}}%</td>\
									<td class="orders-item-data">{{=col.interestRate18}}%</td>\
									<td class="orders-item-data">{{=col.interestRate24}}%</td>\
									<td class="orders-item-data">{{=col.interestRate30}}%</td>\
									<td class="orders-item-data">{{=col.interestRate36}}%</td>\
									<td class="orders-item-data">{{=col.interestRate48}}%</td>\
									<td class="orders-item-data">{{=col.interestRate60}}%</td>\
								</tr>\
							{{ } }}\
						</tbody>\
					</table>\
				</div>',
		btngroup:'{{ for(var i=0;i<it.length;i++){var col=it[i]; }}\
				{{ if(col.checkStatus==0){ }}\
					<div class="block-item-data" data-index="{{=i}}">{{=col.funcName}}</div>\
				{{ }else{ }}\
					<div class="block-item-data not-selected">{{=col.funcName}}</div>\
				{{ } }}\
			{{ } }}',
		userBtnGroup:'{{ for(var i=0;i<it.length;i++){var col=it[i]; }}\
				{{ if(col.checkStatus!="1"){ }}\
					<div class="block-item-data" data-index="{{=i}}">{{=col.userName}}({{=col.userTypeName}})</div>\
				{{ }else{ }}\
					<div class="block-item-data not-selected">{{=col.userName}}({{=col.userTypeName}})</div>\
				{{ } }}\
			{{ } }}',
		serviceItems:'<div class="serviceItems">\
			<ul class="clearfix">\
				{{ for(var i=0;i<it.length;i++){var col=it[i]; }}\
				<li>{{ if(col.isBank){ }}<div class="text-bt">银行</div>{{ } }}\
					<div class="serviceContext clearfix">\
						<p class="text-icon"><span class="{{=col.class}}"><i class="iconfont">{{=col.icon}}</i></span></p>\
						<p class="text-name">{{=col.funcName}}\
						{{ if(col.checkStatus==0){ }}<span class="text-status text-orange">未查</span></p></div><div class="serviceBtn bacStart nextDialog" data-index="{{=i}}">发起核查</div>\
						{{ }else if(col.checkStatus==1||!col.checkStatus){ }}<span class="text-status text-orange">未查</span></p></div><div class="serviceBtn inoperable">缺少相关数据</div>\
						{{ }else if(col.checkStatus==2){ }}<span class="text-status text-orange">查询中</span></p></div><div class="serviceBtn inoperable">发起核查</div>\
						{{ }else if(col.checkStatus==3){ }}<span class="text-status text-green">已查</span></p></div><div class="serviceBtn bacAgain nextDialog" data-index="{{=i}}">再次核查</div>\
						{{ } }}</li>\
				{{ } }}\
			</ul>\
			<p class="tip">提示：带有“<span class="textfe5a58">银行</span>”标记的服务表示业务经办银行要求核查的服务项目，系统会在条件满足的情况下自动完成核查。</p>\
		</div>',
		allCreditDownload: '<div class="w-content w-content-padding">\
								<div class="w-download-area">\
									<div class="w-download-title">\
										选择下载内容\
									</div>\
									<div class="w-download">\
										<div class="w-radio">\
											<div class="checkbox checkbox-radio checked" data-checked="true" data-type="1"></div>\
											<i class="iconfont i-download">&#xe624;</i>\
											<span class="w-select-item">PDF下载</span>\
										</div>\
										<div class="w-radio">\
											<div class="checkbox checkbox-radio" data-checked="false" data-type="2"></div>\
											<i class="iconfont i-download">&#xe64c;</i>\
											<span class="w-select-item">WORD下载</span>\
										</div>\
										<div class="w-radio">\
											<div class="checkbox checkbox-radio" data-checked="false" data-type="3"></div>\
											<i class="iconfont i-download">&#xe675;</i>\
											<span class="w-select-item">ZIP下载</span>\
										</div>\
									</div>\
								</div>\
							</div>',
		selectTemplate: '<div class="w-content">\
							<dl class="w-dropdown">\
								<dt class="dt">请选择需要套打的合同模板：</dt>\
								<dd class="dd">\
									<div class="select select-bank" data-placeholder="请选择" data-dropdown="page.$scope[\'loadArchiveDownload\'].templatePicker" data-trigger="page.$scope[\'loadArchiveDownload\'].dropdownTrigger.template"></div>\
								</dd>\
							</dl>\
						</div>',
		loanDownload: '<div class="w-content">\
						<div class="w-download-area">\
							<div class="w-download-title">选择下载内容</div>\
							<div class="w-download clearfix">\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false" >\
									</div>\
									<span class="w-select-item">征信材料</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">贷款信息表</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">二手车评估信息</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">贷款材料</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">签约材料</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">提车材料</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">上门材料</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">登记证材料</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">合同套打</span>\
								</div>\
								<div class="w-select float-left mr24 clearfix">\
									<div class="checkbox checkbox-normal" data-checked="false"></div>\
									<span class="w-select-item">核心系统信息表</span>\
								</div>\
							</div>\
						</div>\
					</div>',
		selfAdvance: '<div class="w-content clearfix">\
						<dl class="w-dropdown float-left">\
							<dt class="dt">打款单位名称：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveCompany" data-key="receiveCompany" data-type="accountName" value="{{=it.receiveCompany || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">账号：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccount" data-key="receiveAccount" data-type="accountNumber" value="{{=it.receiveAccount || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">账户：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccountName" data-key="receiveAccountName" data-type="accountName" value="{{=it.receiveAccountName || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">开户行：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="receiveAccountBank" data-key="receiveAccountBank" data-type="accountName" value="{{=it.receiveAccountBank || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">垫资时间：</dt>\
							<dd class="dd">\
								<div class="input-text input-date">\
									<input id="loaningDate" type="text" class="dateBtn" data-key="loaningDate" data-type="yymmddhhmm" readonly="readonly" value="{{=it.loaningDate || \"\"}}" />\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">打款金额：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="paymentMoney" data-key="paymentMoney" data-type="money" value="{{=it.paymentMoney || \"\"}}"><span class="unit">元</span>\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">垫资开户银行：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="advanceBank" data-key="advanceBank" data-type="accountName" value="{{=it.advanceBank || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">垫资账户：</dt>\
							<dd class="dd">\
								<div class="input-text input-text-mini">\
									<input type="text required" id="advanceAccount" data-key="advanceAccount" data-type="accountName" value="{{=it.advanceAccount || \"\"}}">\
								</div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">垫资凭证：</dt>\
							<dd class="dd">\
								<div class="imgs-item-group uploadEvt" data-deletecb="page.$scope[\'lendAudit\'].deletecb" data-uploadcb="page.$scope[\'lendAudit\'].uploadcb" data-card="true" data-id="" data-orderno="123" data-code="cardUpd" data-name="电子回单" data-scene="homeMaterialsUpload" data-img="{{= it.advanceCertificate || \'\'}}" data-err="0" data-editable="1"></div>\
							</dd>\
						</dl>\
						<dl class="w-dropdown float-left">\
							<dt class="dt">审核意见：</dt>\
							<dd class="dd">\
								<textarea id="suggestion" class="remarks-box-mini" placeholder="在此处填写处理意见"></textarea>\
							</dd>\
						</dl>\
					</div>'
	}
	g.dialogTml.wCommit = {
		sure: '<div class="w-commit-area">\
				<div class="button">确定</div>\
			</div>',
		cancelSure: '<div class="w-commit-area">\
				<div class="button button-empty w-close">取消</div><div class="button button-mini w-sure">确定</div>\
			</div>',
		cancelNext: '<div class="w-commit-area">\
				<div class="button button-empty w-close">取消</div><div class="button button-mini w-next">下一步</div>\
			</div>',
		sure: '<div class="w-commit-area">\
				<div class="button w-sure">确定</div>\
			</div>'
	}
	g.dialogTml.wRemind = {
		addCreditUsers: '<div class="w-remind">\
							<span class="tips"><i class="iconfont">&#xe67f;</i></span>\
							提示：更改后，订单将被退回到征信材料上传节点。\
						</div>'
	}
})(window);