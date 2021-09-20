import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/Http'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly URL_API = 'https://ancient-beyond-04257.herokuapp.com'; // http://localhost:8090

  constructor(private http: HttpClient) { }

  getProducts(){
    return this.http.get(this.URL_API+ '/Products');
  }

  updateProduct(procduct){
    return this.http.post(this.URL_API + '/UpadateProduct', procduct);
  }

  insertProduct(procduct){
    return this.http.post(this.URL_API + '/InsertProduct', procduct);
  }

  deleteProduct(codigo: string){
    return this.http.get(this.URL_API+ '/deleteProduct' + `/${codigo}`);
  }
}
