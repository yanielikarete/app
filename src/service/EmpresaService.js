import axios from 'axios';

export class EmpresaService {



    getEmpresa() {
        return axios.get('assets/demo/data/empresa.json').then(res => res.data.data);
    }
    setEmpresa(data){
        console.log("salvando empresa",data)
    }

 
}