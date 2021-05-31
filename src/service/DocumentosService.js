import axios from 'axios';

export class DocumentosService {
    getHistorialFacturas() {
        return axios.get('assets/demo/data/facturas.json').then(res => res.data.data);
    }
}