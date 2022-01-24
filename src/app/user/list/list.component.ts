import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from 'src/app/model';
import { AccountService } from 'src/app/service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  users: any;
  constructor(private accountservice: AccountService, private router: Router) {
    this.getAllUsers();
  }

  getAllUsers() {
    this.accountservice.getAll().pipe(first()).subscribe({
      next: (res) => {
        // console.log(res);
        this.users = res;
        this.users = this.users.map((res: any) => {
          console.log(res)
          res= JSON.parse(res);
          return res;
        });
        // console.log(this.users)
      },
      error: (err) => {
        console.log(err);
      }
    });

  }
  deleteUser(id: any) {
    this.accountservice.delete(id).subscribe(res => {
      this.accountservice.logout();
    })
  }
  edit(id: any) {
    this.router.navigate(['/users/edit/', id]);
  }
  ngOnInit(): void {
  }
  goToAdd(){
     this.router.navigateByUrl('/users/add')
  }
}
