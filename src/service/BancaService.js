import axios from 'axios';

export class BancaService {
    getCuentas() {
        return axios.get('assets/demo/data/cuentas.json').then(res => res.data.data);
    }
    getDiarioContable(){
        return axios.get('assets/demo/data/diario_contable.json').then(res => res.data.data);
    }
    getOperaciones(){
        return axios.get('assets/demo/data/diario_contable.json').then(res => res.data.data);

    }
    getFacturas(){
        return axios.get('assets/demo/data/diario_contable.json').then(res => res.data.data);

    }
}