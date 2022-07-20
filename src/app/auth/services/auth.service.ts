import { Router } from '@angular/router';
import { Todo } from './../../models/todo';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, tap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from 'src/app/models/User';
import { GoogleAuthProvider } from 'firebase/auth'
import { async } from '@firebase/util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usersCollection = this.store.collection<User>('users')

  constructor(
    private authentication: AngularFireAuth,
    private store:AngularFirestore,
    private router: Router
  ) { }
  get currentUser(){
    return this.authentication.authState
  }
  private saveUserData(){
    return tap(async (credencials:firebase.default.auth.UserCredential) => {
      const uid = credencials.user?.uid as string

      const email = credencials.user?.email as string

      const todos:Todo[] = []

      const user= await this.usersCollection.ref.where('email','==',email).get()
      .then(users=>{
       return users.docs[0]
      })
      if(user==undefined){


      this.usersCollection.doc(uid).set({
        uid: uid,
        email: email,
        todos: todos
      })

      credencials.user?.sendEmailVerification()

    }
    })
  }

  singUpWithEmailAndPassword( email: string, password : string){

  return from (this.authentication.createUserWithEmailAndPassword(email,password))
  .pipe(
    this.saveUserData()

  )
  }
  signInWithEmailAndPassword(email: string, password: string) {
  return from(this.authentication.signInWithEmailAndPassword(email, password))
  }

  signInWithGoogle (){
    const googleProvider = new GoogleAuthProvider

    return from (this.authentication.signInWithPopup(googleProvider))
    .pipe(
      this.saveUserData()
    )
  }

  singOut(){
    return from (this.authentication.signOut()).pipe(
      tap(()=> {
        this.router.navigateByUrl('/auth/login')
      })
    )
  }
}
