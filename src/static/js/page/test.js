page.ctrl('test', function($scope) {
	var $console = render.$console;
	var imgs = ["http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"http://localhost:8080/hr2.0/src/static/css/img/test_upload.png",
				"https://pic4.zhimg.com/v2-18c784d9ee357afe27f8d44cfc457bfb_200x112.jpg",
				"https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg",
				"https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg",
				"https://pic2.zhimg.com/v2-a072a8f9ad214b6cebe544953fa1c071_200x112.jpg"];
	$console.load(router.template('iframe/Component-test'), function() {
		$('.imgs-item-group').imgUpload({
			getimg: function(cb) {
				cb(imgs)
			}
		})
	})
})