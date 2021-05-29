import axios from 'axios';

export class ProductoService {
    getProductos() {
        return axios.get('assets/demo/data/productoes.json').then(res => res.data.data);
    }
   
}