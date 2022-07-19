import { User } from 'src/app/models/User';
import { AuthService } from './../../auth/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Injectable } from '@angular/core';
import { mergeMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private userCollection = this.store.collection<User>('users')
  private currentUser = this.authService.currentUser

  constructor(
    private store:AngularFirestore,
    private authService: AuthService
  ) { }

  getTodos(){
    this.currentUser
    .pipe(
      mergeMap(user =>{
       return this.userCollection.doc(user?.uid).get()
      })
    )
  }




}
