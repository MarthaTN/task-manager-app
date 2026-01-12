
/*============================
TASK CLASSES
**Fomulars for creating a different types of tasks**
============================*/
class Task{ 
    constructor(title){
        this.title = title;
        this.status = "pending";
        this.subtasks = [];
    }

    changeStatus(newStatus){
        this.status = newStatus;
    }

    addSubtasks(task){
        this.subtasks.push(task);
    }
}

// inherited class
class TimedTask extends Task{
    constructor(title,deadline){
    super(title);
    this.deadline = deadline;
}
}
/*End of Creation of the structure of TASK/TIMED TASK

MOVING ON TO CREATING FUNCTIONALITY if you want to do more with the task that you created*/

let tasks = [];


/*DOM Elements*/

const taskInput = document.getElementById("tasktitle");
const deadlineInput = document.getElementById("taskDeadline");
const taskContainer = document.getElementById("taskContainer");

const addBtn = document.getElementById("addTaskBtn");
const saveBtn = document.getElementById("saveTaskBtn");
const loadBtn = document.getElementById("loadTaskBtn");
const markAllBtn = document.getElementById("markAllDoneBtn");


const taskTypeRadios = document.querySelectorAll("input[name='taskType']");

/*==================================
Task Type UI Logic
================================*/

taskTypeRadios.forEach(radio=>{
    radio.addEventListener('change',()=>{
        //disable the deadline input if the value of radio selected is not timed
        deadlineInput.disabled = radio.value!=='timed';
        if(deadlineInput.disabled){
            deadlineInput.value = "";
        }
    })
});

/*=================
RENDER TASKS
====================*/

function renderTasks(taskList, container){
    container.innerHTML ="";

    taskList.forEach((task, index)=>{
        const li = document.createElement("li");
        const title = document.createElement("span");
        title.textContent = task.deadline?`${task.title} [${task.status}] (Due: ${task.deadline})`:`${task.title} [${task.status}]`;

        //STATUS Buttons 

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.addEventListener('click', ()=>{
        task.changeStatus("done");
        renderTasks(tasks, taskContainer);
    });

    const cancleBtn = document.createElement("button");
    cancleBtn.textContent = "Cancle";
    cancleBtn.addEventListener('click', ()=>{
        task.changeStatus("cancelled");
        renderTasks(tasks, taskContainer);
    });

    const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            renderTasks(tasks, taskContainer);
        });

        /*=====================
        SUBTASK INPUT
        ====================*/
        const subInput = document.createElement("input");
        subInput.placeholder = "Add Subtask";
        
        const addSubBtn = document.createElement("button")
        addSubBtn.textContent = "Add Subtask"
        addSubBtn.addEventListener("click",()=>{
            const subTitle = subInput.value.trim();
            if (!subTitle) return;

            task.addSubtasks(new Task(subTitle));
            renderTasks(tasks, taskContainer);
        });

        li.append(
              title,
            doneBtn,
            cancleBtn,
            deleteBtn,
            subInput,
            addSubBtn
        );
    
          /* RENDER SUBTASKS (RECURSIVE) */
        if (task.subtasks.length > 0) {
            const subUl = document.createElement("ul");
            renderTasks(task.subtasks, subUl);
            li.appendChild(subUl);
        }

        container.appendChild(li);
    
    })
}

    /* =========================
   EVENT HANDLERS
========================= */

/* ADD TASK */

addBtn.addEventListener('click',()=>{
    const title = taskInput.value.trim();
    if(!title) return;

    const selectedType = document.querySelector('input[name="taskType"]:checked').value;

    let task;

    if (selectedType === "timed"){
        const deadline = deadlineInput.value;
        if(!deadline) return;
        task = new TimedTask(title, deadline);
        } else {
        task = new Task(title);
    

    }
    tasks.push(task);
    renderTasks(tasks, taskContainer);

    taskInput.value = "";
    deadlineInput.value = "";
})


// MARK ALL DONE BUTTON
markAllBtn.addEventListener('click',()=>{
    tasks.forEach(task =>task.changeStatus('done'));
    renderTasks(tasks, taskContainer);
});

//SAVE TASKS
saveBtn.addEventListener("click", () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
});

/* LOAD TASKS */
loadBtn.addEventListener("click", () => {
    const data = JSON.parse(localStorage.getItem("tasks")) || [];

    
    tasks = data.map(t =>{
        let task;
        if(t.deadline){
            task = new TimedTask(t.title, t.deadline)
        }
        else{
            task = new Task(t.title)
        }

        task.status = t.status;
        task.subtasks = t.subtasks || [];
        return task;
    });
    renderTasks(tasks, taskContainer);
});

