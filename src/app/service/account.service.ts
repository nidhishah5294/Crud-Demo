import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './../model/user';
import { environment } from './../../environments/environment.prod';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSubject: BehaviorSubject<any>;
  public user: Observable<User>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {

    this.userSubject = new BehaviorSubject<any>(localStorage.getItem('user'));
    this.user = this.userSubject.asObservable();

  }
  public get userValue(): User {
    return this.userSubject.value;
  }
  register(user: User) {
    return this.http.post<User>(`${environment.apiUrl}/users/register`, user);
  }
  login(username: string, password: String) {
    return this.http.post<User>(`${environment.apiUrl}/users/authenticate`, { username, password }).
      pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }))
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }
  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }
  update(id: string, user: User) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, user).pipe(map(x => {
      if (id === this.userValue.id) {
        const user = { ...this.userValue, ...this.user };
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
      }
      return x;
    }));
  }
  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
