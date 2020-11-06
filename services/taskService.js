class TaskService {

    constructor(taskService) {
        this.taskService = taskService;
    }

    ngOnInit() {
        this.loadTasks();
        this.loadStats();
    }

    // function to add tasks
    add(task_data) {
        var temp = JSON.parse(localStorage.getItem("TASKS"));
        var tasks = temp ? temp : [];
        tasks.push(task_data);
        localStorage.setItem("TASKS", JSON.stringify(tasks));
        this.loadTasks();
        this.loadStats();
    }

    // function that deletes tasks
    delete(task_id) {
        console.log(task_id);
        let tasks = JSON.parse(localStorage.getItem("TASKS"));
        let nTasks = [];
        for (let task of tasks) {
            if (task.tid != task_id) {
                nTasks.push(task);
            }
        }
        localStorage.setItem("TASKS", JSON.stringify(nTasks));
        this.loadTasks();
        this.loadStats();
    }

    // function to list user tasks
    list() {
        var temp = JSON.parse(localStorage.getItem("TASKS"));
        var tasks = temp ? temp : [];
        var myTasks = [];
        const authServicesObj = new AuthService();
        let currentUser = authServicesObj.getCurrentUser();
        for (let task of tasks) {
            if (task.createdBy == currentUser.name) {
                myTasks.push(task);
            }
        }
        return myTasks;
    }

    // function that returns particular task based on task id
    getTask(taskId) {
        let tasks = this.list();
        for (let task of tasks) {
            if (task.tid == taskId) {
                return (task);
            }
        }
    }

    // sets the selected attribute for priority option
    getSelectedPOption(priority, optionvalue) {
        return priority == optionvalue ? "selected" : "";
    }

    // sets the selected attribute for status option
    getSelectedSOption(status, optionvalue) {
        return status == optionvalue ? "selected" : "";
    }

    // passes the task details to the modal for editing particular tak
    openEditModal(taskId) {
        let eTask = this.getTask(taskId);
        // console.log(eTask);
        let myform = "";

        myform += `<form onsubmit="updateTask()">
                        <div>
                            <input type="text" class="d-none" name="tid" id="tid" value="${eTask.tid}">
                        </div>
                        <div class="form-group">
                            <input type="text" id="dec" class="form-control" value="${eTask.task}">
                        </div>
                        <div class="form-group">
                            <select class="form-control form-control-sm" name='newpriority' id="newpriority">
                                <option value="high" ${this.getSelectedPOption(eTask.priority,"high")}>High Priority</>
                                <option value="medium" ${this.getSelectedPOption(eTask.priority,"medium")}>Medium Priority</option>
                                <option value="low" ${this.getSelectedPOption(eTask.priority,"low")}>Low Priority</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <select class="form-control form-control-sm" name="newstatus" id="newstatus">
                                <option value="upcoming" ${this.getSelectedSOption(eTask.status,"upcoming")}>Upcoming</option>
                                <option value="ongoing" ${this.getSelectedSOption(eTask.status,"ongoing")}>Ongoing</option>
                                <option value="completed" ${this.getSelectedSOption(eTask.status,"completed")}>Completed</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </form>`;
        document.querySelector("#editform").innerHTML = myform;
    }

    // passes the task details to the view modal
    openViewModal(taskId) {
        let eTask = this.getTask(taskId);
        console.log(eTask);
        let myform = "";
        myform += `<form>
                        <div>
                            <input class="d-none" name="tid" id="tid"  value="${eTask.tid}">
                        </div>
                        <div class="form-group">
                            <input type="text" id="dec" class="form-control" disabled value="${eTask.task}">
                        </div>
                        <div class="form-group">
                            <input type="text" id="dec" class="form-control" disabled value="${eTask.priority}">
                        </div>
                        <div class="form-group">
                            <input type="text" id="dec" class="form-control" disabled value="${eTask.status}">
                        </div>
                        <button class="btn btn-primary" data-dismiss="modal">Ok</button>
                    </form>`;
        document.querySelector("#viewform").innerHTML = myform;
    }

    // updates the task when called and reloads the task list
    update(tid, dec, pri, sts) {

        let tasks = JSON.parse(localStorage.getItem("TASKS"));

        for (let task of tasks) {
            if (task.tid == tid) {
                task.task = dec;
                task.priority = pri;
                task.status = sts;
                break;
            }
        }
        localStorage.setItem("TASKS", JSON.stringify(tasks));
        this.loadTasks();
        this.loadStats();
    }
    loadStats() {
        // function that loads the statistics of tasks
        let tasks = this.list();
        let all = tasks.length;
        let com = 0,
            ong = 0,
            upc = 0;
        for (let task of tasks) {
            if (task.status == 'upcoming') {
                upc++;
            }
            if (task.status == 'ongoing') {
                ong++;
            }
            if (task.status == 'completed') {
                com++;
            }
        }

        var per = Math.floor((com / all) * 100);

        document.querySelector("#allnum").innerHTML = all;
        document.querySelector("#comnum").innerHTML = com;
        document.querySelector("#ongng").innerHTML = ong;
        document.querySelector("#upcmg").innerHTML = upc;
        document.querySelector("#progress").innerHTML = per + "% completed";
        document.querySelector("#progress").style.width = per + "%";

    }

    loadTasks() {
        // gets list of tasks and renders with dashboard ui
        let tasks = this.list();
        let con = "";
        for (let task of tasks) {
            let editButton = `<a type="button" class="btn text-primary" data-toggle="modal" data-target="#edittask" onClick="taskServiceObj.openEditModal(${task.tid})">Edit</a>`;
            let viewButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#viewtask" onClick="taskServiceObj.openViewModal(${task.tid})">View</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${task.tid})" data-target="#deletetask">Delete</a>`;
            con += `<tr>
                        <td>${task.task}</td>
                        <td>${task.priority}</td>
                        <td>${task.status}</td>
                        <td>${editButton}</td>
                        <td>${viewButton}</td>
                        <td>${deleteButton}</td>
                    </tr>`;
        }
        document.querySelector("#taskslist").innerHTML = con;
    }

    sortTasks(val) {
        // sorts the tasks based on status or priority
        let tasksO = this.list();
        let tasks = _.sortBy(tasksO, val);
        let con = "";
        for (let task of tasks) {
            let editButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#edittask" onClick="taskServiceObj.openEditModal(${task.tid})">Edit</a>`;
            let viewButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#viewtask" onClick="taskServiceObj.openViewModal(${task.tid})">View</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${task.tid})" data-target="#deletetask">Delete</a>`;
            con += `<tr>
                        <td>${task.task}</td>
                        <td>${task.priority}</td>
                        <td>${task.status}</td>
                        <td>${editButton}</td>
                        <td>${viewButton}</td>
                        <td>${deleteButton}</td>
                        </tr>`;
        }
        document.querySelector("#taskslist").innerHTML = con;
    }

    filterTasks(val) {
        // filters the tasks based on the requested values of status or priority
        let tasksO = this.list();
        let tasks;
        if (val == 'ongoing' || val == 'upcoming' || val == 'completed') {
            tasks = tasksO.filter(task => task.status == val);
        } else if (val == 'high' || val == 'medium' || val == 'low') {
            tasks = tasksO.filter(task => task.priority == val);
        } else {
            tasks = this.list();
        }
        let con = "";
        for (let task of tasks) {
            let editButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#edittask" onClick="taskServiceObj.openEditModal(${task.tid})">Edit</a>`;
            let viewButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#viewtask" onClick="taskServiceObj.openViewModal(${task.tid})">View</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${task.tid})" data-target="#deletetask">Delete</a>`;
            con += `<tr>
                        <td>${task.task}</td>
                        <td>${task.priority}</td>
                        <td>${task.status}</td>
                        <td>${editButton}</td>
                        <td>${viewButton}</td>
                        <td>${deleteButton}</td>
                        </tr>`;
        }
        document.querySelector("#taskslist").innerHTML = con;
    }
}