import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  ProductForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.ProductForm = this.fb.group({
      codigo: [null, [Validators.required, Validators.minLength(1)]],
      nombre: [null, [Validators.required, Validators.minLength(1)]],
      cantidad: [null, [Validators.required, Validators.minLength(1)]]
    });
  }

  numberOnlyValidation(event: any) {
    let pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    let cant: number = this.ProductForm.value.cantidad;
    if(cant == null || cant == 0)
      pattern = /[1-9]/;

    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

}
