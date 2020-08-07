import {Component, OnDestroy, OnInit} from '@angular/core';
import {AppService} from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy{
  todoTasks = [];
  getTasksSocketConnection;
  getUpdatedTaskConnection;


  constructor(private appService: AppService) {
  }
  ngOnInit(): void {

    console.log('Designed and Developed by Bala');
    this.getTasksSocketConnection = this.appService.getNewTask().subscribe(message => {
      // @ts-ignore
      this.todoTasks.push(new TaskComponent(message._id, message.name, message.status));
      this.todoTasks.sort((a, b) => a.status - b.status);
    });

    this.getUpdatedTaskConnection = this.appService.getUpdates().subscribe(message => {
      // @ts-ignore
      this.todoTasks.find(x => x.id === message._id).status = message.status;
      this.todoTasks.sort((a, b) => a.status - b.status);
    });

    this.appService.getTasks().subscribe(message => {
      const output = 'result';
      message[output].forEach(task => {
        this.todoTasks.push(new TaskComponent(task._id, task.name, task.status));
      });

    });

  }

  addTask(task: string): void{
    this.appService.addTask({name: task}).subscribe();
  }

  addToComplete(id: string, status: boolean): void{
    this.appService.updateTask({_id: id, _status: status}).subscribe();
  }

  clearCompleted(): void{

    this.appService.clearCompletedTasks().subscribe(message => {

      const status = 'status';
      if (message[status] === 'success'){
        this.todoTasks =  this.todoTasks .filter( ( obj ) => {
          return obj.status === false;
        });
      }

    });
  }

  ngOnDestroy(): void {
    this.appService.removeListeners();
  }

}

export class TaskComponent {
  constructor(
    public id: string,
    public name: string,
    public status: boolean) { }
}
