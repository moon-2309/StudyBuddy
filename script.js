

var currentDate = document.getElementById("currentDate");

var totalTasks = document.getElementById("totalTasks");
var completedTasks = document.getElementById("completedTasks");
var pendingTasks = document.getElementById("pendingTasks");
var studyHours = document.getElementById("studyHours");

var tasksList = document.getElementById("tasksList");
var upcomingTasksList = document.getElementById("upcomingTasksList");
var taskCount = document.getElementById("taskCount");

var taskModal = document.getElementById("taskModal");
var addTaskBtn = document.getElementById("addTaskBtn");
var closeTaskModal = document.getElementById("closeTaskModal");
var taskForm = document.getElementById("taskForm");

var taskId = document.getElementById("taskId");
var taskTitle = document.getElementById("taskTitle");
var taskDueDate = document.getElementById("taskDueDate");
var taskDescription = document.getElementById("taskDescription");

var taskSearch = document.getElementById("taskSearch");
var taskFilter = document.getElementById("taskFilter");

var dailyProgressPercentage = document.getElementById("dailyProgressPercentage");
var dailyProgressCircle = document.getElementById("dailyProgressCircle");
var progressMessage = document.getElementById("progressMessage");


var tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];
var sessions = JSON.parse(localStorage.getItem("studySessions")) || [];

var completedSessions = Number(localStorage.getItem("completedSessions")) || 0;
var totalStudyMinutes = Number(localStorage.getItem("totalStudyMinutes")) || 0;

function saveData() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
    localStorage.setItem("studySessions", JSON.stringify(sessions));
    localStorage.setItem("completedSessions", completedSessions);
    localStorage.setItem("totalStudyMinutes", totalStudyMinutes);
}


function showDate() {
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    currentDate.textContent = today.toLocaleDateString("en-IN", options);
}
showDate();


function openTaskModal() {
    taskForm.reset();
    taskId.value = "";
    document.getElementById("taskModalTitle").textContent = "Add New Task";
    taskModal.classList.add("active");
}

function closeTaskWindow() {
    taskModal.classList.remove("active");
}

addTaskBtn.addEventListener("click", openTaskModal);
closeTaskModal.addEventListener("click", closeTaskWindow);


taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var title = taskTitle.value.trim();
    var dueDate = taskDueDate.value;
    var description = taskDescription.value.trim();

    if (title === "" || dueDate === "") {
        alert("Please fill in the required details.");
        return;
    }

    if (taskId.value === "") {
        var newTask = {
            id: Date.now(),
            title: title,
            dueDate: dueDate,
            description: description,
            completed: false
        };

        tasks.push(newTask);

    } 
    else {

        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id == taskId.value) {
                tasks[i].title = title;
                tasks[i].dueDate = dueDate;
                tasks[i].description = description;
            }
        }
    }

    saveData();
    displayTasks();
    updateDashboard();
    closeTaskWindow();
});

function editTask(id) {
    for (var i = 0; i < tasks.length; i++) {

        if (tasks[i].id == id) {
            taskId.value = tasks[i].id;
            taskTitle.value = tasks[i].title;
            taskDueDate.value = tasks[i].dueDate;
            taskDescription.value = tasks[i].description;

            document.getElementById("taskModalTitle").textContent = "Edit Task";

            taskModal.classList.add("active");
        }
    }
}

function completeTask(id) {
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id == id) {
            tasks[i].completed = !tasks[i].completed;
        }
    }

    saveData();
    displayTasks();
    updateDashboard();
}

function deleteTask(id) {
    var confirmDelete = confirm("Do you want to delete this task?");

    if (confirmDelete) {
        var newTasks = [];

        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].id != id) {
                newTasks.push(tasks[i]);
            }
        }

        tasks = newTasks;

        saveData();
        displayTasks();
        updateDashboard();
    }
}


function displayTasks() {
    tasksList.innerHTML = "";

    var searchText = taskSearch.value.toLowerCase();
    var filterValue = taskFilter.value;
    var visibleTasks = 0;

    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var matchesSearch = task.title.toLowerCase().includes(searchText);
        var matchesFilter = true;

        if (filterValue === "pending" && task.completed) {
            matchesFilter = false;
        }

        if (filterValue === "completed" && !task.completed) {
            matchesFilter = false;
        }

        if (matchesSearch && matchesFilter) {
            visibleTasks++;

            var taskBox = document.createElement("div");
            taskBox.className = "task-item";

            taskBox.style.padding = "18px";
            taskBox.style.border = "1px solid #F0EAF0";
            taskBox.style.borderRadius = "12px";
            taskBox.style.marginBottom = "12px";

            var title = document.createElement("h3");
            title.textContent = task.title;

            if (task.completed) {
                title.style.textDecoration = "line-through";
                title.style.color = "#999";
            }

            var description = document.createElement("p");
            description.textContent = task.description;

            var date = document.createElement("p");
            date.textContent = "Due date: " + task.dueDate;

            var status = document.createElement("p");

            if (task.completed) {
                status.textContent = "Completed";
            } else {
                status.textContent = "Pending";
            }

            status.style.marginTop = "8px";
            status.style.fontWeight = "bold";

            var completeButton = document.createElement("button");
            completeButton.textContent = task.completed ? "Undo" : "Complete";
            completeButton.className = "secondary-btn";
            completeButton.style.marginRight = "8px";

            completeButton.onclick = function(id) {
                return function() {
                    completeTask(id);
                };
            }(task.id);

            var editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.className = "secondary-btn";
            editButton.style.marginRight = "8px";

            editButton.onclick = function(id) {
                return function() {
                    editTask(id);
                };
            }(task.id);

            var deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.className = "secondary-btn";

            deleteButton.onclick = function(id) {
                return function() {
                    deleteTask(id);
                };
            }(task.id);

            taskBox.appendChild(title);
            taskBox.appendChild(description);
            taskBox.appendChild(date);
            taskBox.appendChild(status);
            taskBox.appendChild(completeButton);
            taskBox.appendChild(editButton);
            taskBox.appendChild(deleteButton);

            tasksList.appendChild(taskBox);
        }
    }

    taskCount.textContent = visibleTasks + " Tasks";

    if (visibleTasks === 0) {
        tasksList.innerHTML = '<div class="empty-state"><h3>No tasks found!</h3><p>Try adding a new task.</p></div>';
    }

    displayUpcomingTasks();
}


taskSearch.addEventListener("input", displayTasks);
taskFilter.addEventListener("change", displayTasks);


function displayUpcomingTasks() {
    upcomingTasksList.innerHTML = "";

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var count = 0;

    for (var i = 0; i < tasks.length; i++) {
        var taskDate = new Date(tasks[i].dueDate + "T00:00:00");

        if (!tasks[i].completed && taskDate >= today && count < 5) {
            var taskBox = document.createElement("div");

            taskBox.style.padding = "12px";
            taskBox.style.marginBottom = "10px";
            taskBox.style.background = "#FAF6FD";
            taskBox.style.borderRadius = "10px";

            var title = document.createElement("h4");
            title.textContent = tasks[i].title;

            var date = document.createElement("p");
            date.textContent = "Due: " + tasks[i].dueDate;

            taskBox.appendChild(title);
            taskBox.appendChild(date);

            upcomingTasksList.appendChild(taskBox);

            count++;
        }
    }

    if (count === 0) {
        upcomingTasksList.innerHTML = '<div class="empty-state"><p>No upcoming tasks yet!</p><span>Add a task to get started.</span></div>';
    }
}


function updateDashboard() {
    var completed = 0;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        }
    }

    var pending = tasks.length - completed;
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;
    var hours = (totalStudyMinutes / 60).toFixed(1);
    studyHours.textContent = hours + "h";

    document.getElementById("progressCompletedTasks").textContent = completed;
    document.getElementById("progressFocusSessions").textContent = completedSessions;
    document.getElementById("progressStudyHours").textContent = hours + "h";

    var percentage = 0;

    if (tasks.length > 0) {
        percentage = Math.round((completed / tasks.length) * 100);
    }

    dailyProgressPercentage.textContent = percentage + "%";

    dailyProgressCircle.style.background =
        "conic-gradient(#BCA7E9 " + percentage * 3.6 + "deg, #F0EAF6 0deg)";

    if (percentage === 100 && tasks.length > 0) {
        progressMessage.textContent = "Amazing! You completed all your tasks!";
    } 
    else if (percentage > 0) {
        progressMessage.textContent = "Great work! Keep making progress!";
    } 
    else {
        progressMessage.textContent = "Your productivity journey starts here!";
    }

    displayProgress();
}

function displayProgress() {
    var completed = 0;

    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        }
    }

    var pending = tasks.length - completed;
    var completionChart = document.getElementById("completionChart");

    if (tasks.length === 0) {

        completionChart.innerHTML = '<div class="empty-state"><p>Your progress will appear here.</p></div>';

    } 
    else {
        var percentage = Math.round((completed / tasks.length) * 100);

        completionChart.innerHTML =
            '<p>Completed: ' + completed + '</p>' +
            '<div style="height:14px; background:#F0EAF6; border-radius:20px; overflow:hidden; margin:12px 0;">' +
            '<div style="height:100%; width:' + percentage + '%; background:#B9A3E7; border-radius:20px;"></div>' +
            '</div>' +
            '<p>' + percentage + '% of your tasks completed</p>' +
            '<p style="margin-top:8px;">Pending: ' + pending + '</p>';
    }

    var studyStatistics = document.getElementById("studyStatistics");

    studyStatistics.innerHTML =
        '<p>Total tasks: ' + tasks.length + '</p>' +
        '<p>Completed tasks: ' + completed + '</p>' +
        '<p>Focus sessions: ' + completedSessions + '</p>' +
        '<p>Total study time: ' + (totalStudyMinutes / 60).toFixed(1) + ' hours</p>';
}

var plannerGrid = document.getElementById("plannerGrid");
var weekDisplay = document.getElementById("weekDisplay");

var currentWeek = new Date();

function getDateString(date) {

    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");

    return year + "-" + month + "-" + day;
}

function getWeekStart(date) {
    var firstDay = new Date(date);
    firstDay.setHours(0, 0, 0, 0);
    var day = firstDay.getDay();
    firstDay.setDate(firstDay.getDate() - day);
    return firstDay;
}

function displayPlanner() {
    plannerGrid.innerHTML = "";
    var weekStart = getWeekStart(currentWeek);
    var weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    weekDisplay.textContent =
        weekStart.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
        " - " +
        weekEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    for (var i = 0; i < 7; i++) {
        var day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        var dateString = getDateString(day);
        var dayBox = document.createElement("div");
        dayBox.className = "planner-day";
        var heading = document.createElement("h4");

        heading.textContent =
            day.toLocaleDateString("en-IN", { weekday: "short" }) +
            " " + day.getDate();

        dayBox.appendChild(heading);

        for (var j = 0; j < sessions.length; j++) {
            if (sessions[j].date === dateString) {
                var sessionBox = document.createElement("p");
                sessionBox.textContent =
                    sessions[j].time + " - " + sessions[j].title;

                sessionBox.style.background = "#EAE3FA";
                sessionBox.style.padding = "7px";
                sessionBox.style.borderRadius = "8px";
                sessionBox.style.marginTop = "8px";
                sessionBox.style.fontSize = "12px";

                dayBox.appendChild(sessionBox);
            }
        }
        plannerGrid.appendChild(dayBox);
    }
}

document.getElementById("previousWeek").addEventListener("click", function() {
    currentWeek.setDate(currentWeek.getDate() - 7);
    displayPlanner();
});

document.getElementById("nextWeek").addEventListener("click", function() {
    currentWeek.setDate(currentWeek.getDate() + 7);
    displayPlanner();
});


var sessionModal = document.getElementById("sessionModal");
var addSessionBtn = document.getElementById("addSessionBtn");
var closeSessionModal = document.getElementById("closeSessionModal");
var sessionForm = document.getElementById("sessionForm");

addSessionBtn.addEventListener("click", function() {
    sessionForm.reset();
    document.getElementById("sessionDuration").value = 60;
    document.getElementById("sessionDate").value = getDateString(new Date());
    sessionModal.classList.add("active");

});

closeSessionModal.addEventListener("click", function() {

    sessionModal.classList.remove("active");

});


sessionForm.addEventListener("submit", function(event) {

    event.preventDefault();

    var title = document.getElementById("sessionTitle").value.trim();
    var date = document.getElementById("sessionDate").value;
    var time = document.getElementById("sessionTime").value;
    var duration = document.getElementById("sessionDuration").value;

    if (title === "" || date === "" || time === "") {
        alert("Please fill in all the details.");
        return;
    }

    var newSession = {
        title: title,
        date: date,
        time: time,
        duration: duration
    };

    sessions.push(newSession);
    saveData();
    displayPlanner();
    sessionModal.classList.remove("active");
    sessionForm.reset();

});

var timerDisplay = document.getElementById("timerDisplay");
var timerStatus = document.getElementById("timerStatus");
var timerMode = document.getElementById("timerMode");

var startTimer = document.getElementById("startTimer");
var resetTimer = document.getElementById("resetTimer");

var timerCircle = document.querySelector(".timer-circle");
var modeButtons = document.querySelectorAll(".timer-mode");

var currentMode = "focus";
var timeLeft = 25 * 60;
var timerRunning = false;
var timerInterval;


function updateTimerDisplay() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;

    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    timerDisplay.textContent = minutes + ":" + seconds;

    var totalTime;
    if (currentMode === "focus") {
        totalTime = 25 * 60;
    } 
    else {
        totalTime = 5 * 60;
    }

    var percentage = ((totalTime - timeLeft) / totalTime) * 360;
    timerCircle.style.background =
        "conic-gradient(#AD94DF " + percentage + "deg, rgba(255,255,255,0.65) 0deg)";
}


function changeTimerMode(mode) {
    clearInterval(timerInterval);
    timerRunning = false;
    currentMode = mode;
    if (mode === "focus") {
        timeLeft = 25 * 60;
        timerMode.textContent = "Time to Focus!";
        timerStatus.textContent = "Ready when you are";

    } 
    else {
        timeLeft = 5 * 60;
        timerMode.textContent = "Time for a Break!";
        timerStatus.textContent = "Take a little rest";

    }

    startTimer.textContent = "Start";

    for (var i = 0; i < modeButtons.length; i++) {
        modeButtons[i].classList.remove("active");
        if (modeButtons[i].getAttribute("data-mode") === mode) {
            modeButtons[i].classList.add("active");
        }
    }
    updateTimerDisplay();
}


for (var i = 0; i < modeButtons.length; i++) {
    modeButtons[i].addEventListener("click", function() {
        var selectedMode = this.getAttribute("data-mode");
        changeTimerMode(selectedMode);
    });
}

startTimer.addEventListener("click", function() {
    if (timerRunning) {
        clearInterval(timerInterval);
        timerRunning = false;
        startTimer.textContent = "Start";
        timerStatus.textContent = "Timer paused";
    } 
    else {
        timerRunning = true;
        startTimer.textContent = "Pause";
        timerStatus.textContent = "Stay focused!";

        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerRunning = false;
                startTimer.textContent = "Start";
                if (currentMode === "focus") {
                    completedSessions++;
                    totalStudyMinutes = totalStudyMinutes + 25;
                    saveData();
                    updateDashboard();
                    timerStatus.textContent = "Focus session completed!";
                    alert("Great work! Your focus session is complete.");
                }
                 else {
                    timerStatus.textContent = "Break completed!";
                    alert("Your break is over. Ready to focus again?");
                }

                changeTimerMode(currentMode);
            }

        }, 1000);
    }

});


resetTimer.addEventListener("click", function() {
    clearInterval(timerInterval);

    timerRunning = false;
    startTimer.textContent = "Start";

    if (currentMode === "focus") {
        timeLeft = 25 * 60;
        timerStatus.textContent = "Ready when you are";
    } 
    else {
        timeLeft = 5 * 60;
        timerStatus.textContent = "Take a little rest";
    }

    updateTimerDisplay();

});

var menuToggle = document.getElementById("menuToggle");
var mainNav = document.getElementById("mainNav");
var navLinks = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", function() {

    mainNav.classList.toggle("open");

    if (mainNav.classList.contains("open")) {
        menuToggle.setAttribute("aria-expanded", "true");
    } 
    else {
        menuToggle.setAttribute("aria-expanded", "false");
    }

});

for (var i = 0; i < navLinks.length; i++) {

    navLinks[i].addEventListener("click", function() {

        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

        for (var j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove("active");
        }

        this.classList.add("active");

    });

}

taskModal.addEventListener("click", function(event) {

    if (event.target === taskModal) {
        closeTaskWindow();
    }

});

sessionModal.addEventListener("click", function(event) {

    if (event.target === sessionModal) {
        sessionModal.classList.remove("active");
    }

});

displayTasks();
updateDashboard();
displayPlanner();
updateTimerDisplay();
