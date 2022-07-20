import { Todo } from './../../models/todo';
import { User } from 'src/app/models/User';
import { AuthService } from './../../auth/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  private userCollection = this.store.collection<User>('users')
  private currentUser = this.authService.currentUser

  constructor(
    private store: AngularFirestore,
    private authService: AuthService
  ) {}

  getTodos() {
    return this.currentUser.pipe(
      mergeMap(user => {
        return this.userCollection.doc(user?.uid).get()
      }),
      map(userDoc => {
        return userDoc.data()?.todos || []
      })
    );
  }
  createTodo(todo: Todo) {
    return this.currentUser.pipe(
      mergeMap(user=> {
        return this.userCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        const user = userDoc.data() as User

        todo.id = this.store.createId()

        user.todos.push(todo)

       return userDoc.ref.update(user)
      })
    )
  }

  deleteTodo(todo: Todo) {
    return this.currentUser
    .pipe(
      mergeMap(user => {
        return this.userCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        /**
         * a função data retorna um objeto com os dados do documento
         * do firebase
         */
        const user = userDoc.data() as User

        user.todos = user.todos.filter(t => {
          return t.id != todo.id
        })

        /**
         * a função update serve para atualizar os dados de um documento no firebase
         */
        return userDoc.ref.update(user)
      })
    )
  }

  updateTodo(todo: Todo) {
    return this.currentUser
    .pipe(
      mergeMap(user => {
        return this.userCollection.doc(user?.uid).get()
      }),
      mergeMap(userDoc => {
        /**
         * a função data retorna um objeto com os dados do documento
         * do firebase
         */
        const user = userDoc.data() as User

        user.todos = user.todos.map(t => {
          if (t.id == todo.id) {
            return todo
          } else {
            return t
          }
        })
        /**
         * a função update serve para atualizar os dados de um documento no firebase
         */
        return userDoc.ref.update(user)
      })
    )
  }
}
