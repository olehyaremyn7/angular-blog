import {Component, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../shared/interfaces';
import {AuthorizationService} from '../shared/services/authorization.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalComponent} from '../../partials/modal/modal.component';
import {MatDialog} from '@angular/material/dialog';
import {ModalAdminComponent} from '../shared/components/modal/modal.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  form: FormGroup
  hide = true;
  submitted = false;
  message: string;

  constructor(public authService: AuthorizationService,
              private router: Router,
              private route: ActivatedRoute,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['notLogin']) {
        this.message = 'Please, sign in'
      } else if (params['authFailed']) {
        this.message = 'Sign in again'
      }
    })
    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    })
  }

  submit() {
    if (this.form.invalid) {
      return
    }

    this.submitted = true;

    const user: User = {
      email: this.form.value.email,
      password: this.form.value.password
    }

    this.authService.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
      this.submitted = false;
    }, () => {
      this.submitted = false
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(ModalAdminComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

