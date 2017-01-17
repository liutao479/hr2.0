page.ctrl('creditUpload', function($scope) {
	var $console = render.$console,
		userMap = {
			0: {
				code: 0,
				trigger: 'loanMain',
				roleTypeName: '借款人'
			},
			1: {
				code: 1,
				trigger: 'loanPartner',
				roleTypeName: '共同还款人'
			},
			2: {
				code: 2,
				trigger: 'loanGrarantor',
				roleType: '反担保人'
			}
		};
	/**
	* 设置面包屑
	*/
	var setupLocation = function(orderDate) {
		if(!$scope.$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $scope.$params.path,
			current: '征信材料上传',
			orderDate: orderDate
		})
		$location.location();
	}

	var setupCreditPanel = function() {
		$('.select').dropdown($scope);
	}

	var loadOrderInfo = function() {
		$.ajax({
			url: $http.api('credit/upload'),
			data: {orderNo: $scope.$params.orderNo},
			success: $http.ok(function(result) {
				setupLocation(result.data.orderDate);
				setupCreditPanel(result.data);
			})
		})
	}

	$(document).on('click', '#btnNewLoanPartner', function() {

	})



	$console.load(router.template('credit-material-upload'), function() {
		$scope.def.creditPanel = $console.find('#tplCreditPanel').html();
		$scope.def.tab = $console.find('#tplTabItem').html();
		loadOrderInfo();
	})
});
