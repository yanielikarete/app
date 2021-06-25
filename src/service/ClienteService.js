import axios from 'axios';

export class ClienteService {
    getClientes() {
        return axios.get('assets/demo/data/clientes.json').then(res => res.data.data);
    }
   
}