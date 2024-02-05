import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core'; 
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthResponse } from 'src/app/models/authentication-response';
import { RegistrationResponse } from 'src/app/models/registration-response';
import { UserForAuthentication } from 'src/app/models/user-for-authentication';
import { UserForRegistration } from 'src/app/models/user-for-registration';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  private returnUrl: string = "";
  errorMessage: string = '';
  showError: boolean = false;

  registerForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirm: new FormControl(''),
    phoneNumber: new FormControl(''),
  });

  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router,) {  }
    
  public ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    const user: UserForRegistration = {
      FirstName: this.registerForm.value["firstName"]!,
      LastName: this.registerForm.value["lastName"]!,
      Email: this.registerForm.value["email"]!,
      Password: this.registerForm.value["password"]!,
      ConfirmPassword: this.registerForm.value["confirm"]!,
      PhoneNumber: this.registerForm.value["phoneNumber"]!,
    };
    this.accountService.registerUser(user).subscribe({
      next: (res: RegistrationResponse) => {
        const login: UserForAuthentication = {
          email: user.Email,
          password: user.Password
        }
        this.accountService.Login(login).subscribe({
          next: (response: AuthResponse) => {
            console.log("login", response)
            localStorage.setItem("id", response.id);
            localStorage.setItem("name", response.name);
            localStorage.setItem("access_token", response.token);
            localStorage.setItem("email", login.email!);
            this.router.navigate([this.returnUrl], { state : {isAuthenticated: response.isAuthSuccessful}} );
          },
          error: (err: HttpErrorResponse) => {
            this.errorMessage = err.message;
            this.showError = true;
          }});
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
        alert("Error")
      }
    });
  }
}
