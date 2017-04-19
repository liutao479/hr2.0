//单选框
// $(document).on('selectstart', '.radio', false);
// $(document).on('click', '.radio', function() {
// 	if(!$(this).attr('checked')) {
// 		$(this).addClass('checked').attr('checked',true);
// 	} else {
// 		$(this).removeClass('checked').attr('checked',false);
// 	}
// })


//右边栏
$('.sideBar-item').hover(function() {
	$(this).find('.sideBar-content').show();	
},function() {
	$(this).find('.sideBar-content').hide();		
});


//测试鼠标移上提示框
$('.tips-area').hover(function() {
	$(this).find('.tips-content').toggle();
})

/**
* 顶部二维码、消息和用户展开效果
**/



/**
 * 排序
 */
 $(document).on('click', '.time-sort', function() {
 	// 数据更新
 	
 	// 箭头更新
 	if( $(this).hasClass('time-sort-up') ) {
 		$(this).removeClass('time-sort-up').addClass('time-sort-down');	
 	} else if ( $(this).hasClass('time-sort-down') ) {
 		$(this).removeClass('time-sort-down').addClass('time-sort-up');	
 	}
	
});



/*=========信息录入表格通用js=zhy===========*/
	//点击下拉选项赋值zhy
	$(document).on('click', '.selectOptBox li', function() {
		var value = $(this).data('key');
		var text = $(this).text();
		console.log(value);
		$(this).parent().parent().siblings(".placeholder").html(text);
		$(this).parent().parent().siblings(".placeholder").attr('title',text);
		$(this).parent().parent().siblings("input").val(value);
		var value1 = $(this).parent().parent().siblings("input").val();
		if(!value1){
			$(this).parent().parent().siblings(".placeholder").html("请选择");
		}else{
			$(this).parent().parent().parent().removeClass("error-input");
			$(this).parent().parent().siblings("i").remove();
//			$(this).parent().parent().after("<div class='opcity0'>这个是新增的div</div>");
		}
		$(".selectOptBox").hide();
		$(".searchInp").hide();
		return false;
	})
//点击下拉消失	zhy
	$(document).on("click",function(e){ 
		var target = $(e.target);
		if(target.closest(".selectOptBox").length == 0){ 
			$(".selectOptBox").hide();
			return;
		}
	})



flow = {};

flow.taskSubmit = function(data) {
	// var taskObj, flag;
	// for(var i = 0, len = data.length; i < len; i++) {
	// 	var row = data[i];
	// 	if(!row.submited) {
	// 		taskObj.push(row);
	// 		flag++;
	// 	}
	// }
	debugger
	for(var i = 0, len = data.length; i < len; i++) {
		var row = data[i];
		if(!row.submited) {
			for(var j = i + 1, len2 = data.length; j < len2; j++) {
				var col = data[j];
				if(!col.submited) {
					flow.nextTaskName = col.name;
				} else {
					flow.nextTaskName = '';
				}
			}
			return false; 
		}
	}
	return true;
}

/**
 * 提交订单以及跳转逻辑
 * @param  {object}  params [提交任务需传参数]
 * @param  {string}  type   [场景的类型'complete' 'approval']
 * @return {function}          跳转后的回调
 */
flow.tasksJump = function(params, type, cb) {
	$.ajax({
		type: 'post',
		url: $http.api('tasks/' + type, 'zyj'),
		data: JSON.stringify(params),
		dataType: 'json',
		contentType: 'application/json;charset=utf-8',
		success: $http.ok(function(result) {
			console.log(result);
			var loanTasks = result.data;
			if(loanTasks.length == 0) {
				// toast显示
				router.render('loanProcess');
			} else {
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
				// debugger
				for(var j = 0, len2 = loanTasks.length; j < len2; j++) {
					if(!loanTasks[j].submited) {
						var target = loanTasks[j];
						var selected = j;
						if(flag == 1) taskObj[selected].submited = true;
						break;
					}
				}
				router.render('loanProcess/' + target.category, {
					taskId: target.id, 
					orderNo: target.orderNo,
					selected: selected,
					tasks: taskObj,
					path: 'loanProcess'
				});
			}
			
		})
	})
	
}