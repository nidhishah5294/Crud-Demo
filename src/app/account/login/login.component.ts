import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private alertservice: AlertService,
    private accountservice: AccountService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.alertservice.clear();

    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.accountservice.login(this.f.username.value, this.f.password.value).pipe(first()).subscribe({
      next: () => {
        const returnURL = this.route.snapshot.queryParams['retrunUrl'] || '/';
        console.log(this.route.snapshot.queryParams['retrunUrl'])
        console.log(returnURL)
        this.router.navigateByUrl(returnURL);
      },
      error: err => {
        console.log(err)
        this.alertservice.error(err);
        this.loading = false;
      }
    })

  }

  ngOnInit(): void {
  }

}
