import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AccountService } from 'src/app/service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  form: FormGroup;
  isEdit: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  id: string;
  constructor(
    private formbuilder: FormBuilder,
    private alertService: AlertService,
    private accountservice: AccountService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    // const passwordValidator: any = Validators.required;
    // passwordValidator.push(Validators.minLength(6));

    this.form = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      id: [0]
    });

    this.getCurrentUser();
  }

  get f() {
    return this.form.controls;
  }
  getCurrentUser() {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id)
    if (this.id) {
      this.isEdit = true;
      this.accountservice.getById(this.id).pipe(first()).subscribe(res => {
        console.log(res);
        this.form.patchValue(res);
      })
    }
  }

  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    if (this.f.invalid) {
      return;
    }
    console.log(this.form.valid)
    this.loading = true;
    if (!this.isEdit) {
      this.createUser();
    }
    
   else if(this.isEdit && this.form.valid) {
      this.updateUser();
    }
    else {
      this.loading = false;
      return;
    }
  }

  createUser() {
    this.accountservice.register(this.form.value).pipe(first()).subscribe({
      next: () => {
        this.alertService.success('User added successfully', { keepAfterRouteChange: true });
        this.router.navigate(['../', { relativeTo: true }]);
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      }
    })
  }
  updateUser() {
    this.accountservice.update(this.id, this.form.value).pipe(first()).subscribe({
      next: () => {
        this.alertService.success('USer edited successfully', { keepAfterRouteChange: true });
        this.router.navigate(['../', { relativeTo: true }]);
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
      }
    })
  }
  goToBack() {
    this.router.navigate(['/users']);
  }
}
