import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { ServiceApp } from '../../service/ServiceApp';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import './Empresas.css';

const Empresas = (props) => {

  let emptyEmpresa = {
    id: null,
    ruc: "null",
    nombreComercial: '',
    image: "null",
    razonSocial: '',
    direccionMatriz:'',
    contabilidad:"NO",
    esquema:"OFFLINE",
    ambiente:"PRODUCCION",
    emision:"NORMAL",
    contribuyenteEspecial: 0,
    establecimientos : []
  

  };
  console.log(props)
  const [empresa, setEmpresa] = useState(emptyEmpresa);
  const [submitted, setSubmitted] = useState(false);
  const [emisionOptions, setEmisionOptions] = useState(false);
  const [ambienteOptions, setAmbienteOptions] = useState(false);
  // const [establecimientos, setEstablecimientos] = useState(false);
  const [currentUser, setCurrentUser] = useState(false);
  const toast = useRef(null);
  const appService = new ServiceApp();

  const esquemasOptions = [{id:2,label:"Offline"},{id:3,label:"Online"}];
  const contabilidadOptions = [{id:true,label:'SI'},{id:false,label:'NO'}]
  useEffect(() => {
    const tokenString = sessionStorage.getItem('USER');
    const userObj = JSON.parse(tokenString);
    console.log("EMPRESA =>",userObj.user.empresa);
    setCurrentUser(userObj.user);
    if(userObj.user.empresa!=undefined)
      setEmpresa(userObj.user.empresa);
    appService.getTipoEmisiones().then(data=>{setEmisionOptions(data)});
    appService.getTipoAmbiente().then(data=>{setAmbienteOptions(data)});
    // appService.getAllEstablecimientos().then(data => {setEstablecimientos(data)})
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//   }
const itemTemplate = (option) => {
  return (
      <div className="country-item">
          <span>{option}</span>
      </div>
  );
};

  const saveEmpresa = () => {
    console.log(empresa)
    setSubmitted(true);
    if (empresa.razonSocial.trim()) {
      if (empresa.id) {
        // appService.saveEmpresa(empresa)
        empresa["id_tipo_ambiente"]=empresa["tipoAmbiente"];
        empresa["id_tipo_emision"]=empresa["tipoEmision"];
        empresa["id_esquema"]=empresa["esquema"];
        empresa["establecimientos"] = appService.getAllEstablecimientos()
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Empresa Updated', life: 3000 });
        appService.updateEmpresa(empresa);
      }
      else {
        // empresa.id = createId();
        empresa.image = 'empresa-placeholder.svg';
        empresa["id_tipo_ambiente"]=empresa["tipoAmbiente"];
        empresa["id_tipo_emision"]=empresa["tipoEmision"];
        empresa["id_esquema"]=empresa["esquema"];
        empresa["establecimientos"] = appService.getAllEstablecimientos()
        console.log(empresa)
        appService.saveEmpresa(empresa).then(data=>{
          console.log(data);
          appService.setEmpresaUser(currentUser.id, {"empresa_id":data.data.id});
        })
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Empresa Created', life: 3000 });
      }
    }

  }

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _empresa = { ...empresa };
    _empresa[`${name}`] = val;

    setEmpresa(_empresa);
  }


const onChangeImage = (e) =>{
  console.log(e.originalEvent);
  console.log(e.files.item(0));
  
  let val = URL.createObjectURL(e.files.item(0))
  let _empresa = { ...empresa };
  appService.uploadFile(e.files.item(0), 'logo')
            .then(data => { _empresa[`logo_id`] = data.file_id })
            .catch(error => { console.log('Upload Error', error) })
  _empresa[`image`] = val;

  setEmpresa(_empresa);
}


 console.log("EMPRESA",empresa)
  return (
      <>
      <h1>Configuracion general de la empresa</h1>

    <div className="">
      <Toast ref={toast} />
      <div className="card">
        <div className="row">
            <div className="p-field w-20">
                 {/* <img src={empresa.image} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={empresa.image} className="empresa-image"  width="90px" height="90px"/>  */}
            </div>
            <div className="p-field w-60"></div>
            <div className="p-field w-20">
                  <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Logo" chooseLabel="Logo" className="p-mr-2 p-d-inline-block" onSelect={(e) => onChangeImage(e)}  />
            </div>
        </div>
        
        <div className="row">
          <div className="p-field w-20">
            <label htmlFor="ruc">RUC</label><br/>
            <InputText id="ruc" value={empresa.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !empresa.ruc })} />
            {submitted && !empresa.ruc && <small className="p-error">RUC es requerido.</small>}
          </div>
          <div className="p-field w-40">
            <label htmlFor="razonSocial">Razon Social</label><br/>
            <InputText id="razonSocial" value={empresa.razonSocial} onChange={(e) => onInputChange(e, 'razonSocial')} required />
          </div>
          <div className="p-field w-40">
            <label htmlFor="name">Nombre Comercial</label><br/>
            <InputText id="nombreComercial" value={empresa.nombreComercial} onChange={(e) => onInputChange(e, 'nombreComercial')} required  className={classNames({ 'p-invalid': submitted && !empresa.razonSocial })} />
            {submitted && !empresa.razonSocial && <small className="p-error">Nombre es requerido.</small>}
          </div>

        </div>
        <div className="row">
          <div className="p-field w-60">
            <label htmlFor="direccionMatriz">Direccion Matriz</label><br/>
            <InputText id="direccionMatriz" value={empresa.direccionMatriz} onChange={(e) => onInputChange(e, 'direccionMatriz')} required />
            {submitted && !empresa.direccionMatriz && <small className="p-error">Direccion es requerido.</small>}
          </div>
          <div className="p-field w-20">
            <label htmlFor="esquema">Esquema</label><br/>
            <Dropdown id="esquema" value={empresa.esquema}  onChange={(e) => onInputChange(e,'esquema')} options={esquemasOptions} optionLabel="label" optionValue="id"/>
          </div>
        </div>

        <div className="row">
          <div className="p-field w-30">
            <label htmlFor="contribuyenteEspecial">Contribuyente Especial</label><br/>
            <InputText id="contribuyenteEspecial" value={empresa.contribuyenteEspecial} onChange={(e) => onInputChange(e, 'contribuyenteEspecial')} required />
            {submitted && !empresa.contribuyenteEspecial && <small className="p-error">Contribuyente es requerido.</small>}
          </div>
          <div className="p-field w-30">
            <label htmlFor="contabilidad">Obligado a Contabilidad</label><br/>
            <Dropdown id="contabilidad" value={empresa.obligadoContabilidad}    onChange={(e) => onInputChange(e,'obligadoContabilidad')} options={contabilidadOptions} optionValue="id" optionLabel="label"/>
          </div>
          <div className="p-field w-20">
            <label htmlFor="ambiente">Ambiente</label><br/>
            <Dropdown id="ambiente" value={empresa.tipoAmbiente}  onChange={(e) => onInputChange(e,'tipoAmbiente')} options={ambienteOptions} optionLabel="nombre" optionValue="id" />
          </div>
          <div className="p-field w-20">
            <label htmlFor="emision">Emision</label><br/>
            <Dropdown id="emision" value={empresa.tipoEmision}    onChange={(e) => onInputChange(e,'tipoEmision')} options={emisionOptions} optionLabel="nombre" optionValue="id" />
          </div>
        </div>

        <React.Fragment>
          <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveEmpresa} />
        </React.Fragment>
      </div>
    </div>
    </>
  );
}

export default Empresas
