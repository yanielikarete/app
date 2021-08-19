import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BancaService } from '../../service/BancaService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import './common.css';
import { Panel } from 'primereact/panel';

const OperacionesData = (props) => {

  let emptyCruzamiento = {
    registra:"",
    cuenta:""
  };
  let emptyOperacion =  {
    id: null,
    registra:"",
    monto_asiento:0,
    cuenta:"",
    titulo:"",
    comentarios:"",
    cruzamientos:[]
  };
  console.log(props)
  const [operaciones, setOperaciones] = useState(null);
  const [operacionDialog, setOperacionDialog] = useState(false);
  const [deleteOperacionDialog, setDeleteOperacionDialog] = useState(false);
  const [deleteOperacionesDialog, setDeleteOperacionesDialog] = useState(false);
  const [operacion, setOperacion] = useState(emptyOperacion);
  const [selectedOperaciones, setSelectedOperaciones] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const bancaService = new BancaService();
  const tipoOperacionOptions = ['BIEN','MAL','REGULAR'];
  const porcentajeIvaOptions = ['OTROS','10-20','20-40'];
  const dropdownRegistra = ["DEBE","HABER"];
  const dropdownCuentas = ["--CUENTA-PRINCIPAL--","ACTIVOS","PASIVOS"]
  useEffect(() => {
    bancaService.getOperaciones().then(data => setOperaciones(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const formatCurrency = (value) => {
  //   return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  // }
  const itemTemplate = (option) => {
    return (
        <div className="country-item">
            <span>{option}</span>
        </div>
    );
  };
  const removeCruzamiento = () =>{
    let _operacion = { ...operacion };
    _operacion.cruzamientos.pop();
    setOperacion(_operacion);
  }
  const addCruzamiento = () =>{
    let _operacion = { ...operacion };
    _operacion.cruzamientos.push(emptyCruzamiento);
    setOperacion(_operacion);

  }
  const openNew = () => {
    setOperacion(emptyOperacion);
    setSubmitted(false);
    setOperacionDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setOperacionDialog(false);
  }

  const hideDeleteOperacionDialog = () => {
    setDeleteOperacionDialog(false);
  }

  const hideDeleteOperacionesDialog = () => {
    setDeleteOperacionesDialog(false);
  }

  const saveOperacion = () => {
    setSubmitted(true);

    if (operacion.registra.trim()) {
      let _operaciones = [...operaciones];
      let _operacion = { ...operacion };
      if (operacion.id) {
        const index = findIndexById(operacion.id);

        _operaciones[index] = _operacion;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Operacion Updated', life: 3000 });
      }
      else {
        _operacion.id = createId();
        _operacion.image = 'operacion-placeholder.svg';
        _operaciones.push(_operacion);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Operacion Created', life: 3000 });
      }

      setOperaciones(_operaciones);
      setOperacionDialog(false);
      setOperacion(emptyOperacion);
    }
  }

  const editOperacion = (operacion) => {
    setOperacion({ ...operacion });
    setOperacionDialog(true);
  }

  const confirmDeleteOperacion = (operacion) => {
    setOperacion(operacion);
    setDeleteOperacionDialog(true);
  }

  const deleteOperacion = () => {
    let _operaciones = operaciones.filter(val => val.id !== operacion.id);
    setOperacion(_operaciones);
    setDeleteOperacionDialog(false);
    setOperacion(emptyOperacion);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Operacion Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < operaciones.length; i++) {
      if (operaciones[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
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

  const confirmDeleteSelected = () => {
    setDeleteOperacionesDialog(true);
  }

  const deleteSelectedOperaciones = () => {
    let _operaciones = operaciones.filter(val => !selectedOperaciones.includes(val));
    setOperaciones(_operaciones);
    setDeleteOperacionesDialog(false);
    setSelectedOperaciones(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Operaciones Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _operacion = { ...operacion };
    _operacion['category'] = e.value;
    setOperacion(_operacion);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _operacion = { ...operacion };
    _operacion[`${name}`] = val;

    setOperacion(_operacion);
  }
  const onInputCruzamientoChange = (e, name,i) => {
    const val = (e.target && e.target.value) || '';
    let _operacion = { ...operacion };
    _operacion['cruzamientos'][i][`${name}`] = val;
    setOperacion(_operacion);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _operacion = { ...operacion };
    _operacion[`${name}`] = val;

    setOperacion(_operacion);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Agregar" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={addCruzamiento} />
        <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={removeCruzamiento} disabled={!operacion.cruzamientos.length} />
      </React.Fragment>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
                        <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveOperacion} />

      </React.Fragment>
    )
  }



  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  }

  const statusBodyTemplate = (rowData) => {
    return <span className={`operacion-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editOperacion(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteOperacion(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">{props.header}</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="Buscar" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
    </div>
  );
  const operacionDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveOperacion} />
    </React.Fragment>
  );
  const deleteOperacionDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteOperacionDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteOperacion} />
    </React.Fragment>
  );
  const deleteOperacionesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteOperacionesDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedOperaciones} />
    </React.Fragment>
  );





  return (
      <>
      <h1>{props.title}</h1>     
    <div>
      <div className="datatable-crud-demo"> 
        <Toast ref={toast} />

      <div className="card">
        <div className="row">
          <div className="p-field w-20">
            <label htmlFor="registra">Registrar por el </label><br/>
            <Dropdown value={operacion.registra} onChange={(e) => onInputChange(e,'registra')} options={dropdownRegistra}  placeholder="Seleccione que registra"   itemTemplate={itemTemplate}/>
            {/* <InputText id="ruc" value={operacion.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !operacion.ruc })} />
            {submitted && !operacion.ruc && <small className="p-error">RUC es requerido.</small>} */}
          </div>
          <div className="p-field w-30">
            <label htmlFor="monto_asiento">Monto Asiento</label><br/>
            <InputText id="monto_asiento" value={operacion.monto_asiento} onChange={(e) => onInputChange(e, 'monto_asiento')} required />
          </div>
          <div className="p-field w-20">
            <label htmlFor="cuenta">Selecciona una Cuenta </label><br/>
            <Dropdown value={operacion.cuenta} onChange={(e) => onInputChange(e,'cuenta')} options={dropdownCuentas}  placeholder="Seleccione una cuenta"   itemTemplate={itemTemplate}/>
            {/* <InputText id="ruc" value={operacion.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !operacion.ruc })} />
            {submitted && !operacion.ruc && <small className="p-error">RUC es requerido.</small>} */}
          </div>
          <div className="p-field w-30">
            <label htmlFor="titulo">Titulo de Asiento</label><br/>
            <InputText id="titulo" value={operacion.titulo} onChange={(e) => onInputChange(e, 'titulo')} required  className={classNames({ 'p-invalid': submitted && !operacion.titulo })} />
            {submitted && !operacion.name && <small className="p-error">Nombre es requerido.</small>}
          </div>

        </div>
        
          
        <div className="row">
          <div className="p-field w-100">
            <label htmlFor="comentarios">Comentarios</label><br/>
            <InputTextarea value={operacion.comentarios} onChange={(e) => onInputChange(e,'comentarios')}   placeholder="Comentarios"   itemTemplate={itemTemplate}/>

          </div>
         
        </div>
        
        {operacion.cruzamientos.map(function(cruce,i){
              return (
                <Panel header={"Cruzamiento "+(i+1)} >
                <h3></h3>
                <div className="row">
                   <div className="p-field w-20">
                      <label htmlFor="registra">Registrar por el </label><br/>
                      <Dropdown value={cruce.registra} onChange={(e) => onInputCruzamientoChange(e,'registra',i)} options={dropdownRegistra}  placeholder="Seleccione que registra"   itemTemplate={itemTemplate}/>
                      {/* <InputText id="ruc" value={operacion.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !operacion.ruc })} />
                      {submitted && !operacion.ruc && <small className="p-error">RUC es requerido.</small>} */}
                    </div>
                    <div className="p-field w-30">
                    <label htmlFor="cuenta">Selecciona una Cuenta </label><br/>
            <Dropdown value={cruce.cuenta} onChange={(e) => onInputCruzamientoChange(e,'registra',i)} options={dropdownCuentas}  placeholder="Seleccione una cuenta"   itemTemplate={itemTemplate}/>
           
                    </div>
                </div>
                </Panel>
              )
          })}
        
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        </div>

      
      </div>
    

 
    </div>
    </>
  );
}

export default OperacionesData