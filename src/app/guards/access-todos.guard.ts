import { AuthService } from './../auth/services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccessTodosGuard implements CanActivate {

  constructor(
    private authService : AuthService,
    private router: Router
  ){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser
  .pipe(
    map((user)=>{
      if(user == null){
        return this.router.parseUrl('/auth/login')
      }
      if(!user.emailVerified){
        user.sendEmailVerification()
        return this.router.parseUrl('/athu/verify-email')
      }
      return true
    })
  )
  }

}
