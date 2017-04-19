;(function(_) {
	var redirect = _.redirect = {};
	redirect.toLoanProcess = function(tasks) {
		var loanTasks = response.data;
		//任务已经处理结束，有可能点的是历史消息
		if(loanTasks.length == 0) {

		}
		var taskObj = [], flag = 0;
		for(var i = 0, len = loanTasks.length; i < len; i++) {
			var obj = loanTasks[i];
			taskObj.push({
				key: obj.category,
				id: obj.id,
				name: obj.sceneName,
				submited: obj.submited
			})
			if(!loanTasks[i].submited) {
				flag++;
			}
		}
		for(var i = 0, len = loanTasks.length; i < len; i++) {
			if(!loanTasks[i].submited) {
				var target = loanTasks[i];
				var selected = i;
				if(flag == 1) taskObj[selected].submited = true;
				break;
			}
		}
		router.render('loanProcess/' + target.category, {
			taskId: target.id, 
			orderNo: target.orderNo,
			tasks: taskObj,
			selected: selected,
			path: 'loanProcess'
		});
	}
})(window);