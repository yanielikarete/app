import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { EmpresaService } from '../../service/EmpresaService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import './Empresas.css';

const Empresas = (props) => {

  let emptyEmpresa = {
    id: null,
    ruc: "null",
    name: '',
    image: "null",
    razon: '',
    direccion:"DIRECCION",
    contabilidad:"NO",
    esquema:"OFFLINE",
    ambiente:"PRODUCCION",
    emision:"NORMAL",
    contribuyente: "Accessories",
   
  };
  console.log(props)  
  const [empresa, setEmpresa] = useState(emptyEmpresa);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);
  const empresaService = new EmpresaService();

  const esquemasOptions = ["esquema 1","esquema 2","esquema 3"];
  const contabilidadOptions = ['SI','NO','OPCIONAL']
  const ambienteOptions = ['PRODUCCION','DESARROLLO','PRUEBAS']
  const emisionOptions = ['NORMAL','POCA','MUCHA']
  useEffect(() => {
    empresaService.getEmpresa().then(data => {
      setEmpresa(data);
    });
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
    setSubmitted(true);

    if (empresa.name.trim()) {
      let _empresa = { ...empresa };
      if (empresa.id) {

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Empresa Updated', life: 3000 });
      }
      else {
        _empresa.id = createId();
        _empresa.image = 'empresa-placeholder.svg';
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Empresa Created', life: 3000 });
      }
      setEmpresa(emptyEmpresa);
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

  const exportCSV = () => {
    dt.current.exportCSV();
  }

  

  

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _empresa = { ...empresa };
    _empresa[`${name}`] = val;

    setEmpresa(_empresa);
  }

 



  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Importar" className="p-mr-2 p-d-inline-block" />
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
      </React.Fragment>
    )
  }







  const leftToolbarTemplate = (
    <React.Fragment>
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEmpresa} />
    </React.Fragment>
  );

  
 console.log("EMPRESA",empresa)
  return (
      <>
      <h1>Configuracion general de la empresa</h1>     

    <div className="">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={empresa.image && <img src={`showcase/demo/images/empresa/${empresa.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={empresa.image} className="empresa-image" />} right={rightToolbarTemplate}></Toolbar>
        <div className="row">
          
        </div>
        <div className="row">
        <div className="p-field w-20">
          <label htmlFor="ruc">RUC</label><br/>
          <InputText id="ruc" value={empresa.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !empresa.ruc })} />
          {submitted && !empresa.ruc && <small className="p-error">RUC es requerido.</small>}
        </div>
        <div className="p-field w-40">
          <label htmlFor="razon">Razon Social</label><br/>
          <InputText id="razon" value={empresa.razon} onChange={(e) => onInputChange(e, 'razon')} required />
        </div>
        <div className="p-field w-40">
          <label htmlFor="name">Nombre Comercial</label><br/>
          <InputText id="nombre" value={empresa.nombre} onChange={(e) => onInputChange(e, 'nombre')} required  className={classNames({ 'p-invalid': submitted && !empresa.name })} />
          {submitted && !empresa.name && <small className="p-error">Nombre es requerido.</small>}
        </div>
        
        </div>
        <div className="row">
          <div className="p-field w-80">
            <label htmlFor="direccion">Direccion Matriz</label><br/>
            <InputText id="direccion" value={empresa.direccion} onChange={(e) => onInputChange(e, 'direccion')} required />
          </div>
          <div className="p-field w-20">
            <label htmlFor="esquema">Esquema</label><br/>
            <Dropdown id="esquema" value={empresa.esquema}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'esquema')} options={esquemasOptions}/>
          </div>
        </div>

        <div className="row">
          <div className="p-field w-30">
            <label htmlFor="contribuyente">Contribuyente Especial</label><br/>
            <InputText id="contribuyente" value={empresa.contribuyente} onChange={(e) => onInputChange(e, 'contribuyente')} required />
          </div>
          <div className="p-field w-30">
            <label htmlFor="contabilidad">Obligado a Contabilidad</label><br/>
            <Dropdown id="contabilidad" value={empresa.contabilidad}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'contabilidad')} options={contabilidadOptions}/>
          </div>
          <div className="p-field w-20">
            <label htmlFor="ambiente">Ambiente</label><br/>
            <Dropdown id="ambiente" value={empresa.ambiente}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'ambiente')} options={ambienteOptions}/>
          </div>
          <div className="p-field w-20">
            <label htmlFor="emision">Emision</label><br/>
            <Dropdown id="emision" value={empresa.emision}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'emision')} options={emisionOptions}/>
          </div>
        </div>

        {leftToolbarTemplate} 
      </div>

    

      {/* <Dialog visible={deleteEmpresaDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmpresaDialogFooter} onHide={hideDeleteEmpresaDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {empresa && <span>Are you sure you want to delete <b>{empresa.name}</b>?</span>}
        </div>
      </Dialog> */}

      {/* <Dialog visible={deleteEmpresasDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEmpresasDialogFooter} onHide={hideDeleteEmpresasDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {empresa && <span>Are you sure you want to delete the selected empresas?</span>}
        </div>
      </Dialog> */}
    </div>
    </>
  );
}

export default Empresas