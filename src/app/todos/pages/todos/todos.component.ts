import { TodosService } from './../../services/todos.service';
import { AuthService } from './../../../auth/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Todo } from '../../../models/todo';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent implements OnInit {

  todoForm: FormGroup = new FormGroup({
    body: new FormControl('', [ Validators.required ]),
    done: new FormControl(false)
  })

  todos: Todo[] = []

  constructor(
    private snackbar: MatSnackBar,
    private authService:AuthService,
    private todosService: TodosService
  ) { }

  ngOnInit(): void {
    this.loadTodos()
  }

  loadTodos(): void {
    this.todosService.getTodos()
    .subscribe(
      (receivedTodos)=>{
        this.todos = receivedTodos
      }
    )
  }

  create(): void {
    const todo: Todo = this.todoForm.value
    this.todosService.createTodo(todo)
    .subscribe(
      ()=>{
        this.todoForm.reset()
        this.snackbar.open('Tarefa salva', 'Ok',{
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
        this.loadTodos()
      }
    )
    }

    delete(todo: Todo): void {
      this.todosService.deleteTodo(todo)
      .subscribe(
        () => {
          this.snackbar.open('Tarefa excluída', 'Ok', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          })

          this.loadTodos()
        }
      )
    }

  toggleDone(todo: Todo): void {
    todo.done = !todo.done
    this.todosService.updateTodo(todo).subscribe()

  }

  signOut(): void {
    this.authService.singOut().subscribe()

  }
}
