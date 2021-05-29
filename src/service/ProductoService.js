import axios from 'axios';

export class ProductoService {
    getProductos() {
        return axios.get('assets/demo/data/productos.json').then(res => res.data.data);
    }
   
}