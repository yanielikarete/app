import axios from 'axios';

export class EstablecimientoService {

  

    getEstablecimientos() {
        return axios.get('assets/demo/data/establecimientos.json').then(res => res.data.data);
    }

 
}