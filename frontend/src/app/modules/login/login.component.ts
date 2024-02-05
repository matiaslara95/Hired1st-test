import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { AuthResponse } from 'src/app/models/authentication-response';
import { UserForAuthentication } from 'src/app/models/user-for-authentication';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loginValid = true;
  public username = '';
  public password = '';

  private _destroySub$ = new Subject<void>();
  private returnUrl: string = "";

  errorMessage: string = '';
  showError: boolean = false;

  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
  ) {  }

  public ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  public ngOnDestroy(): void {
    this._destroySub$.next();
  }

  public onSubmit(): void {
    this.loginValid = true;

    const login: UserForAuthentication = {
      email: this.loginForm.value["email"]!,
      password: this.loginForm.value["password"]!,
    };
    this.accountService.Login(login).subscribe({
      next: (res: AuthResponse) => {
        localStorage.setItem("id", res.id);
        localStorage.setItem("access_token", res.token);
        localStorage.setItem("name", res.name);
        localStorage.setItem("email", login.email!);
        this.router.navigate([this.returnUrl], { state : {isAuthenticated: res.isAuthSuccessful}} );
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      }
    });
  }
}
