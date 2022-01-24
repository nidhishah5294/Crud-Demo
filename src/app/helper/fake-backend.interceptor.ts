
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../model';

// array in local storage for registered users
const usersKey: string = 'angular-10-registration-login-example-users';
let users: any = JSON.parse(localStorage.getItem(usersKey) || '[]');


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = request;

    return handleRoute();

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users/register') && method === 'POST':
          return register();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.match(/\/users\/\d+$/) && method === 'GET':
          return getUserById();
        case url.match(/\/users\/\d+$/) && method === 'PUT':
          return updateUser();
        case url.match(/\/users\/\d+$/) && method === 'DELETE':
          return deleteUser();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate() {
      const { username, password } = body;

      const user = users.find((x: any) => {
        x = JSON.parse(x);

        if (x.username == username && x.password == password) {
          return x;
        }
      });

      if (!user) return error('Username or password is incorrect');
      return ok({
        ...basicDetails(user),
        token: 'fake-jwt-token'
      })
    }

    function register() {
      const user: any = body;
       
      if (users.find((x: any) =>{ x.username === user.username})) {

        return error('Username "' + user.username + '" is already taken')
      }

      // user.id = users.length ? Math.max(...users.map((x: any) => x.id)) + 1 : 1;

      users.push(JSON.stringify(user));

      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }

    function getUsers() {
      if (!isLoggedIn()) return unauthorized();
      return ok(users);
    }

    function getUserById() {
      if (!isLoggedIn()) return unauthorized();

      const user = users.find((x: any) => {
        console.log(x);
        x = JSON.parse(x);
        console.log(idFromUrl())
        console.log(x.id == idFromUrl())
        if (x.id === idFromUrl())
          return x;
      });
      console.log(user);
      return ok(user);
    }

    function updateUser() {
      if (!isLoggedIn()) return unauthorized();

      let params = body;
      let i = 0;
      users.find((x: any) => {
        x = JSON.parse(x);
        i++;
        if (x.id === idFromUrl())
          return x;
      });
      // console.log(JSON.parse(user))
      console.log(params)
      // only update password if entered
      if (!params.password) {
        delete params.password;
      }
      // user = JSON.parse(user)
      // update and save user
      // console.log(Object.assign(params, user));
      users[--i] = JSON.stringify(params);
      localStorage.setItem(usersKey, JSON.stringify(users));

      return ok();
    }

    function deleteUser() {
      if (!isLoggedIn()) return unauthorized();

      users = users.filter((x: any) => {
        x = JSON.parse(x);
        return x.id !== idFromUrl()
      });
      alert(users);
      localStorage.removeItem(usersKey);
      localStorage.setItem(usersKey, JSON.stringify(users));
      return ok();
    }

    // helper functions

    function ok(body?: any) {
      return of(new HttpResponse({ status: 200, body }))
        .pipe(delay(500)); // delay observable to simulate server api call
    }

    function error(message: any) {
      return throwError({ error: { message } })
        .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    }

    function unauthorized() {
      return throwError({ status: 401, error: { message: 'Unauthorized' } })
        .pipe(materialize(), delay(500), dematerialize());
    }

    function basicDetails(user: any) {
      const { id, username, firstName, lastName } = user;
      return { id, username, firstName, lastName };
    }

    function isLoggedIn() {
      return headers.get('Authorization') === 'Bearer fake-jwt-token';
    }

    function idFromUrl() {
      const urlParts = url.split('/');
      // alert(parseInt(urlParts[urlParts.length - 1]));
      return parseInt(urlParts[urlParts.length - 1]);
    }
  }
}

export const fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};

