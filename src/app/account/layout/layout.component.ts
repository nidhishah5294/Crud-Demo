import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private accountservice: AccountService, private router: Router) { }

  ngOnInit(): void {
    if (this.accountservice.userValue) {
      this.router.navigate(['/']);
    }
  }

}
