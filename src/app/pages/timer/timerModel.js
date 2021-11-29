const { db } = require("../../db");

export class Model {

    constructor(dbTaskList, dbSettings) {
        this.failedPomodora = 0;
        this.finishedPomodora = 0;
        this.tasksList = dbTaskList.items;
        this.tasksSettings = dbSettings;

        const activeTask = this.tasksList.find(item => item.status.ACTIVE === true);
        this.activeTask = activeTask;
        // const taskColor = [
        //     {name:"urgent",color:'red'},
        //     {name:"high",color:'yellow'},
        //     {name:"middle",color:'blue'},
        //     {name:"low",color:'green'},

        // ]
        
        // const color = taskColor.find(item=> item.name.includes(activeTask.priority.name))

        // document.querySelector('.time-circle').style.borderColor = color.color;
    }

    backToGlobalList(task) {
        db.updateTask(task);

        setTimeout(() => window.location = "http://localhost:3000/tasks-list",
            500);
    }

    failPomodoro(task) {
        this.failedPomodora += task;
    }
    

    finishPomodora(task) {
        this.finishedPomodora += task;
    }

    finishTask(task) {
        const totalPomodoros = this.failedPomodora + this.finishedPomodora;
        const date = new Date();
        const todayDate = date.toISOString().split('T')[0];

        this.activeTask.completedDate = todayDate;
        this.activeTask.failedPomodoros = this.failedPomodora;
        this.activeTask.completedPomodoros = this.finishedPomodora;
        this.activeTask.status.ACTIVE = false;
        this.activeTask.status.COMPLETED = true;

        if (totalPomodoros / 2 >= this.failedPomodora) {
            document.querySelector('.text-2-status').textContent = 'Completed';
               console.log('task succesfull');
        } else {
            this.activeTask.failedTask = true;
            document.querySelector('.text-2-status').textContent = 'Failed';
            console.log('task failed');
        }

        db.updateTask(this.activeTask);
    }
}