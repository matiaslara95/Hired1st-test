import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserForManage } from 'src/app/models/user-for-manage';
import { UserForRegistration } from 'src/app/models/user-for-registration';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent {

  action: string;
  local_data: any;
  public userForm

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    public dialogRef:
      MatDialogRef<UserDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UserForManage
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;

    if (this.action == "Add") {
      this.userForm = this.formBuilder.group({
        firstName: new FormControl(this.local_data.FirstName, Validators.required),
        lastName: new FormControl(this.local_data.LastName, Validators.required),
        email: new FormControl(this.local_data.Email, Validators.required),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirm: new FormControl('', [Validators.required, Validators.minLength(8)]),
        phoneNumber: new FormControl(this.local_data.PhoneNumber)
      })
    }
    else {
      this.userForm = this.formBuilder.group({
        firstName: new FormControl(this.local_data.FirstName, Validators.required),
        lastName: new FormControl(this.local_data.LastName, Validators.required),
        email: new FormControl(this.local_data.Email, Validators.required),
        password: new FormControl(''),
        confirm: new FormControl(''),
        phoneNumber: new FormControl(this.local_data.PhoneNumber)
      })
    }
  }

  ngOnInit() {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.closeDialog();
      }
    });

    this.dialogRef.backdropClick().subscribe(event => {
      this.closeDialog();
    });
  }

  doAction() {
    //ADD
    if (this.action == "Add") {
      const newUser: UserForRegistration = {
        FirstName: this.userForm.value.firstName,
        LastName: this.userForm.value.lastName,
        Email: this.userForm.value.email,
        Password: this.userForm.value.password!,
        ConfirmPassword: this.userForm.value.confirm!,
        PhoneNumber: this.userForm.value.phoneNumber,
      };
      this.accountService.registerUser(newUser).subscribe((res: any) => {
        if (res.statusCode == 200) {
          //DONE 
          newUser.Id = res.value.id;
          this.dialogRef.close({ event: this.action, data: newUser });
        }
        else if (res.statusCode == 400) {
          alert(res.value.value.errors[0]);
        }
      }, (err) => {
          alert(`There was a problem adding the user ${newUser.FirstName} ${newUser.LastName}`);
      });
    }
    //UPDATE
    else if (this.action == "Update") {
      const newUser: UserForManage = {
        Id: this.local_data.Id,
        FirstName: this.userForm.value.firstName,
        LastName: this.userForm.value.lastName,
        Email: this.userForm.value.email,
        PhoneNumber: this.userForm.value.phoneNumber,
      };
      this.accountService.UpdateUser(newUser).subscribe((res: any) => {
        if (res.statusCode == 200) {
          //DONE 
          this.dialogRef.close({ event: this.action, data: newUser });
        }
      }, (err) => {
        alert(`There was a problem updating the user ${newUser.FirstName} ${newUser.LastName}`);
      });

    }
    //DELETE
    else if (this.action == "Delete") {
      const user: UserForManage = {
        Id: this.local_data.Id
      };
      this.accountService.DeleteUser(user).subscribe((res: any) => {
        if (res.statusCode == 200) {
          //DONE 
          this.dialogRef.close({ event: this.action, data: this.local_data });
        }
      }, (err) => {
        alert(`There was a problem deleting the user ${this.local_data.FirstName} ${this.local_data.LastName}`);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
