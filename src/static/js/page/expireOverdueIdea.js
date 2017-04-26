page.ctrl('expireOverdueIdea', function($scope) {
	var $params = $scope.$params,
		$console = 	$params.refer ? $($params.refer) : render.$console;

	var internel = {};

	internel.loadIdea = function() {
		$.ajax({
			url: $http.api('loanOverdueOpinion/overdueOpinionList', true),
			dataType: 'json',
			data: {
				orderNo: $params.orderNo
			},
			success: $http.ok(function(res) {
				var result = res.data;
				if(result && !!result.length) {
					internel.render(result);
				} else {
					var empty = '<div class="blank-box">\
									<img src="/hr2.0/dist/static/css/img/orders_blank.png">\
									<p>暂无处理意见！</p>\
								</div>';
					$scope.$el.$tbl.html(empty);
				}
			})
		})
	}

	internel.render = function(it) {
		render.compile($scope.$el.$tbl, $scope.def.listTmpl, it, true);
	}

	$console.load(router.template('iframe/expire-process-idea'), function() {
		$scope.def.listTmpl = $console.find('#expireProcessDetailTmpl').html();
		$scope.$el = {
			$tbl: $console.find('#ideaTable')
		}
		internel.loadIdea();
	})
})