page.ctrl('test', function($scope) {
	var $console = render.$console;
	var imgs = [
					{ 
						materialsPic: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0	//未标记
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "dsdf",
						materialsCode: 'sfzzm',
						auditResult: 1	//错误
					},
					{ 
						materialsPic: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						userId: 3,
						name: "sdfsdf",
						materialsCode: 'sfzzm',
						auditResult: 2	//不清晰
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://www.google.co.jp/logos/doodles/2017/misuzu-kanekos-114th-birthday-6343326507728896-l.png",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					},
					{ 
						materialsPic: "https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg",
						id: 1,
						userId: 3,
						name: "借款人身份证",
						materialsCode: 'sfzzm',
						auditResult: 0
					}
				]
	$console.load(router.template('iframe/Component-test'), function() {
		$('.imgs-item-group').imgUpload({
			viewable: true,
			getimg: function(cb) {
				cb(imgs)
			},
			marker: function (img, mark, cb) {
				console.log(img);
				console.log(mark);
				cb();
			}
		})

		$('#preview').on('click', function() {
			$.preview(imgs, function(img, mark, cb) {
				console.log(img);
				console.log(mark);
				cb();	
			}, {
				markable: false
			});
		})
	})
})