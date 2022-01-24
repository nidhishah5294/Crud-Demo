import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'src/app/service';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/service/alert.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  constructor(
    private formbuilder: FormBuilder,
    private accountservice: AccountService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService:AlertService
  ) {
    this.form = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      id:[0]
    });

  }
  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.loading = true;
      this.accountservice.register(this.form.value).pipe(first()).subscribe({
        next: () => {
          this.alertService.success('Registration Successfully',{keepAfterRouteChange : true})
          this.router.navigate(['../login'], { relativeTo: this.route });
        },
        error: err => {
          console.log(err)
          this.alertService.error(err)
          this.loading = false;
        }
      });
    } else {
      return;
    }
  }
}
