page.ctrl('detail', function($scope) {
	var $console = render.$console,
		$params = $scope.$params;
	$scope.tasks = $params.tasks,
	$scope.activeTaskIdx = $params.selected || 0;

	if(!$scope.tasks || !$scope.tasks.length) {
		return router.render('loanProcess');
	}

	/**
	* 构造多任务的tab
	* @params {object} tasks 任务列表
	* @params {boject} activeTask 当前任务
	*/
	function setupTaskNavigator(tasks, activeTaskIdx) {
		var $tab = $console.find('#taskNavigator');
		if(tasks.length <= 1) { 
			$tab.remove();
			return false;
		}
		$.tabNavigator($tab, tasks, activeTaskIdx, function(item){
			
		})
	}

	/**
	* 加载当前任务的详情
	*/
	function loadTaskDetail() {

	}

	function setupLocation (activeTask) {
		if(!$params.path) return false;
		var $location = $console.find('#location');
		$location.data({
			backspace: $params.path,
			current: activeTask ? activeTask.sceneName : '贷款办理任务详情'

		})
	}

	$console.load(router.template('iframe/detail'), function() {
		setupTaskNavigator($scope.tasks, $scope.activeTaskIdx);	
		loadTaskDetail();
	})

	
});