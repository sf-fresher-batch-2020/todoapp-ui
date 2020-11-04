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
        console.log(tasks);
        for (let i = 0; i < tasks.length; i++) {
            console.log(tasks[i].tid);
            if (tasks[i].itd == task_id) {
                // console.log("deleting " + tasks[i].task);
                // tasks.splice(i, 1);
                break;
            } else {
                console.log('no task');
            }
        }
        localStorage.setItem("TASKS", JSON.stringify(tasks));
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

    update(nPriority, nStatus, task_dic) {
        let tasks = this.list();
        for (let task of tasks) {
            if (task.task == task_dic) {
                task.priority = nPriority;
                task.status = nStatus;
            }
        }
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