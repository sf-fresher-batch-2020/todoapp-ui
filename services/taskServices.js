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
        var tasks = JSON.parse(localStorage.getItem("TASKS"));
        var myTasks = [];
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

    openEditModal(taskId) {
        let eTask = this.getTask(taskId);
        console.log(eTask);
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
                            <option value="high">High Priority</>
                            <option value="medium">Medium Priority</option>
                            <option value="low">Low Priority</option>
                        </select>
                        </div>
                        <div class="form-group">
                            <select class="form-control form-control-sm" name="newstatus" id="newstatus">
                            <option value="upcoming">Upcoming</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                        </div>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </form>`
        document.querySelector("#editform").innerHTML = myform;
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
            let editButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#edittask" onClick="taskServiceObj.openEditModal(${tasks[i].tid})">Edit</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${tasks[i].tid})" data-target="#deletetask">Delete</a>`;
            con += `<div class="row p-2 mx-auto border border-primary">
            <h6>${tasks[i].task}</h6>
            <hr>
            <p><span class="badge badge-pill p-1 badge-primary">${tasks[i].priority}</span></p>
            <hr>
            <p><span class="badge badge-pill p-1 badge-warning">${tasks[i].status}</span></p>
            <hr>
            ${editButton}
            ${deleteButton}
            </div>`;
        }
        document.querySelector("#taskslist").innerHTML = con;
    }

    sortTasks(val) {
        let tasksO = this.list();
        let tasks = _.sortBy(tasksO, val);
        let con = "";
        for (let i = 0; i < tasks.length; i++) {
            let editButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#edittask">Edit</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${tasks[i].tid})" data-target="#deletetask">Delete</a>`;
            con += `<div class="row p-2 mx-auto border border-primary">
            <h6>${tasks[i].task}</h6>
            <hr>
            <p><span class="badge badge-pill p-1 badge-primary">${tasks[i].priority}</span></p>
            <hr>
            <p><span class="badge badge-pill p-1 badge-warning">${tasks[i].status}</span></p>
            <hr>
            ${editButton}
            ${deleteButton}
            </div>`;
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
            let editButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#edittask">Edit</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" onClick="taskServiceObj.delete(${tasks[i].tid})" data-target="#deletetask">Delete</a>`;
            con += `<div class="row p-2 mx-auto border border-primary">
            <h6>${tasks[i].task}</h6>
            <hr>
            <p><span class="badge badge-pill p-1 badge-primary">${tasks[i].priority}</span></p>
            <hr>
            <p><span class="badge badge-pill p-1 badge-warning">${tasks[i].status}</span></p>
            <hr>
            ${editButton}
            ${deleteButton}
            </div>`;
        }
        document.querySelector("#taskslist").innerHTML = con;
    }
}