import axios from 'axios';

export class EmpresaService {



    getEmpresa() {
        return axios.get('assets/demo/data/empresa.json').then(res => res.data.data);
    }
    getSecuenciales() {
        return axios.get('assets/demo/data/empresa.json').then(res => res.data.secuenciales);
    }
    setEmpresa(data){
        console.log("salvando empresa",data)
    }

    getFirmaDigital(){
        return axios.get('assets/demo/data/empresa.json').then(res => res.data.data);
    }

 
}