export class Product {
    codigo: string;
    nombre: string;
    cantidad: number;

    constructor(_codigo: string, _nombre: string, _cantidad: number){
        this.update(_codigo, _nombre, _cantidad);
    }

    update(_codigo: string, _nombre: string, _cantidad: number) {
        this.codigo = _codigo;
        this.nombre = _nombre;
        this.cantidad = _cantidad;
    }
}