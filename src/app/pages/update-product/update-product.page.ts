import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
})
export class UpdateProductPage implements OnInit {
  private ProductForm: FormGroup;
  private product: Product;
  private productList: Product[];

  constructor(private navParams: NavParams, private modalController: ModalController, private fb: FormBuilder, private alertController: AlertController) {
    this.product = navParams.get('product');
    this.productList = navParams.get('productList');
    this.ProductForm = this.fb.group({
      codigo: [this.product.codigo, [Validators.required, Validators.minLength(1)]],
      nombre: [this.product.nombre, [Validators.required, Validators.minLength(1)]],
      cantidad: [this.product.cantidad, [Validators.required, Validators.minLength(1), Validators.pattern("^[0-9]*$")]]
    });
   }

  ngOnInit() {
  }

  async presentAlertAdd() {
    const alert = await this.alertController.create({
      cssClass: 'alertCustom',
      header: 'No se actualizo el producto',
      message: 'El código del producto ya existe.',
      buttons: ['Entendido']
    });

    await alert.present();
  }

  addProduct(){
    if(this.ProductForm.valid) {
      if(this.ProductForm.value.cantidad >= 0){
        let code = '';
        this.productList.forEach((element)=>{
          if(element.codigo == this.ProductForm.value.codigo && element.codigo != this.product.codigo) {
            code = element.codigo ;
            this.presentAlertAdd();
            return;
          }
        });
        if(code == this.ProductForm.value.codigo)
          return;
        this.product.codigo = this.ProductForm.value.codigo;
        this.product.nombre = this.ProductForm.value.nombre;
        this.product.cantidad = this.ProductForm.value.cantidad;
        this.ProductForm.reset();

        this.closeModal();
      }
    }
  }

  closeModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
