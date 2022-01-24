import { Component } from '@angular/core';
import { User } from './model';
import { AccountService } from './service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'demoAngular';
  user: User ;
  constructor(private accountservice: AccountService) {
    this.accountservice.user.subscribe(x => this.user = x);
  }
  logout() {
    this.accountservice.logout();
  }

}
