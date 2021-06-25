import React, { useState, useEffect, useRef } from 'react';

import { EmpresaService } from '../../service/EmpresaService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Password } from 'primereact/password';
import { ServiceApp } from '../../service/ServiceApp';


import './common.css';

const FirmaDigital = (props) => {

  let emptyFirmaDigital = {
    id: null,
    passwordAuth: "null",
    passwordCert: '',
    certificado: "null",
   

  };
  console.log(props)
  const [firmadigital, setFirmaDigital] = useState(emptyFirmaDigital);
  const toast = useRef(null);
  const firmadigitalService = new EmpresaService();


  useEffect(() => {
    firmadigitalService.getFirmaDigital().then(data => {
        console.log(data)
      setFirmaDigital(data);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//   }


  const saveFirmaDigital = () => {
      //@todo guardar la firma digital
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'FirmaDigital Creada', life: 3000 });
      setFirmaDigital(emptyFirmaDigital);
    
  }




const onChangeCert = (e) =>{
  console.log(e.originalEvent);
  console.log(e.files.item(0));
  let val = e.files.item(0)
  let _firmadigital = { ...firmadigital };
  _firmadigital[`certificado`] = val;

  setFirmaDigital(_firmadigital);
}


 console.log("EMPRESA",firmadigital)
  return (
      <>
      <h1>Configuracion  de la Firma Digital</h1>

    <div className="">
      <Toast ref={toast} />
      <div className="card">
        
        
        <div className="row d-flex">
          <div className="p-field w-50">
            <label htmlFor="passwordAuth">Contraseña de authorización</label><br/>
            <Password id="passwordAuth" type="password" />
          </div>
          <div className="p-field w-50">
            <label htmlFor="passwordCert">Contraseña de su certificado</label><br/>
            <Password id="passwordCert" type="password" />
          </div>
          </div>
          <div className="row">

            <div className="p-field w-50">
                  <label htmlFor="certificado">Fichero contenedor .P12 </label><br/>

                  <FileUpload id="certificado" mode="basic" accept="*/*" maxFileSize={1000000} label="certificado" chooseLabel="Certificado" className="p-mr-2 p-d-inline-block" onSelect={(e) => onChangeCert(e)}  />
            </div>
        </div>
        <React.Fragment>
          <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveFirmaDigital} />
        </React.Fragment>
      </div>
    </div>
    </>
  );
}

export default FirmaDigital
