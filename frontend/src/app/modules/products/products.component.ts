import { Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ProductForManage } from 'src/app/models/product-for-manage';
import { ProductService } from 'src/app/services/product.service';
import { ProductDialogComponent } from '../dialogs/product-dialog/product-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  @Input() isAuthenticated = '';
  displayedColumns: string[] = ['Id', 'Name', 'Price', 'Description', 'action'];
  ELEMENT_DATA: ProductForManage[] = [];
  dataSource: Array<ProductForManage> = [];
  idUser: string = "";

  constructor(
    private productService: ProductService,
    public dialog: MatDialog
  ) {
    this.idUser = localStorage.getItem("id")!;
    this.productService.GetProducts(this.idUser).subscribe((res) => {
      this.ELEMENT_DATA = res;
      this.dataSource = this.ELEMENT_DATA;
    });
  }

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  openDialog(action: any, obj: any) {
    obj.action = action;
    obj.idUser = this.idUser;
    const dialogRef = this.dialog.open(ProductDialogComponent, {
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
    Id: any; Name: any; Price: any; Description: any; 
  }) {
    var d = new Date();
    this.dataSource.push({
      Id: row_obj.Id,
      Name: row_obj.Name,
      Price: row_obj.Price,
      Description: row_obj.Description,
    });
    this.table.renderRows();

  }
  updateRowData(row_obj: any) {
    this.dataSource = this.dataSource.filter((value, key) => {
      if (value.Id == row_obj.Id) {
        value.Name = row_obj.Name;
        value.Price = row_obj.Price;
        value.Description = row_obj.Description;
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
