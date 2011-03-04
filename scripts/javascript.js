$(document).ready(function() {

	// addTask event handler
	$('#addTask').bind('click', addTask);
	
	// clearLog event handler
	$("#clearLog").bind("click", clearLog); 
		
	var newDate = new Date();
	var dayOfWeek = newDate.getDay();
	var month = newDate.getMonth();
	
	if (dayOfWeek == 0) { dayOfWeek = "Sunday"
	} else if (dayOfWeek == 1) { dayOfWeek = "Monday" 
	} else if (dayOfWeek == 2) { dayOfWeek = "Tuesday"
	} else if (dayOfWeek == 3) { dayOfWeek = "Wednesday"
	} else if (dayOfWeek == 4) { dayOfWeek = "Thursday" 
	} else if (dayOfWeek == 5) { dayOfWeek = "Friday"
	} else if (dayOfWeek == 6) { dayOfWeek = "Saturday" }
	
	if (dayOfWeek == 0) { dayOfWeek = "January"
	} else if (month == 1) { month = "Febuary" 
	} else if (month == 2) { month = "March"
	} else if (month == 3) { month = "April"
	} else if (month == 4) { month = "May" 
	} else if (month == 5) { month = "June"
	} else if (month == 6) { month = "July" 
	} else if (month == 7) { month = "August" 
	} else if (month == 8) { month = "September" 
	} else if (month == 9) { month = "October" 
	} else if (month == 10) { month = "November"
	} else if (month == 11) { month = "December" }
	
	$('#time').text("Today is " + dayOfWeek + " " + month + " " + newDate.getDate() + ", " + newDate.getFullYear());			
	
	getAllItems();
});

function addTask() {
	
	// get the input values
	var taskInput = $('#todoInput').val();
	var finishByInput = $('#finishByInput').val()
	var complete = "";
	
	// commit the values to localeStorage
		
		// get a timestamp to use as a key for each task
		var newDate = new Date();
		var itemId = newDate.getTime();
		
		// create array with all of the user input values
		var inputValues = new Array();
		inputValues.push(taskInput);
		inputValues.push(finishByInput);
		inputValues.push(complete);
		
		// commit the values to the localStorage database
		localStorage.setItem(itemId, inputValues.join(";"));
		
		getTaskItem(itemId);
			
};

function getAllItems() {
	var i = 0;
	var taskLength = localStorage.length - 1
	
	for (i = 0; i <= taskLength; i++) {	
		// read the values from the localStorage database
		itemId = localStorage.key(i);
		
		getTaskItem(itemId);
	}
};

function getTaskItem(itemId) {
	
	// take the values from the localStorage database
	var outputValues = localStorage.getItem(itemId).split(";");
	var taskValue = outputValues[0];
	var finishByValue = outputValues[1];
	var complete = outputValues[2];

	if (complete !== "complete") {
		// create a container for the task to live in
		// <div><li class="task">taskValue goes here</li></div>
		var taskContainer = $("<div>").attr("id", itemId);
		var listItem = $("<li>").attr("class", "task");
		listItem.text(taskValue);
		listItem.bind("click", function() {editTask(taskValue, this, itemId);}, false);

		// create a container for the finishByInput to live in
		// <span id="finishBy">finishByInput goes here</span>
		var finishByContainer = $("<span>").attr("class", "finishBy");
		finishByContainer.text(finishByValue);

		//create a delete button for each task
		// <input type="button" value="delete" />
		var deleteButton = $("<input>").attr("name", itemId);
		deleteButton.attr("type", "button").attr("value", "x").attr("class", "delete").bind("click",
			function() {
				var inputDiv = this.parentNode;
				inputDiv.parentNode.removeChild(inputDiv);
				var ItemKey = $(this).attr("name");
				localStorage.removeItem(itemId);
			});

		// create a finished checkbox for each task
		// <input type="checkbox" />
		var doneCheckbox = $("<input>").attr("name", itemId);
		doneCheckbox.attr("type", "checkbox").attr("class", "complete").bind("click", 
			function() {
				var itemKey = $(this).attr("name");
				$("#"+itemKey).fadeOut();
				// var inputDiv = this.parentNode;
				// inputDiv.parentNode.removeChild(inputDiv);
				var finishedTask = localStorage.getItem(itemKey).split(";");
				var task = finishedTask[0];
		
				// alert localStorage database that the task is complete
				finishedTask[2] = "complete";
			
				// commit the values to the localStorage database
				localStorage.setItem(itemKey, finishedTask.join(";"));
		
				// create a container for finished task to live in
				// <div><li class="finishedTask">finishedTask</li><div>
				var finishedTaskContainer = $("<div>").attr("name", itemId);
				var finishedTaskListItem = $("<li>").attr("class", "finishedTask").text(task);
				finishedTaskContainer.append(finishedTaskListItem);
				$("#finished").append(finishedTaskContainer);
			});

		// add the delete button and finished checkbox to the task container
		taskContainer.append(listItem).append(finishByContainer).append(doneCheckbox).append(deleteButton);

		// attach it to the unordered list with id="todo"
		$("#todo").append(taskContainer);
	} else {
		
		// create a container for finished task to liv in
		// <div><li class="finishedTask">finishedTask</li><div>
		var finishedTaskContainer = $("<div>").attr("name", itemId);
		var finishedTaskListItem = $("<li>").attr("class", "finishedTask").text(taskValue);
		finishedTaskContainer.append(finishedTaskListItem);
		$("#finished").append(finishedTaskContainer);
	}
};

function clearLog() {
	var i = 0;
	var taskLength = $("#finished div").length - 1
	
	for (i = 0; i <= taskLength; i++) {	
		// get the keys for only the finished tasks
		itemId = $("#finished div")[0].getAttribute("name");
		
		// remove the finished task
		finishedTaskContainer = $("#finished div")[0];
		finishedTaskContainer.parentNode.removeChild(finishedTaskContainer);
		
		// clear the tasks them from localStorage
		localStorage.removeItem(itemId);
	}		
};

function editTask(taskValue, ctrl, itemId) {
	var editableItem = document.createElement("input");
	editableItem.setAttribute("type", "text");
	editableItem.className= "editable";
	editableItem.value = taskValue;
	ctrl.parentNode.replaceChild(editableItem ,ctrl);
	editableItem.focus();
	editableItem.addEventListener("blur", function() {
		var newListItem = document.createElement("li");
		newListItem.className = "task";
		newListItem.appendChild(document.createTextNode(editableItem.value));
		this.parentNode.replaceChild(newListItem, this);
		newListItem.addEventListener("click", function() {editTask(editableItem.value, this, itemId);}, false);
		
		// put new value into localStorage
		var taskArray = localStorage.getItem(itemId).split(";");
		taskArray[0] = editableItem.value;
		localStorage.setItem(itemId, taskArray.join(";"));
		
	});
};