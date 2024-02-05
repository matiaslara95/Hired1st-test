import { Component, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AccountService } from 'src/app/services/account.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from '../dialogs/user-dialog/user-dialog.component';
import { UserForManage } from 'src/app/models/user-for-manage';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  @Input() isAuthenticated = '';
  displayedColumns: string[] = ['Id', 'FirstName', 'LastName', 'Email', 'PhoneNumber', 'action'];
  ELEMENT_DATA: UserForManage[] = [];
  dataSource: Array<UserForManage> = [];

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog
  ) {
    this.accountService.GetUsers().subscribe((res) => {
      this.ELEMENT_DATA = res;
      this.dataSource = this.ELEMENT_DATA;
    });
  }

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  openDialog(action: any, obj: any) {
    obj.action = action;
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'Add') {
        this.addRowData(result.data);
      } else if (result.event == 'Update') {
        this.updateRowData(result.data);
      } else if (result.event == 'Delete') {
        this.deleteRowData(result.data);
      }
    });
  }

  addRowData(row_obj: {
    Id: any, FirstName: any; LastName: any; Email: any; PhoneNumber: any;
  }) {
    var d = new Date();
    this.dataSource.push({
      Id: row_obj.Id,
      FirstName: row_obj.FirstName,
      LastName: row_obj.LastName,
      Email: row_obj.Email,
      PhoneNumber: row_obj.PhoneNumber
    });
    this.table.renderRows();

  }
  updateRowData(row_obj: any) {
    this.dataSource = this.dataSource.filter((value, key) => {
      if (value.Id == row_obj.Id) {
        value.FirstName = row_obj.FirstName;
        value.LastName = row_obj.LastName;
        value.Email = row_obj.Email;
        value.PhoneNumber = row_obj.PhoneNumber;
      }
      return true;
    });
  }
  deleteRowData(row_obj: any) {
    this.dataSource = this.dataSource.filter((value, key) => {
      return value.Id != row_obj.Id;
    });
  }
}
