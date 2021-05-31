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

const OperacionesData = (props) => {

  let emptyOperacion =  {
    id: null,
    nombre: "",
    codigo: "",
    codigo_aux: "",
    codigo_aux: "",
    porcentaje_iva: "",
    tipo_operacion: "",
    valor_unitario: 0
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
  const porcentajeIvaOptions = ['OTROS','10-20','20-40']

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

    if (operacion.codigo.trim()) {
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

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _operacion = { ...operacion };
    _operacion[`${name}`] = val;

    setOperacion(_operacion);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedOperaciones || !selectedOperaciones.length} />
      </React.Fragment>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Importar" className="p-mr-2 p-d-inline-block" />
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
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

        <div className="row">
          <div className="p-field w-20">
            <label htmlFor="ruc">RUC</label><br/>
            <InputText id="ruc" value={operacion.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !operacion.ruc })} />
            {submitted && !operacion.ruc && <small className="p-error">RUC es requerido.</small>}
          </div>
          <div className="p-field w-40">
            <label htmlFor="razon">Razon Social</label><br/>
            <InputText id="razon" value={operacion.razon} onChange={(e) => onInputChange(e, 'razon')} required />
          </div>
          <div className="p-field w-40">
            <label htmlFor="name">Nombre Comercial</label><br/>
            <InputText id="nombre" value={operacion.nombre} onChange={(e) => onInputChange(e, 'nombre')} required  className={classNames({ 'p-invalid': submitted && !operacion.name })} />
            {submitted && !operacion.name && <small className="p-error">Nombre es requerido.</small>}
          </div>

        </div>
        <div className="row">
          <div className="p-field w-80">
            <label htmlFor="direccion">Direccion Matriz</label><br/>
            <InputText id="direccion" value={operacion.direccion} onChange={(e) => onInputChange(e, 'direccion')} required />
          </div>
         
        </div>

        <div className="row">
          <div className="p-field w-30">
            <label htmlFor="contribuyente">Contribuyente Especial</label><br/>
            <InputText id="contribuyente" value={operacion.contribuyente} onChange={(e) => onInputChange(e, 'contribuyente')} required />
          </div>
          <div className="p-field w-30">
            <label htmlFor="contabilidad">Obligado a Contabilidad</label><br/>
            <InputText id="contabilidad" value={operacion.contabilidad}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'contabilidad')}/>
          </div>
          <div className="p-field w-20">
            <label htmlFor="ambiente">Ambiente</label><br/>
            <InputText id="ambiente" value={operacion.ambiente}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'ambiente')} />
          </div>
          <div className="p-field w-20">
            <label htmlFor="emision">Emision</label><br/>
            <InputText id="emision" value={operacion.emision}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'emision')} />
          </div>
        </div>

        <React.Fragment>
          <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveOperacion} />
        </React.Fragment>
      </div>
    

      <Dialog visible={operacionDialog} style={{ width: '450px' }} header="Detalles del Operacion" modal className="p-fluid" footer={operacionDialogFooter} onHide={hideDialog}>
        {operacion.image && <img src={`showcase/demo/images/operacion/${operacion.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={operacion.image} className="operacion-image" />}
        <div className="p-field w-100">
          <label htmlFor="nombre">Nombre del operacion</label>
          <InputText id="nombre" value={operacion.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !operacion.nombre })} />
          {submitted && !operacion.nombre && <small className="p-error">Nombre del operacion requerido</small>}
        </div>
        <div className="p-field w-50">
          <label htmlFor="codigo">Código</label>
          <InputText id="codigo" value={operacion.codigo} onChange={(e) => onInputChange(e, 'codigo')} required className={classNames({ 'p-invalid': submitted && !operacion.codigo })} />
          {submitted && !operacion.codigo && <small className="p-error">Código es requerido</small>}
        </div>
        <div className="p-field w-50">
          <label htmlFor="codigo_aux">Código Auxiliar</label>
          <InputText id="codigo_aux" value={operacion.codigo_aux} onChange={(e) => onInputChange(e, 'codigo_aux')} />
        </div>
       

        <div className="p-field w-100">
          <label htmlFor="valor_unitario w-50">Valor Unitario</label><br/>
          <InputText id="valor_unitario" value={operacion.valor_unitario}   onChange={(e) => onInputChange(e,'valor_unitario')} />
        </div>
        <div className="p-field w-50">
          <label htmlFor="tipo_operacion w-50">Tipo de Operacion</label><br/>
          <Dropdown id="tipo_operacion" value={operacion.tipo_operacion}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'tipo_operacion')} options={tipoOperacionOptions}/>
        </div>
        
        <div className="p-field w-50">
          <label htmlFor="porcentaje_iva">Porcentaje IVA</label><br/>
          <Dropdown id="porcentaje_iva" value={operacion.porcentaje_iva}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'porcentaje_iva')} options={porcentajeIvaOptions}/>
        </div>
        
        
      </Dialog>

      <Dialog visible={deleteOperacionDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOperacionDialogFooter} onHide={hideDeleteOperacionDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {operacion && <span>Esta seguro que desea eliminar <b>{operacion.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteOperacionesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteOperacionesDialogFooter} onHide={hideDeleteOperacionesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {operacion && <span>Esta seguro que desea eliminar este operacion?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default OperacionesData