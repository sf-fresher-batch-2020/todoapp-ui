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
    }

    listTasks() {
        var tasks = JSON.parse(localStorage.getItem("TASKS"));
        var myTasks = [];
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].createdBy == currentUser.name) {
                myTasks.push(tasks[i]);
            }
        }
        return myTasks;
    }

    loadStats() {
        let tasks = this.listTasks();
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
        document.querySelector("#allnum").innerHTML = all;
        document.querySelector("#comnum").innerHTML = com;
        document.querySelector("#ongng").innerHTML = ong;
        document.querySelector("#upcmg").innerHTML = upc;

    }

    loadTasks() {
        let tasks = this.listTasks();
        let con = "";
        for (let task of tasks) {
            let editButton = `<a type="button" class="btn text-info" data-toggle="modal" data-target="#edittask">Edit</a>`;
            let deleteButton = `<a type="button" class="btn text-danger" data-toggle="modal" data-target="#deletetask">Delete</a>`;
            con += `<div class="row p-2 mx-auto border border-primary">
            <h6>${task.task}</h6>
            <hr>
            <p><span class="badge badge-pill p-1 badge-primary">${task.priority}</span></p>
            <hr>
            <p><span class="badge badge-pill p-1 badge-warning">${task.status}</span></p>
            <hr>
            ${editButton}
            ${deleteButton}
            </div>`;
        }
        console.log(con);
        document.querySelector("#taskslist").innerHTML = con;
    }
}