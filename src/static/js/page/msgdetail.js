page.ctrl('msgdetail', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;

	var internel = {};

	internel.setLocation = function() {
		if(!$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $params.path,
			current: '公告详情'
		});
		$location.location();
	}

	internel.loadDetail = function() {
		$.ajax({
			url: $http.api('notice/detail', true),
			data: {
				noticeId: $params.id
			},
			dataType: 'json',
			success: $http.ok(function(res) {
				var result = res.data;
				result.date = tool.formatDate(result.noticePublishTime, true);
				render.compile($scope.$el.$box, $scope.def.detailTmpl, result, true);
			})
		})
	}

	$console.load(router.template('iframe/news-detail'), function() {
		$scope.def.detailTmpl = $console.find('#detailTpl').html();
		$scope.$el = {
			$box : $console.find('#newsPanel')
		}
		internel.loadDetail();
		internel.setLocation();
	})	
})