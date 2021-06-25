import axios from 'axios';

export class PuntosEmisionService {
    getPuntosEmisions() {
        return axios.get('assets/demo/data/puntos-emision.json').then(res => res.data.data);
    }

 
}