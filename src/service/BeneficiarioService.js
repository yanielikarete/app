import axios from 'axios';

export class BeneficiarioService {
    getBeneficiarios() {
        return axios.get('assets/demo/data/beneficiarios.json').then(res => res.data.data);
    }
   
}