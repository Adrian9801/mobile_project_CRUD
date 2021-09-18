import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Product } from 'src/app/models/product';
import { NavParams } from '@ionic/angular';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.page.html',
  styleUrls: ['./update-product.page.scss'],
  providers: [ProductService]
})
export class UpdateProductPage implements OnInit {
  private ProductForm: FormGroup;
  private product: Product;
  private productList: Product[];

  constructor(private productService: ProductService, private navParams: NavParams, private modalController: ModalController, private fb: FormBuilder, private alertController: AlertController) {
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

  numberOnlyValidation(event: KeyboardEvent) {
    let pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
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

  async errorAlertAdd(msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'alertCustom',
      header: 'Error',
      message: msg,
      buttons: ['Entendido']
    });

    await alert.present();
  }

  updateProduct(){
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
        this.productService.updateProduct({codigo: this.ProductForm.value.codigo, nombre: this.ProductForm.value.nombre, cantidad: this.ProductForm.value.cantidad, codigoAnt: this.product.codigo}).subscribe(res => {
          if(res[0][0].result == 'correct'){
            this.product.codigo = this.ProductForm.value.codigo;
            this.product.nombre = this.ProductForm.value.nombre;
            this.product.cantidad = this.ProductForm.value.cantidad;
            this.ProductForm.reset();
            this.closeModal();
          }
          else{
            if(res[0][0].result == 'failConect')
              this.errorAlertAdd('No se pudo conectar con la base de datos');
            else
              this.errorAlertAdd('No se pudo actualizar el producto');
          }
        });
      }
    }
  }

  closeModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }
}
