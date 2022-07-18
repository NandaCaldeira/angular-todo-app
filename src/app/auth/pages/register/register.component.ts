import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  loginForm: FormGroup = this.fb.group({
    email: ['', [ Validators.required, Validators.email ]],
    password: ['', [ Validators.required, Validators.minLength(6) ]]
  })

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  register() {
    const email =  this.loginForm.value.email
    const password = this.loginForm.value.password

    this.authService.singUpWithEmailAndPassword(email, password)
    .subscribe(
      () => {
        this.snackbar.open('Resgistrado com sucesso!', 'Ok',{
          duration: 5000,
          horizontalPosition: 'right',
         verticalPosition: 'top'
        })
      }
    )

  }

  signInWithGoogle() {

  }
}
