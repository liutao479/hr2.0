'use strict';
/**
* 图片上传组件
* usage: <element data-orderno="订单号" 
* 				data-id="材料id" 
* 				data-code="材料code" 
* 				data-name="材料名称" 
* 				data-type="材料类型" 
* 				data-scene="场景编码" 
* 				data-user="所属用户ID" 
* 				data-owner="所属用户类型" 
* 				data-img="已上传的图片地址" 
* 				data-editable="是否可编辑" 
* 				data-msg="退回原因" 
* 				data-err="图片不清晰/图片错误"
* 				data-getimg="图片预览外部事件句柄"
* 				data-request="征信材料图片上传" 
* 				data-creditid="征信人id" 
* 				data-uplUrl="特殊材料上传url"
* 				data-delUrl="特殊材料删除url"
* 				data-materialspic="征信报告照片"
* 				data-thumbnailpic="征信报告缩略图照片"
* 				data-materialsAduitResult="",
*				data-materialsAduitOpinion="图片意见">
* 		</element>
*/
(function($) {
	$.fn.imgUpload = function(opts) {
		return this.each(function() {
			var $self = $(this);
			$self.$imgUpload = new imgUpload($self, opts, $self.data());
		})
	}

	/**
	* 上传类
	* @params {object} opts 公共配置项
	* 		--opts: {string} url 提交地址，如果需要特定的地址，则需要传入
	*		--viewable: default false
	* @params {object} params 渲染参数对象
	*/
	var imgUpload = function($el, opts, params) {
		var def = {
			orderno: undefined,		//订单编号
			code: undefined,	//材料编码
			id: undefined,  //材料id
			creditid: undefined, //征信报告上传的对应人creditId
			request: undefined, //特殊图片的请求回调函数函数
			name: undefined,
			type: 0,	//0 图片；1 视频
			scene: undefined,	//场景名称
			user: undefined,	//材料所属用户
			owner: undefined,	//材料所属类型
			img: undefined,	//图片地址
			msg: undefined,	//退回消息
			err: undefined,	//错误类型 0 正常 ；1 图片不清晰；2 图片错误
			editable: undefined,
			url: undefined,
			deletecb: $.noop,
			uploadcb: $.noop,
			viewable: false,
			markable: false
		}
		var self = this;
		self.$el = $el;
		self.options = $.extend(def, opts, params);
		if(!self.options.orderno && !self.options.scene) return false;
		self.init();
	}

	imgUpload.prototype.init = function() {
		var self = this,
			tmp;
		self.errImg = '';
		self.errMsg = '';
		self.empty = !self.options.empty ? '<i class="is-empty">*</i>' : '';
		if(!self.options.img || self.options.img == 'undefined') {
			if(self.options.editable) {
				if(self.options.other) {
					self.name = internalTemplates.other.format(self.options.name, self.empty);
				} else {
					self.name = internalTemplates.name.format(self.options.name, self.empty);
				}
				tmp = internalTemplates.edit.format(self.name);
				self.status = 0;
			} else {
				if(self.options.other) {
					self.name = internalTemplates.name.format(self.options.name, self.empty);
				} else {
					self.name = internalTemplates.name.format(self.options.name, self.empty);
				}
				tmp = internalTemplates.blank.format(self.name);
				self.status = 2;
			}
			
		} else {
			if(self.options.editable) {
				if(self.options.err != undefined) {
					self.errImg = imgs[self.options.err];
				}
				if(self.options.msg && self.options.msg != 'undefined') {
					self.errMsg = internalTemplates.msg.format(self.options.msg);
				}
				if(self.options.other) {
					self.name = internalTemplates.other.format(self.options.name, self.empty);
				} else {
					self.name = internalTemplates.name.format(self.options.name, self.empty);
				}
				tmp = internalTemplates.modify.format(self.name, self.options.img, self.errImg, self.errMsg);
				self.status = 1;
			} else {
				if(self.options.err != undefined) {
					self.errImg = imgs[self.options.err];
				}
				if(self.options.msg && self.options.msg != 'undefined') {
					self.errMsg = internalTemplates.msg.format(self.options.msg);
				}
				self.name = internalTemplates.name.format(self.options.name, self.empty);
				tmp = internalTemplates.view.format(self.name, self.options.img || '', self.errImg, self.errMsg);
				self.status = 2;
			}
		}
		self.delCb = $.noop;
		self.uplCb = $.noop;
		if(self.options.deletecb) {
			try {
				self.delCb = eval(self.options.deletecb);
			} catch(e) {
				self.delCb = $.noop;
			}
			if(typeof self.delCb != 'function') {
				self.delCb = $.noop;
			}
		}
		if(self.options.uploadcb) {
			try {
				self.uplCb = eval(self.options.uploadcb);
			} catch(e) {
				self.uplCb = $.noop;
			}
			if(typeof self.uplCb != 'function') {
				self.uplCb = $.noop;
			}
		}
		self.$el.html(tmp);
		self.outerHTML = self.$el.prop("outerHTML");
		this.listen();
	};
	/**
	* 初始化事件
	*/
	imgUpload.prototype.listen = function() {
		var self = this;
		if(self.status != 2) {
			self.$el.find('.activeEvt').on('change', function() {
				// console.log(this.files[0])
				// console.log(this.value.split("\\\\"));
				if(!this.files[0]) {
					return false;
				}
				if(self.options.type == 0) {
					var name = this.files[0].name.substring(this.files[0].name.lastIndexOf('.') + 1).toLowerCase();
					if(name != 'gif' && name != 'jpg' && name != 'jpeg' && name != 'png' && name != 'tif') {
						$.alert({
							title: '提示',
							content: tool.alert('请选择正确的图片格式的文件进行上传!'),
							buttons: {
								ok: {
									text: '确定'
								}
							}
						})
						return false;
					}
				}
				if(self.options.type == 1) {
					var name = this.files[0].name.substring(this.files[0].name.lastIndexOf('.') + 1).toLowerCase();
					if(name != 'rm' && name != 'rmvb' && name != 'wmv' && name != 'avi' && name != 'mp4' && name != '3gp' && name != 'mkv') {
						$.alert({
							title: '提示',
							content: tool.alert('请选择正确的视频格式的文件进行上传!'),
							buttons: {
								ok: {
									text: '确定'
								}
							}
						})
						return false;
					}
				}
				self.$el.find('.imgs-error').remove();
				self.onUpload(this.files[0]);
			});
			self.$el.find('.imgs-input-text input').on('blur', function() {
				var newVal = $(this).val().trim();
				if(newVal == self.options.name) {
					return false;
				}
				self.options.name = newVal;
				self.name = internalTemplates.other.format(self.options.name);
				self.$el.data('name', self.options.name);
				if(self.options.img) {
					console.log(self.options.img)
					self.saveImage(self.options.img);
				}				
			})
		}
		if(self.status == 1) {
			self.$el.find('.imgs-delete').on('click', function() {
				self.onDelete();
			});	
		}
		self.$el.find('.viewEvt').on('click', function() {
			if(!self.options.viewable) return;
			var loadImg, marker;
			try {
				loadImg = eval(self.options.getimg);
				marker = eval(self.options.marker);
				onclose = eval(self.options.onclose);
			} catch(e) {
				loadImg = $.noop;
				marker = undefined;
			}
			loadImg(function(imgs) {
				new Preview(imgs, marker, self.options.onclose || $.noop, {
					markable: self.options.markable
				});
			})
		})
	};

	/**
	* 图片上传
	* @params {object} file 要上传的文件
	*/
	imgUpload.prototype.onUpload = function(file) {
		var self = this;
		self.$el.find('.imgs-item-upload').LoadingOverlay("show");
		imgUpload.getLicense(self.options.type, function(res) {
			if(!res) {
				throw "can not get the license";
			}
			var suffix = file.name.substr(file.name.lastIndexOf('.'));
			var key = res.dir + md5(res.signature) + suffix;
			// var key = res.dir  + file.name;
			var fd = new FormData();
			fd.append('OSSAccessKeyId', res.accessId);
			fd.append('policy', res.policy);
			fd.append('Signature', res.signature);
			fd.append('key', key);
			fd.append('file', file, file.name);
			fd.append('success_action_status', 200);
			self.doUpload(res.host, fd);
		})
	};
	/**
	* 删除图片
	*/
	imgUpload.prototype.onDelete = function() {
		var self = this;
		var params = {};
		var _url = '';
		if(self.options.id == undefined) {
			return false;
		}
		params.id = self.options.id;
		// 删除征信材料或者其他材料
		if(self.options.request) {
			_url = api.creditUpload;
		} else if(self.options.other) {
			// params.sceneCode = self.options.scene;
			_url = api.otherDel;
		} else if(self.options.card) {
			self.delCb(self);
			self.$el.html(internalTemplates.edit.format(self.name));
			self.status = 0;
			self.listen();			
//			self.$el.find('#imgUrl').val('');
			return false;
		} else if(self.options.credit) {
			
		} else {
			params.sceneCode = self.options.scene;
			_url = api.del;
		}
		if(self.options.delUrl) {
			_url = self.options.delUrl;
		}
		console.log(params)
		$.ajax({
			url: _url,
			type: 'post',
			data: params,
			dataType: 'json',
			success: function(xhr) {
				console.log(xhr)
				if(!xhr.code) {
					self.delCb(self, xhr);
					self.$el.html(internalTemplates.edit.format(self.name));
					self.status = 0;
					self.listen();			
				}
			}
		});
	};
	/**
	* 保存图片
	* @params {string} url 图片地址
	*/
	imgUpload.prototype.saveImage = function(url) {
		var self = this;
		var params = {};
		var _url = '';
		if(self.options.request) {
			if(self.options.id) {
				params.id = self.options.id;
			}
			if(self.options.thumbnailpic) {
				params.thumbnailPic = self.options.thumbnailpic;
			}
			if(self.options.materialsaduitresult) {
				params.materialsAduitResult = self.options.materialsaduitresult;
			}
			if(self.options.materialsaduitopinion) {
				params.materialsAduitOpinion = self.options.materialsaduitopinion;
			}
			params.orderNo = self.options.orderno;
			params.creditId = self.options.creditid;
			params.materialsPic = url;
			_url = api.creditUpload;
		} else if(self.options.other) {
			if(self.options.name) {
				params.materialsName = self.options.name;
			}
			if(self.options.id) {
				params.id = self.options.id;
			}
			params.orderNo = self.options.orderno;
			params.materialsType = self.options.type;
			params.sceneCode = self.options.scene;
			params.materialsPic = url;
			_url = api.otherUpload;
		} else {
			if(self.options.orderno) {
				params.orderNo = self.options.orderno;
			}
			if(self.options.user) {
				params.userId = self.options.user;
			}
			if(self.options.owner) {
				params.ownerCode = self.options.owner;
			}
			params.materialsCode = self.options.code;
			params.materialsType = self.options.type;
			params.sceneCode = self.options.scene;
			params.materialsPic = url;
			_url = api.upload;
		}
		if(self.options.uplUrl) {
			_url = self.options.uplUrl;
		}
		console.log(params);
		$.ajax({
			url: _url,
			data: params,
			type: 'post',
			global: false,
			dataType: 'json',
			success: function(xhr) {
				console.log(xhr);
				self.$el.find('.imgs-item-upload').LoadingOverlay("hide");
				if(!xhr.code) {					
					if(self.status != 1) {
						self.$el.html(internalTemplates.modify.format(self.name, url, self.errImg, self.errMsg));
						if(self.options.credit) {
							self.options.id = xhr.data.id;
						} else {
							self.options.id = xhr.data;
						}
						self.$el.data('img', url);
						self.status = 1;	
						self.listen();
						self.uplCb(self, xhr);
					} else {
						if(self.options.credit) {
							self.options.id = xhr.data.id;
						} else {
							self.options.id = xhr.data;
						}
						self.$el.data('img', url);
						self.$el.find('img').attr('src', url);
						self.uplCb(self, xhr);
					}
					
				}
			}
		})
	}
	/**
	* 获取上传授权信息
	* @params {int} type 选项
	* @params {function} cb 回调函数
	*/
	imgUpload.getLicense = function (type, cb) {		
		$.ajax({
			global: false,
			url: type == 1 ? api.video : api.img,
			dataType: 'json'
		}).done(function(response) {
			if(!response.code) {
				cb(response.data);
			} else {
				cb(false);
			}
		});
	}
	/**
	* 执行图片上传
	*/
	imgUpload.prototype.doUpload = function(host, fd) {
		var self = this;
		$.ajax({
			url: host,
			data: fd,
			type: 'post',
			processData: false,
			dataType: 'xml',
			contentType: false,
			global: false,
			success: function(response) {
				var _url = host + '/' + fd.get('key');
				self.options.img = _url;
				if(self.options.card){
					self.$el.find('.imgs-item-upload').LoadingOverlay("hide");
					if(self.status != 1) {
						self.$el.html(internalTemplates.modify.format(self.name,self.url));
//						self.$el.data('img', url);
						self.status = 1;	
						self.listen();
						self.$el.find('img').attr('src',_url);
						self.uplCb(self, response);
					} else {
						if(self.options.credit) {
							self.options.id = response.data.id;
						} else {
							self.options.id = response.data;
						}
						self.$el.find('img').attr('src',_url);
					}
					return false;
				}else{
					self.saveImage(_url);
				}
				
			}
		})
	}

	var imgs = [
		"",
		"<img class='imgs-error viewEvt' src='data:image/png;base64,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' />",
		"<img class='imgs-error viewEvt' src='data:image/png;base64,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' />"
	]

	var internalTemplates = {
		edit: '<div class="imgs-item-upload">\
				<div class="iconfont-upload"><i class="iconfont">&#xe61f;</i></div>\
				<span class="i-tips">点击上传图片</span>\
				<input type="file" class="input-file activeEvt" accept="image/gif,image/jpeg,image/jpg,image/png,image/tif" />\
			   </div>{0}',
		modify: '<div class="imgs-item-upload">\
				<div class="imgs-upload"><i class="iconfont">&#xe6ac;</i><input type="file" class="input-file activeEvt" title="重新上传" accept="image/gif,image/jpeg,image/jpg,image/png"/></div>\
				<div class="imgs-delete" title="删除"><i class="iconfont">&#xe602;</i></div>\
				<img src="{1}" class="imgs-view" />\
				{2}{3}</div>{0}',
		view: '<div class="imgs-item-upload">\
				<img src="{1}" class="imgs-view viewEvt" />\
			   {2}{3}</div>{0}',
		blank: '<div class="imgs-item-upload imgs-item-upload-blank">\
				<div class="iconfont-upload"><i class="iconfont">&#xe61f;</i></div>\
				<span class="i-tips">图片未上传</span>\
			   </div>{0}',
		msg: '<div class="imgs-describe">{0}</div>',
		name: '<span class="imgs-item-p">{1}{0}</span>',
		other: '<div class="input-text imgs-input-text">\
					<input type="text" value="{0}" />\
				</div>'
	}

	var api = {
		img: $http.api('oss/img/sign', 'cyj'),
		video: $http.api('oss/video/sign', 'cyj'),
		upload: $http.api('material/addOrUpdate', 'cyj'),
		del: $http.api('material/del', 'cyj'),
		creditUpload: $http.api('creditReport/reportUpd', 'jbs'),
		otherUpload: $http.api('otherMaterials/addOrUpdate', 'cyj'),
		otherDel: $http.api('otherMaterials/del', 'cyj')
	}

	/**
	* 图片预览
	* @params {array} imgs 图片对象集合
	*	[{id: '', tiele: '', origin: '', thumb: '', mark: '', reason: ''}]
	* @params {function} marker 标记后的回调
	* 	回调参数：img object
	*/
	function Preview(imgCollections, marker, onclose, opts) {
		var self = this;
		self.imgs = imgCollections || [];
		self.marker = marker;
		if(typeof onclose != 'function') { 
			opts = onclose;
			onclose = $.noop;
		}
		
		self.opts = $.extend({
			minWidth: 500,
			minHeight: 400,
			markable: false,
			idx: 0
		}, opts);
		if(!onclose) {
			onclose = $.noop;
		}
		self.onclose = onclose;
		self.size = {
			iw: 80,
			im: 8
		}
		self.runtime = {};
		self.tool = {};
		self.runtime.idx = self.opts.idx;
		self.runtime.leftItems = 0;
		self.init();
	}

	Preview.prototype.init = function() {
		var self = this;
		var dw = document.documentElement.clientWidth || document.documentElement.offsetWidth,
			dh = document.documentElement.clientHeight || document.documentElement.offsetHeight;
		self.runtime.vw = dw * 0.80;
		self.runtime.vh = dh * 0.80;
		if(self.runtime.vw < self.opts.minWidth || self.runtime.vh < self.opts.minHeight) {
			return $.alert({ title: '警告', content: '当前窗口过小，无法使用图片预览功能，请拉伸你的窗口', buttons: {ok: {text:'确定'}}});
		}
		self.setMask();
		self.setViewBox();
		self.setToolbar();
		self.setClose()
		self.listen();
	};

	/**
	* 设置遮罩层
	*/
	Preview.prototype.setMask = function() { 
		var self = this;
		self.$mask = $('<div style="position: fixed; left:0; top:0; bottom:0; right:0; background: #000; z-index:99999990; opacity:.3;filter:alpha(opacity=30);"></div>').appendTo('body');
	};
	/**
	* 设置显示框
	*/
	Preview.prototype.setViewBox = function() {
		var self = this;
		var items = self.runtime.items = parseInt((self.runtime.vw - 120) / (self.size.iw + self.size.im));
		var boxWidth = items * self.size.iw + (items -1) * self.size.im;

		var viewbox = '<div class="img-view-box" onselectstart="return false;" style="background: #000; position: fixed; z-index:99999999; width: '+self.runtime.vw+'px;height:'+self.runtime.vh+'px;border-raidus:3px;left:50%;top:50%;margin-left:-'+self.runtime.vw/2+'px;margin-top:-'+self.runtime.vh/2+'px;">\
							<div style="width:'+boxWidth+'px; position:relative; margin: 10px auto;height:'+(self.runtime.vh - self.size.iw - 30)+'px;overflow:hidden;" id="__move__trigger"><img ondragstart="return false" style="position: absolute; left:50%;top:50%; display:block; cursor:move; margin: 0 auto;" id="___originImage___" src="'+self.imgs[0].materialsPic+'" /></div>\
							<a class="prev big"></a><a class="next big"></a>\
							<div style="width:'+boxWidth+'px; position:relative; height:'+self.size.iw+'px;margin:0 auto; overflow: hidden;"><div id="___thumbnails___" style="width:'+items * (self.size.im + self.size.iw) + self.size.im +'px;position:absolute;left:0;top:0;"></div></div>\
							<a class="prev mini"></a><a class="next mini"></a>\
					   </div>';
		self.$preview = $(viewbox).appendTo('body');
		self.$itemBody = self.$preview.find('#___thumbnails___');
		var arr = [];
		for(var i = 0, len = self.imgs.length; i < len; i++) {
			var img = self.imgs[i],
				ml = i * self.size.im,
				mark = self.getMark(img.auditResult || img.aduitResult);
			if(ml > 0) ml = self.size.im;
			arr.push('<div data-idx="'+i+'" class="thumb-view" style="cursor: pointer; position:relative; float:left; width:'+self.size.iw+'px;height:'+self.size.iw+'px;margin-left:'+ml+'px;"><img src="'+img.materialsPic+'" style="width:100%; height:100%;" />'+mark+'</div>');
		}
		self.$items = $(arr.join('')).appendTo(self.$itemBody);
		self.$view = self.$preview.find('#___originImage___');
		self.$viewbox = self.$preview.find('#__move__trigger');
		self.$prev = self.$preview.find('.prev');
		self.$next = self.$preview.find('.next');
		self.setImage(self.imgs[self.runtime.idx]);
		self.$items.eq(self.runtime.idx).addClass('active');
	};
	/**
	* 构造工具条
	*/
	Preview.prototype.setToolbar = function() {
		var self = this;
		var toolbar = '<div style="position: absolute; left: 0; right:0; bottom:'+(self.size.iw + 20)+'px; background: #000; opacity: .7;height: 50px;"></div>\
					   <div style="position: absolute; left:20px; right:20px; color:#fff; bottom:'+(self.size.iw+20)+'px;height:50px;">\
					   		<span id="imgTitle" style="line-height:50px;font-weight:bold;"></span>\
					   		<div class="transform-bar">\
					   			<div class="zoom-bar" style="width:'+(self.runtime.vw - 370 > 270 ? 270 : 170)+'px;">\
					   				<span class="zoom-title">缩放</span>\
					   				<span class="zoom-track" style="width:'+(self.runtime.vw - 370 > 270 ? 200 : 100)+'px;"><span class="track-bar"></span><span class="track-thumb"></span></span>\
					   				<span class="zoom-scale">100%</span>\
					   			</div>\
					   			<a id="rotateImage">\
						   			<span class="iconfont">&#xe609;</span>\
						   			<span>旋转90°</span>\
					   			</a>\
					   		</div>\
					   		<div style="position:absolute;right:0; cursor:pointer; height: 30px;top:10px; line-height:30px; width: 120px; padding: 0 8px; border:1px solid #fff; border-radius:3px;" id="markdown">\
					   			<span id="remarkTitle">标记为...</span>\
					   			<span style="position:absolute; right:8px; top:12px; border-width:5px; border-style:solid dashed dashed dashed;border-color:#fff transparent transparent transparent;"></span>\
					   			<div id="markList" class="remark-list" style="display: none;">\
					   				<a data-id="0">清除标记</a>\
					   				<a data-id="1">图片上传错误</a>\
					   				<a data-id="2">图片不清晰</a>\
					   			</div>\
					   		</div>\
					   </div>';
		self.$toolbar = {};
		self.$toolbar.$root = $(toolbar).appendTo(self.$preview);
		self.$toolbar.$title = self.$toolbar.$root.find('#imgTitle');
		self.$toolbar.$mark = self.$toolbar.$root.find('#markdown');
		self.$toolbar.$remarkTitle = self.$toolbar.$root.find('#remarkTitle');
		self.$toolbar.$markList = self.$toolbar.$root.find('#markList');
		self.$toolbar.$rotate = self.$toolbar.$root.find('#rotateImage');
		self.$toolbar.$zoomTrack = self.$toolbar.$root.find('.zoom-track');
		self.$toolbar.$zoomThumb = self.$toolbar.$zoomTrack.find('.track-thumb');
		self.$toolbar.$zoomScale = self.$toolbar.$root.find('.zoom-scale');
		self.tool.zeroPoint = self.$toolbar.$zoomTrack.offset();
		self.tool.trackWidth = (self.runtime.vw - 370 > 270 ? 200 : 100);
		if(!self.opts.markable) {
			self.$toolbar.$mark.remove();
		}
	}
	/**
	* 设置关闭
	*/
	Preview.prototype.setClose = function() {
		var self = this;
		self.$close = $('<span style="position:absolute; right: -25px;top:-3px;display:block;text-align:center;line-height:20px;color:#fff;font-size:24px;cursor:pointer;">×</span>').appendTo(self.$preview)
	};
	/**
	* 获取对应的错误提示图片
	*/
	Preview.prototype.getMark = function(idx) {
		console.log(idx)
		var m = imgs[idx || 0];
		if(m != "") {
			m = "<div class='errHook'><div class='err-mask'></div>" + m + '</div>';
		}
		return m;
	}
	/**
	* 事件监听
	*/
	Preview.prototype.listen = function() {
		var self = this;
		if(!self.$preview) return false;
		self.$close.on('click', function() {
			self.close();
		})
		/**图片拖拽*/
		self.$view.on('mousedown', function() {
			self.tool.canDrag = true;
		})
		self.$viewbox.on('mousedown', function(evt) {
			if(!self.tool.canDrag) return;
			self.startPos = {
				x: evt.pageX,
				y: evt.pageY
			}

			var diff = {x: 0, y: 0};

			if(self.endPos) {
				diff = {
					x: self.endPos.x - self.originPos.x,
					y: self.endPos.y - self.originPos.y
				}
			}

			self.originPos = {
				x: self.startPos.x - diff.x,
				y: self.startPos.y - diff.y
			}
		})
		self.$viewbox.on('mouseup', function(evt) {
			if(!self.tool.canDrag) return;
			self.tool.canDrag = false;
			self.endPos = {
				x: evt.pageX,
				y: evt.pageY
			}
		})
		self.$viewbox.on('mouseleave', function(evt) {
			if(!self.tool.canDrag) return;
			self.tool.canDrag = false;
			self.endPos = {x: evt.pageX, y: evt.pageY};
		})
		self.$viewbox.on('mousemove', function(evt) {
			if(!self.tool.canDrag) return;
			self.move(evt);
		})
		//方向控制
		self.$prev.on('click', function() {
			self.prev();
		})
		self.$next.on('click', function() {
			self.next();
		})
		//操作组建
		self.$items.on('click', function() {
			var idx = $(this).data('idx');
			if(idx == self.runtime.idx) return;
			var img = self.imgs[idx];
			self.$items.eq(self.runtime.idx).removeClass('active');
			self.runtime.idx = idx;
			self.$items.eq(self.runtime.idx).addClass('active');
			self.setImage(img);
		})
		//标记
		self.$toolbar.$mark.on('click', function() {
			self.$toolbar.$markList.toggle();
		})
		self.$toolbar.$markList.find('a').on('click', function() {
			var $that = $(this),
				id = $that.data('id'),
				img = self.imgs[self.runtime.idx];
			if(id == img.auditResult) { self.$toolbar.$markList.hide(); return false; }
			
			function cb() {
				img.auditResult = id;
				var text = id == 0 ? '标记为...' : $that.html();
				self.$items.eq(self.runtime.idx).find('.errHook').remove();
				self.$items.eq(self.runtime.idx).append(self.getMark(img.auditResult));
				self.$toolbar.$remarkTitle.html(text);
				self.$toolbar.$markList.hide();
			}
			if(self.marker && typeof self.marker == "function") {
				self.marker(img, id, cb);
			} else { cb(); }
			
			return false;
		})
		self.$toolbar.$zoomTrack.on('mousemove', function(evt) {
			if(!self.tool.canZoom) return false;
			var xAxis = evt.pageX - self.tool.zeroPoint.left;
			if(xAxis >= self.tool.trackWidth) return self.tool.canZoom = false;
			var mod = 1 + xAxis / self.tool.trackWidth;
			var rate = mod.toFixed(2);
			if(xAxis > self.tool.trackWidth - 10) { 
				xAxis = self.tool.trackWidth - 10;
				rate = "2.00";
				mod = 2;
			}
			self.$toolbar.$zoomThumb.css({left: xAxis+'px'});
			self.$toolbar.$zoomScale.html(parseInt(mod * 100) + '%')
			console.log(rate)
			self.zoom(rate);
		})
		self.$toolbar.$zoomTrack.on('mouseleave mouseup', function(evt) {
			self.tool.canZoom = false;
		})
		self.$toolbar.$zoomThumb.on('mousedown', function(evt) {
			self.tool.canZoom = true;
		})
		self.$toolbar.$rotate.on('click', function() {
			self.tool.rotate = (self.tool.rotate || 0) + 90;
			if(self.tool.rotate == 360) self.tool.rotate = 0;
			self.transition('rotate({0}deg)'.format(self.tool.rotate), 'rotate');
		})
	};

	/**
	* 设置当前查看图片
	*/
	Preview.prototype.setImage = function(image) {
		var self = this;
		var img = new Image();
		img.src = image.materialsPic;
		img.onload = function() {
			self.reset();
			var size = { w: img.width, h: img.height };
			self.$view.css({
				marginLeft: -img.width/2 + 'px',
				marginTop: -img.height/2 + 'px'
			})
			self.$view.attr('src', image.materialsPic);
			img = null;
			self.setMark(image.auditResult);
			self.setTitle(image.materialsName);
		}
	}

	Preview.prototype.setTitle = function(t) {
		this.$toolbar.$title.html(t);
	}

	Preview.prototype.setMark = function(mark) {
		if(mark == undefined) mark = 0;
		var text = ['标记为...', '图片上传错误', '图片不清晰'][mark];
		this.$toolbar.$remarkTitle.html(text);
	}

	Preview.prototype.transition = function(transformer, type) {
		var self = this;
		if(!self.tool.transform) {
			self.tool.transform = transformer;
			self.$view.css({transform: transformer});
			return;
		}
		switch (type) {
			case 'move':
				self.tool.transform = self.tool.transform.replace(/(translate\((-?)\d+px,(-?)\d+px\))/g, '');
				break;
			case 'zoom':
				self.tool.transform = self.tool.transform.replace(/(scale\(\d+(.\d+?)\))/g, '');
				break;
			case "rotate":
				self.tool.transform = self.tool.transform.replace(/(rotate\(\d+deg\))/g, '');
				break;
			default: break;
		}
		self.tool.transform = self.tool.transform.replace(/\s+/g, '') + ' ' + transformer;
		self.$view.css({
			transform: self.tool.transform
		})
	}

	Preview.prototype.reset = function() {
		this.tool.transform = '';
		this.$view.css({transform: this.tool.transform});
		this.$toolbar.$zoomThumb.css({left: 0});
		this.$toolbar.$zoomScale.html('100%');
		this.originPos = null;
		this.endPos = null;
		this.tool.rotate = 0;
	}

	Preview.prototype.next = function() {
		var self = this;
		if(self.runtime.idx >= self.imgs.length - 1 || self.moving) { return false; }

		function _move() {
			self.$items.eq(self.runtime.idx).removeClass('active');
			self.runtime.idx++;
			self.$items.eq(self.runtime.idx).addClass('active');
			var img = self.imgs[self.runtime.idx];
			self.setImage(img);
		}
		
		if(self.runtime.items + self.runtime.leftItems < self.$items.length &&
			self.runtime.idx + 1 - self.runtime.items == self.runtime.leftItems) {
			self.moving = true;
			self.$itemBody.animate({left: '-=' + (self.size.iw + self.size.im) + 'px'}, 200, function() {
				self.runtime.leftItems++;
				self.moving = false;
				_move();
			});
		} else { _move(); }
	};

	Preview.prototype.prev = function() {
		var self = this;
		if(self.runtime.idx <= 0 || self.moving) {
			return false;
		}
		function _move() {
			self.$items.eq(self.runtime.idx).removeClass('active');
			self.runtime.idx--;
			self.$items.eq(self.runtime.idx).addClass('active');
			var img = self.imgs[self.runtime.idx];
			self.setImage(img);
		}
		
		if(self.runtime.leftItems > 0 &&
			self.runtime.idx == self.runtime.leftItems) {
			self.moving = true;
			self.$itemBody.animate({left: '+=' + (self.size.iw + self.size.im) + 'px'}, 200, function() {
				self.runtime.leftItems--;
				self.moving = false;
				_move();
			});
		} else {
			_move();
		}
	};

	Preview.prototype.move = function(evt) {
		var self = this;
		var pos = {
			x: evt.pageX - self.originPos.x,
			y: evt.pageY - self.originPos.y
		}
		self.transition('translate({0}px,{1}px)'.format(pos.x, pos.y), 'move');
	}

	Preview.prototype.zoom = function(rate) {
		this.transition('scale({0})'.format(rate), 'zoom');
	};

	Preview.prototype.close = function() {
		this.$preview.remove();
		this.$mask.remove();
		this.onclose(this.imgs);
	};

	$.preview = function(imgCollections, marker, opt) {
		new Preview(imgCollections, marker, opt);
	}
})(jQuery);