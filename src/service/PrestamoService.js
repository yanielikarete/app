import axios from 'axios';

export class PrestamoService {
    getBeneficiarios() {
        return axios.get('assets/demo/data/beneficiarios.json').then(res => res.data.data);
    }
    getPrestamos() {
        return axios.get('assets/demo/data/prestamos.json').then(res => res.data.data);
    }
    getAbonos(prestamo) {
        return axios.get('assets/demo/data/abonos.json').then(res => res.data.data);
    }

    savePrestamo(any){
        return axios.post('',any).then(res => res)
    }
   
}