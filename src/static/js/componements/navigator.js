'use strict';
$(function() {
	var NavComponent = function() {
		var self = this;
		self.init();
	}
	/**
	* 初始化
	*/
	NavComponent.prototype.init = function() {
		var self = this;
		self.$panel = $('#navigator');
		self.$user = self.$panel.find('#userPanel');
		self.template = self.$user.html();
		self.__signature();
		self.__compile();
		self.__addListener();
	}
	/**
	* 设置授权信息
	*/
	NavComponent.prototype.__signature = function(refresh) {
		if(!Cookies) {
			return false;
		}
		var self = this;
		var _info = this.info = {
			account: Cookies.get('_hr_account'),
			dept: Cookies.get('_hr_dept'),
			role: Cookies.get('_hr_role'),
			phone: Cookies.get('_hr_phone'),
			name: Cookies.get('_hr_name'),
			token: Cookies.get('_hr_token')
		}
		if(!_info.token || !_info.account) {
			return self.showModal();
		}
		self.__setAjax();
	}

	NavComponent.prototype.__setAjax = function() {
		$.ajaxSetup({
			headers: {
				'Authorization' : 'Bearer ' + this.info.token
			}
		});
	}
	/**
	* 构造用户信息
	*/
	NavComponent.prototype.__compile = function() {
		var self = this;
		self.$user.html(doT.template(self.template)(self.info));
		self.$user.find('.drop-down-box').show();
	}
	
	/**
	* 监听事件
	*/
	NavComponent.prototype.__addListener = function() {
		var self = this;
		
		self.$panel.find('.navEvt').on('click', function() {
			var $this = $(this),
				key = $this.data('id');
			var fn = NavComponent.internal[key];
			if(fn) { fn.apply(); }
		})

		self.$panel.find('.user-li').on('mouseenter', function() {
			var $that = $(this);
			var item = $that.data('item');
			$that.find('.'+item+'-area').toggle();
		}).on('mouseleave', function() {
			var $that = $(this);
			var item = $that.data('item');
			$that.find('.'+item+'-area').toggle();
		})
	}

	NavComponent.prototype.clear = function () {
		Cookies.remove('_hr_token');
		Cookies.remove('_hr_dept');
		Cookies.remove('_hr_account');
		Cookies.remove('_hr_role');
		Cookies.remove('_hr_name');
		Cookies.remove('_hr_phone');
	}

	NavComponent.prototype.showModal = function() {
		var self = this;
		if(window.authorizationTiper) return false;
		var $diag = $.alert({
			title: '提示',
			boxWidth: 378,
			useBootstrap: false,
			title: '登录',
			content: '<div class="input-form">\
						<div class="err-tiper" style="height:30px;color:#f00; border: 1px solid #f00; text-align:center; border-radius:3px; margin: 5px 0 20px 0; line-height:28px; display: none;"></div>\
						<input type="text" class="input-text account" style="margin-top: 0;" placeholder="请输入账号" />\
						<input type="password" class="input-text password" style="margin-bottom: 5px;" placeholder="请输入密码" />\
					  </div>',
			buttons: {
				ok: {
					text: '确定',
					btnClass: 'btn-ok',
					action: function() {
						self.login($diag);
						return false;
					}
				},
				cancel: {
					text: '取消',
					btnClass: 'btn-danger',
					action: function () {
						location.href = 'login.html';
					}
				}
			}
		})
	}

	NavComponent.prototype.login = function($diag) {
		var self = this;
		var $acc = $diag.$content.find('.account'),
			$pwd = $diag.$content.find('.password'),
			$err = $diag.$content.find('.err-tiper');
		var acc = $.trim($acc.val()),
			pwd = $.trim($pwd.val());
		if(!acc || !pwd) {
			return $err.html('账号或密码不能为空').show();
		}
		$.ajax({
			url: $http.api('login/doLogin', true),
			type: 'post',
			dataType: 'json',
			data: {
				account: acc,
				password: md5(pwd),
				LoginAgent: 'WEB'
			},
			success: function(xhr) {
				if(xhr && !xhr.code) {
					var result = xhr.data;
					var token = result.token,
						info = result.loginInfo;
					Cookies.set('_hr_id', result.id);
					Cookies.set('_hr_bankCode', result.bankCode);
					Cookies.set('_hr_phone', result.phone);
					Cookies.set('_hr_dept', result.deptId);
					Cookies.set('_hr_name', result.name);
					Cookies.set('_hr_account', result.account);
					Cookies.set('_hr_token', result.token);
					location.href = location.href;
				} else {
					$err.html('登录失败，' + xhr.msg).show();
				}
			},
			error: function() {
				$err.html('网络异常，登录失败').show()
			}
		})
	}

	function setPhone() {

	}

	function updatePhone() {

	}

	function updatePassword($dialog, cb) {
		var self = $dialog;
		var $old = self.find('.old'),
			$new = self.find('.new'),
			$rnew = self.find('.renew'),
			$ctn = self.find('.dialog-input-form'),
			$err = self.find('.color-red');
		var ov = $.trim($old.val()),
			nv = $.trim($new.val()),
			rv = $.trim($rnew.val());
		function etip(msg) {
			$err.html(msg);
		}
		if(!ov || !nv || !rv) {
			etip('密码不能为空');
			return false;
		}
		if(ov == nv) {
			etip('新密码不能与旧密码相同');
			return false;
		}
		if(nv != rv) {
			etip('两次新密码输入不一致');
			return false;
		}
		$.ajax({
			url: $http.api('password/change'),
			data: {
				password: md5(ov),
				newPassword: md5(nv)
			},
			dataType: 'json',
			success: function(xhr) {
				if(!xhr.code) {
					return cb(true);
				} else {
					etip('修改密码失败，请重试');
					return false;
				}
			},
			error: function() {
				etip('网络异常，请稍后重试');
				return false;
			}
		})
		return false;
	}

	NavComponent.internal = {
		bind: function() {

		},
		change: function() {
			$.confirm({
				title: '修改手机号码',
				content:'url:./defs/phone.html',
				buttons: {

				}
			})
		},
		password: function() {
			$.confirm({
				title: '修改密码',
				content: 'url:./defs/password.html',
				buttons: {
					ok: {
						text: '确定',
						action: function() {
							var self = this;
							return updatePassword(this.$content, function(status) {
								if(status)
								self.close();
							});
						}
					},
					cancel: {
						text: '取消',
						action: function() {

						}
					}
				}
			})
		},
		exit: function() {
			$.ajax({
				url: $http.api('logout', true),
				type: 'post',
				dataType: 'json',
				data: {
					token: navInstance.info.token
				},
				success: $http.ok(function(xhr) {
					console.log(xhr)
					navInstance.clear();
					window.location.href = 'login.html';
				})
			})
		}
	}

	window.navInstance = new NavComponent();
})
