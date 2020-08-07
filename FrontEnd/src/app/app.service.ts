import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as io from 'socket.io-client';



@Injectable({
  providedIn: 'root'
})
// @ts-ignore
export class AppService {

  private url = 'http://localhost:3001';
  private socket;

  constructor(private  http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  getNewTask() {
    return new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('newTask', (data) => {
        observer.next(data);
      });
    });
  }
  // tslint:disable-next-line:ban-types
  addTask(task): Observable<Object>{
    const path = 'http://localhost:3000/addTask';
    return this.http.post(path, task);
  }

  // tslint:disable-next-line:ban-types
  getTasks(): Observable<Object>{
    const path = 'http://localhost:3000/getTasks';
    return this.http.get(path);
  }
  // tslint:disable-next-line:ban-types
  clearCompletedTasks(): Observable<Object>{
    const path = 'http://localhost:3000/clearCompletedTasks';
    return this.http.get(path);
  }
  // tslint:disable-next-line:ban-types typedef
  getUpdates() {
    return new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('taskUpdate', (data) => {
        observer.next(data);
      });
    });
  }
  // tslint:disable-next-line:ban-types
  updateTask(task): Observable<Object>{
    const path = 'http://localhost:3000/updateTask';
    return this.http.post(path, task);
  }

  removeListeners(): void{
    this.socket.removeListeners();
  }

}
