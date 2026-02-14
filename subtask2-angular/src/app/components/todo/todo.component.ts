import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, map } from 'rxjs';

import { TodoService, Todo } from '../../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  fromDate: string = '';
  toDate: string = '';
  sortBy: 'title' | 'date' = 'title';

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  selectedTodo: Todo | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.todoService.getTodos().subscribe(todos => {
      this.todosSubject.next(todos);
    });
  }

  // 🔥 Filtering + Sorting combined
  applyFilter() {

    let todos = [...this.todosSubject.value];

    if (this.fromDate) {
      const fromTime = new Date(this.fromDate).getTime();
      todos = todos.filter(t =>
        new Date(t.createdAt).getTime() >= fromTime
      );
    }

    if (this.toDate) {
      const toTime = new Date(this.toDate).getTime();
      todos = todos.filter(t =>
        new Date(t.createdAt).getTime() <= toTime
      );
    }

    // Sorting
    todos.sort((a, b) => {
      if (this.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(a.createdAt).getTime() -
               new Date(b.createdAt).getTime();
      }
    });

    this.todosSubject.next(todos);
  }

  selectTodo(todo: Todo) {
    this.selectedTodo = { ...todo }; // copy for editing
  }

  // 🔥 THIS FIXES SAVE
  saveEdit() {
    if (!this.selectedTodo) return;

    const updated = this.todosSubject.value.map(t =>
      t.id === this.selectedTodo!.id ? this.selectedTodo! : t
    );

    this.todosSubject.next(updated);
    this.selectedTodo = null;
  }

  resetFilter() {
    this.todoService.getTodos().subscribe(todos => {
      this.todosSubject.next(todos);
    });

    this.fromDate = '';
    this.toDate = '';
  }
}
