class TaskServices {

    constructor(taskService) {
        this.taskService = taskService;
    }

    ngOnInit() {
        this.loadTasks();
        this.loadStats();
    }

    add(task_data) {
        var temp = JSON.parse(localStorage.getItem("TASKS"));
        var tasks = temp ? temp : [];
        tasks.push(task_data);
        localStorage.setItem("TASKS", JSON.stringify(tasks));
        this.loadTasks();
        this.loadStats();
    }

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

    list() {
        var temp = JSON.parse(localStorage.getItem("TASKS"));
        var tasks = temp ? temp : [];
        var myTasks = [];
        const authServicesObj = new AuthServices();
        let currentUser = authServicesObj.getCurrentUser();
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].createdBy == currentUser.name) {
                myTasks.push(tasks[i]);
            }
        }
        return myTasks;
    }

    getTask(taskId) {
        let tasks = this.list();
        for (let task of tasks) {
            if (task.tid == taskId) {
                return (task);
            }
        }
    }

    getSelectedPOption(priority, optionvalue) {
        return priority == optionvalue ? "selected" : "";
    }

    getSelectedSOption(status, optionvalue) {
        return status == optionvalue ? "selected" : "";
    }

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
        document.querySelector("#per").innerHTML = per + "% completed";

    }

    loadTasks() {
        let tasks = this.list();
        let con = "";
        for (let i = 0; i < tasks.length; i++) {
            let editButton = `<a type="button" class="btn text-primary" data-toggle="modal" data-target="#edittask" onClick="taskServiceObj.openEditModal(${tasks[i].tid})">Edit</a>`;
            let viewButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#viewtask" onClick="taskServiceObj.openViewModal(${tasks[i].tid})">View</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${tasks[i].tid})" data-target="#deletetask">Delete</a>`;
            con += `<tr>
                        <td>${tasks[i].task}</td>
                        <td>${tasks[i].priority}</td>
                        <td>${tasks[i].status}</td>
                        <td>${editButton}</td>
                        <td>${viewButton}</td>
                        <td>${deleteButton}</td>
                        </tr>`;
        }
        document.querySelector("#taskslist").innerHTML = con;
    }

    sortTasks(val) {
        let tasksO = this.list();
        let tasks = _.sortBy(tasksO, val);
        let con = "";
        for (let i = 0; i < tasks.length; i++) {
            let editButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#edittask" onClick="taskServiceObj.openEditModal(${tasks[i].tid})">Edit</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${tasks[i].tid})" data-target="#deletetask">Delete</a>`;
            con += `<tr>
                        <td>${tasks[i].task}</td>
                        <td>${tasks[i].priority}</td>
                        <td>${tasks[i].status}</td>
                        <td>${editButton}</td>
                        <td>${deleteButton}</td>
                        </tr>`;
        }
        document.querySelector("#taskslist").innerHTML = con;
    }

    filterTasks(val) {
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
        for (let i = 0; i < tasks.length; i++) {
            let editButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#edittask" onClick="taskServiceObj.openEditModal(${tasks[i].tid})">Edit</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${tasks[i].tid})" data-target="#deletetask">Delete</a>`;
            con += `<tr>
                        <td>${tasks[i].task}</td>
                        <td>${tasks[i].priority}</td>
                        <td>${tasks[i].status}</td>
                        <td>${editButton}</td>
                        <td>${deleteButton}</td>
                        </tr>`;
        }
        document.querySelector("#taskslist").innerHTML = con;
    }
}