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
  const [empresa, setEmpresa] = useState(null);
  const [firmaPass, setFirmaPass] = useState(null);
  const toast = useRef(null);
  const firmadigitalService = new EmpresaService();
  const appService = new ServiceApp();



  useEffect(() => {
    const tokenString = sessionStorage.getItem('USER');
    const userObj = JSON.parse(tokenString);
    console.log("EMPRESA =>",userObj.user.empresa);
    setEmpresa(userObj.user.empresa)
    
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
      // uploadFile
      appService.uploadFile(firmadigital['certificado'],'firma').then(data=>{
          console.log("SUBIOOOO",data);
          appService.saveFirma({"id_file":data.file_id,"id_empresa":empresa.id,"firmaPass":firmaPass}).then(res2=>{
            console.log("finito los muñequitos",res2);
          });
      });
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'FirmaDigital Creada', life: 3000 });
      setFirmaDigital(emptyFirmaDigital);
    
  }


const onUpload = (e) =>{
  console.log("on upload ",e);
}

const onChangeCert = (e) =>{
  console.log("ON CHANGE CERT");
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
            <Password id="passwordCert" type="password" onInput={(e)=> setFirmaPass(e.target.value)} />
          </div>
          </div>
          <div className="row">

            <div className="p-field w-50">
                  <label htmlFor="certificado">Fichero contenedor .P12 </label><br/>
                  {/* <FileUpload name="certificado" url="./upload.php" onUpload={onUpload} multiple accept="image/*" maxFileSize={1000000} /> */}

                  <FileUpload id="certificado" mode="basic" accept="*/*" maxFileSize={1000000} label="certificado" chooseLabel="Certificado" className="p-mr-2 p-d-inline-block" onSelect={(e) => onChangeCert(e)} onUpload={onUpload} />
            </div>
        </div>
        <React.Fragment>
          <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveFirmaDigital}  />
        </React.Fragment>
      </div>
    </div>
    </>
  );
}

export default FirmaDigital
