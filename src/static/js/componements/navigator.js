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
		self.$msg = $('#messagePanel');
		self.$msgCounter = $('#msgCounter');
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
		
		self.$panel.on('click', '.navEvt', function() {
			var $this = $(this),
				key = $this.data('id');
			var fn = NavComponent.internal[key];
			if(fn) { fn.apply(null, $this); }
		})

		self.$panel.find('.user-li').on('mouseenter', function() {
			var $that = $(this);
			var item = $that.data('item');
			$that.find('.'+item+'-area').toggle();
			if(item == 'message') {
				self.showMessage();
			}
		}).on('mouseleave', function() {
			var $that = $(this);
			var item = $that.data('item');
			$that.find('.'+item+'-area').toggle();
		})
		self.$msg.on('click', '.msgEvt', function() {
			if(!self.message) return;
			var idx = $(this).data('idx');
			var item = self.message.items[idx];
			if(item.taskId) {
				$.ajax({
					url: $http.api('busiMsg/getLoanTaskId', 'test'),
					data: {
						orderNo: item.orderNo
					},
					success: $http.ok(function(response) {
						redirect.toLoanProcess(response.data);
					})
				})
			} else {
				router.render('message/detail', {
					id: item.id,
					status: item.status
				})	
			}
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

	NavComponent.prototype.setMessage = function(data, size) {
		this.message = {
			items: data,
			size: size
		}
		this.$msgCounter.html(this.message.size)
	}

	NavComponent.prototype.showMessage = function() {
		var self = this;
		if(!self.message) {
			return self.$msg.html('<li class="message-item clearfix">暂无消息</li>');
		}
		var arr = [];
		for(var i = 0; i < self.message.items.length; i++) {	
			var row = self.message.items[i];
			var date = new Date(row.createDate);
			arr.push(templateMsg.format(i, row.title, [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'), row.status));
		}
		self.$msg.html(arr.join(''));
		self.$msg.append('<li class="message-item clearfix"><a href="#message" class="message-more">更多&gt;&gt;</a></li>')
	}
	var templateMsg = '<li class="message-item clearfix">\
							<div class="message-item-data">\
								<a class="msgEvt" data-idx="{0}">{1}</a>\
							</div>\
							<span class="message-time">{2}</span>\
						</li>';

	function setPhone($dialog, cb) {
		var phone = $dialog.find('#phone').val(),
			code = $dialog.find('#code').val();
		var $err = $dialog.find('.color-red');
		if(!phone || !code) {
			$err.html('请输入手机号码和手机验证码');
			return false;
		};
		$.ajax({
			url: $http.api('mobile/bind', 'test'),
			data: {
				mobile: phone,
				code: code
			},
			dataType: 'json',
			success: function(xhr) {
				if(!xhr.code) {
					$.alert({
						title: '成功',
						content: '<div class="dialog-input-form">手机绑定成功</div>',
						buttons: {ok: {text: '确定', action: function() {
							Cookies.set('_hr_phone', phone);
							navInstance.info.phone = phone;
							navInstance.__compile();
						}}}
					})
					return cb(true);
				} else {
					$err.html(xhr.msg || '手机绑定失败，请重试').show();
					return false;
				}
			},
			error: function() {
				$err.html('网络异常，手机绑定失败，请重试').show();
				return false;
			}
		})
		return false;
	}

	function unbindPhone($dialog, phone, cb) {
		var self = $dialog;
		var code = $.trim(self.find('.input-text').val());
		var $err = $dialog.find('.color-red');
		if(!code) return false;
		$.ajax({
			url: $http.api('mobile/unBind', 'test'),
			data: {
				mobile: phone,
				code: code
			},
			global: false,
			dataType: 'json',
			success: function(xhr) {
				if(!xhr.code)
					return cb(true);
				else {
					$err.html(xhr.msg || '手机验证失败');
					return false;
				}
			},
			error: function() {
				$err.html('验证失败，请重试');
				return false;
			}
		})
		return false;
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
			url: $http.api('password/change', 'test'),
			data: {
				password: md5(ov),
				newPassword: md5(nv),
				confirmNewPassword: md5(rv)
			},
			dataType: 'json',
			success: function(xhr) {
				if(!xhr.code) {
					$.alert({
						title: '成功',
						content: '<div class="dialog-input-form">密码修改成功，请重新登录</div>',
						autoClose: 'ok|3000',
						buttons: {
							ok: { text: '确定', action: function() {
								navInstance.clear();
								location.href = 'login.html';
							}}
						}
					})
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
		getPhoneCode: function(phone, cf) {
			$.ajax({
				url: $http.api('sms/send', 'test'),
				type: 'post',
				global: false,
				data: {
					businessKey: 'bindMobile',
					mobile: phone
				},
				dataType: 'json',
				success: $http.ok(function(xhr) {
					if(!xhr.code) {
						cf();
					} else {
						$.alert({
							title: '错误',
							content: '<div class="dialog-input-form">验证码发送失败，请重试</div>',
							buttons: {ok:{text:'确定'}}
						})
					}
				})
			})
		},
		bind: function() {
			$.confirm({
				title: '绑定手机号码',
				content: 'url:./defs/phone.html',
				onContentReady: function() {
					var self = this.$content,
						$err = self.find('.color-red');
					self.find('#codeCountDown').on('click', function() {
						var $this = this,
							$that = $(this);
						if($this.counter) return;
						var phone = self.find('#phone').val();
						if(!phone) {
							return $err.html('请输入手机号码').show();
						}
						NavComponent.internal.getPhoneCode(phone, function() {
							var counter = 60;
							$this.counter = setInterval(function() {
								$that.html(counter + 's后重新获取');
								counter--;
								if(counter == 0) {
									$that.html('获取验证码');
									clearInterval(self.counter);
									$this.counter = null;
								}
							}, 1000);
						});
					})
				},
				buttons: {
					ok: {
						text: '确定',
						action: function() {
							var self = this;
							return setPhone(self.$content, function(status) {
								!!status && self.close();
							});
						}
					}
				}
			})
		},
		change: function(phone) {
			var p = $(phone).data('phone');

			function _gc(phone) {
				$.ajax({
					url: $http.api('sms/send', 'test'),
					type: 'post',
					global: false,
					data: {
						businessKey: 'changeMobile',
						mobile: phone
					},
					dataType: 'json',
					success: $http.ok(function(xhr) {
						if(!xhr.code) {
							cf();
						} else {
							$.alert({
								title: '错误',
								content: '<div class="dialog-input-form">验证码发送失败，请重试</div>',
								buttons: {ok:{text:'确定'}}
							})
						}
					})
				})
			}

			function _ct($ctn) {
				
			}
			
			_gc(p);

			function cf() {
				$.confirm({
					title: '修改手机号码',
					content:'url:./defs/phone.modify.html',
					onContentReady: function() {
						var self = this;
						self.$content.find('#phoneNumber').html(p);
						var $cd = self.$content.find('#codeCountDown'),
							counter = 60;
						$cd[0].counter = setInterval(function() {
							$cd.text(counter + 's后重新获取');
							counter--;
							if(counter == 0) {
								clearInterval($cd[0].counter);
								$cd[0].counter = null;
								$cd.html('获取验证码');
							}
						}, 1000);
						$cd.on('click', function() {
							if(this.counter) return false;
							_gc(p);
						})
					},
					buttons: {
						ok: {
							text: '确定',
							action: function() {
								var self = this;
								return unbindPhone(self.$content, p, function(status) {
									!!status && self.close();
									Cookies.remove('_hr_phone');
									delete navInstance.info.phone
									navInstance.__compile();
									NavComponent.internal.bind();
								});
							}
						},
						cancel: {
							text: '取消',
							btnClass: 'btn-cancel'
						}
					}
				})
			}
		},
		password: function() {
			$.confirm({
				title: '修改密码',
				content: 'url:./defs/password.html',
				buttons: {
					cancel: {
						text: '取消',
						btnClass: 'btn-default btn-cancel'
					},
					ok: {
						text: '确定',
						action: function() {
							var self = this;
							return updatePassword(this.$content, function(status) {
								if(status)
									self.close();
							});
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
