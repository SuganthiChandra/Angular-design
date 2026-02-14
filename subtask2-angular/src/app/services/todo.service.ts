import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  
  private API = 'https://jsonplaceholder.typicode.com/todos?_limit=20';

  constructor(private http: HttpClient) {}

  // 🔥 This is the method your component calls
  getTodos(): Observable<Todo[]> {
    return this.http.get<any[]>(this.API).pipe(
      map(todos =>
        todos.map(todo => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed,
          createdAt: this.generateRandomDate(
            new Date('2024-01-01'),
            new Date('2024-07-01')
          )
        }))
      )
    );
  }

  

  // Generates random creation date
  private generateRandomDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
}
