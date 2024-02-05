import { Component, Inject, Optional } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductForManage } from 'src/app/models/product-for-manage';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.css']
})
export class ProductDialogComponent {
  action: string;
  userId: string;
  local_data: any;
  public productForm

  constructor(
    private productService: ProductService,
    private formBuilder: FormBuilder,
    public dialogRef:
      MatDialogRef<ProductDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ProductForManage
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.userId = this.local_data.idUser;

    this.productForm = this.formBuilder.group({
      name: new FormControl(this.local_data.Name, Validators.required),
      price: new FormControl(this.local_data.Price, Validators.required),
      description: new FormControl(this.local_data.Description, Validators.required)
    })
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
      const newProduct: ProductForManage = {
        Name: this.productForm.value.name,
        Price: this.productForm.value.price,
        Description: this.productForm.value.description,
        UserId: this.userId,
      };
      this.productService.CreateProduct(newProduct).subscribe((res: any) => {
        if (res.statusCode == 200) {
          //DONE 
          newProduct.Id = res.value.id;
          this.dialogRef.close({ event: this.action, data: newProduct });
        }
      }, (err) => {
        // alert(`There was a problem adding the user ${newUser.FirstName} ${newUser.LastName}`);
      });
    }
    //UPDATE
    else if (this.action == "Update") {
      const newProduct: ProductForManage = {
        Id: this.local_data.Id,
        Name: this.productForm.value.name,
        Price: this.productForm.value.price,
        Description: this.productForm.value.description,
        UserId: this.userId,
      };
      this.productService.UpdateProduct(newProduct).subscribe((res: any) => {
        if (res.statusCode == 200) {
          //DONE 
          this.dialogRef.close({ event: this.action, data: newProduct });
        }
      }, (err) => {
        // alert(`There was a problem updating the user ${newUser.FirstName} ${newUser.LastName}`);
      });

    }
    //DELETE
    else if (this.action == "Delete") {
      const product: ProductForManage = {
        Id: this.local_data.Id
      };
      this.productService.DeleteProduct(product).subscribe((res: any) => {
        if (res.statusCode == 200) {
          //DONE 
          this.dialogRef.close({ event: this.action, data: this.local_data });
        }
      }, (err) => {
        // alert(`There was a problem deleting the product}`);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}
