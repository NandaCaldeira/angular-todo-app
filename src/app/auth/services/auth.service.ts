import { Todo } from './../../models/todo';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, tap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersCollection = this.store.collection<User>('users')

  constructor(
    private authentication: AngularFireAuth,
    private store:AngularFirestore
  ) { }

  singUpWithEmailAndPassword( email: string, password : string){

  return from (this.authentication.createUserWithEmailAndPassword(email,password))
  .pipe(
    tap((credencials) => {
      const uid = credencials.user?.uid as string

      const email = credencials.user?.email as string

      const todos:Todo[] = []

      this.usersCollection.doc(uid).set({
        uid: uid,
        email: email,
        todos: todos
      })

      credencials.user?.sendEmailVerification()

    })
  )
  }
}
