import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { UpdateProductPage } from '../update-product/update-product.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private ProductForm: FormGroup;
  public productList: Product[] = [];

  constructor(private modalController: ModalController, private fb: FormBuilder, private alertController: AlertController) {
    this.ProductForm = this.fb.group({
      codigo: [null, [Validators.required, Validators.minLength(1)]],
      nombre: [null, [Validators.required, Validators.minLength(1)]],
      cantidad: [null, [Validators.required, Validators.minLength(1), Validators.pattern("^[0-9]*$")]]
    });
  }

  async presentAlertDelete(codeProduct: String) {
    const alert = await this.alertController.create({
      cssClass: 'alertCustom',
      header: 'Eliminar producto',
      message: '¿Estás seguro de que deseas eliminar el producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Eliminar',
          cssClass: 'buttonAlertDelete',
          handler: () => {
            this.deleteProduct(codeProduct);
          }
        }
      ]
    });

    await alert.present();
  }

  async presentAlertAdd() {
    const alert = await this.alertController.create({
      cssClass: 'alertCustom',
      header: 'No se agrego el producto',
      message: 'El código del producto ya existe.',
      buttons: ['Entendido']
    });

    await alert.present();
  }

  async presentModalUpdateProduct(product: Product) {
    const modal = await this.modalController.create({
      component: UpdateProductPage,
      componentProps: {
        'product': product,
        'productList': this.productList
      },
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  deleteProduct(codeProduct: String){
    this.productList.forEach((element,index)=>{
      if(element.codigo == codeProduct) this.productList.splice(index,1);
   });
  }

  numberOnlyValidation(event: KeyboardEvent) {
    let pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  addProduct(){
    if(this.ProductForm.valid) {
      if(this.ProductForm.value.cantidad >= 0){
        let code = '';
        this.productList.forEach((element)=>{
          if(element.codigo == this.ProductForm.value.codigo) {
            code = element.codigo ;
            this.presentAlertAdd();
            return;
          }
        });
        if(code == this.ProductForm.value.codigo)
          return;
        let product: Product = new Product(this.ProductForm.value.codigo, this.ProductForm.value.nombre, this.ProductForm.value.cantidad);
        this.productList.push(product);
        this.ProductForm.reset();
      }
    }
  }
}
