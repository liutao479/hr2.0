page.ctrl('test', function($scope) {
	var $console = render.$console;
	var imgs = [
					{ 
						url: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						name: "借款人身份证",
						marked: 0	//未标记
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 1	//错误
					},
					{ 
						url: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						name: "借款人身份证",
						marked: 2	//不清晰
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					},
					{ 
						url: "https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg",
						id: 1,
						name: "借款人身份证",
						marked: 0
					}
				]
	$console.load(router.template('iframe/Component-test'), function() {
		$('.imgs-item-group').imgUpload({
			getimg: function(cb) {
				cb(imgs)
			},
			marker: function (img, mark, cb) {
				cb();
			}
		})
	})
})