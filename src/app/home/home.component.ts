import { Component, OnInit } from '@angular/core';
import { User } from '../model';
import { AccountService } from '../service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: User;
  constructor(private accounservice: AccountService) {
    this.user = this.accounservice.userValue;
  }

  ngOnInit(): void {
  }

}
