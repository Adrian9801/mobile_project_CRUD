import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Product } from 'src/app/models/product';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { UpdateProductPage } from '../update-product/update-product.page';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [ProductService]
})
export class HomePage {
  private ProductForm: FormGroup;
  private productList: Product[] = [];

  constructor(private productService: ProductService, private modalController: ModalController, private fb: FormBuilder, private alertController: AlertController) {
    this.ProductForm = this.fb.group({
      codigo: [null, [Validators.required, Validators.minLength(1)]],
      nombre: [null, [Validators.required, Validators.minLength(1)]],
      cantidad: [null, [Validators.required, Validators.minLength(1), Validators.pattern("^[0-9]*$")]]
    });
    this.loadProducts();
  }

  loadProducts(){
    this.productService.getProducts().subscribe(res => {
      let listResult = res as Object[][];
      if(listResult.length > 1){
        this.productList = listResult[0] as Product[];
      }
      else{
        if(res[0][0].result == 'failConect')
          this.errorAlertAdd('No se pudo conectar con la base de datos');
        else
          this.errorAlertAdd('No se pudo obtener los productos');
      }
    });
  }

  async presentAlertDelete(codeProduct: string) {
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

  async errorAlertAdd(msg: string) {
    const alert = await this.alertController.create({
      cssClass: 'alertCustom',
      header: 'Error',
      message: msg,
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

  deleteProduct(codeProduct: string){
    this.productList.forEach((element,index)=>{
      if(element.codigo == codeProduct) { 
        this.productService.deleteProduct(codeProduct).subscribe(res => {
          if(res[0][0].result == 'correct')
            this.productList.splice(index,1);
          else{
            if(res[0][0].result == 'failConect')
              this.errorAlertAdd('No se pudo conectar con la base de datos');
            else
              this.errorAlertAdd('No se pudo eliminar el producto');
          }
        });
      }
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
        this.productService.insertProduct({codigo: this.ProductForm.value.codigo, nombre: this.ProductForm.value.nombre, cantidad: this.ProductForm.value.cantidad}).subscribe(res => {
          if(res[0][0].result == 'correct'){
            let product: Product = new Product(this.ProductForm.value.codigo, this.ProductForm.value.nombre, this.ProductForm.value.cantidad);
            this.productList.push(product);
            this.ProductForm.reset();
          }
          else{
            if(res[0][0].result == 'failConect')
              this.errorAlertAdd('No se pudo conectar con la base de datos');
            else
              this.errorAlertAdd('No se pudo insertar el producto');
          }
        });
      }
    }
  }
}
