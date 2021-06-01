import axios from 'axios';

export class TransportistaService {
    getTransportistas() {
        return axios.get('assets/demo/data/transportistas.json').then(res => res.data.data);
    }
   
}