import axios from 'axios';

export class ProveedorService {
    getProveedors() {
        return axios.get('assets/demo/data/proveedores.json').then(res => res.data.data);
    }
   
}