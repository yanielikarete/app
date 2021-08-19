import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProveedorService } from '../../service/ProveedorService';
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
import { ServiceApp } from '../../service/ServiceApp';

import './common.css';

const ProveedorsData = (props) => {

  let emptyProveedor = {

    id: null,
    ruc: '',
    nombre: '',
    direccion: '',
    correo: '',
    identificacion_id: "RUC",
    constribuyente_id: 0,
    observaciones:"",
    telefono:"",
    tipoCliente_id : 1
  };
  console.log(props)
  const [proveedors, setProveedors] = useState(null);
  const [proveedorDialog, setProveedorDialog] = useState(false);
  const [deleteProveedorDialog, setDeleteProveedorDialog] = useState(false);
  const [deleteProveedorsDialog, setDeleteProveedorsDialog] = useState(false);
  const [proveedor, setProveedor] = useState(emptyProveedor);
  const [selectedProveedors, setSelectedProveedors] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  let serviceApp = ServiceApp.getInstance();
  const [tipoIdOptions, setTipoIdOptions] = useState(null);
  const [contribuyenteOptions, setContribuyenteOptions] = useState(null);

  useEffect(() => {
    serviceApp.getProveedores().then(data => setProveedors(data));
    serviceApp.getTiposIdentificacion().then(data => setTipoIdOptions(data));
    serviceApp.getClaseContribuyentes().then(data => setContribuyenteOptions(data));
 
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const itemTemplate = (option) => {
    return (
        <div className="country-item">
            <span>{option}</span>
        </div>
    );
  };
  const openNew = () => {
    setProveedor(emptyProveedor);
    setSubmitted(false);
    setProveedorDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setProveedorDialog(false);
  }

  const hideDeleteProveedorDialog = () => {
    setDeleteProveedorDialog(false);
  }

  const hideDeleteProveedorsDialog = () => {
    setDeleteProveedorsDialog(false);
  }

  const saveProveedor = () => {
    setSubmitted(true);

    if (proveedor.nombre.trim()) {
      let _proveedors = [...proveedors];
      let _proveedor = { ...proveedor };
      if (proveedor.id) {
        const index = findIndexById(proveedor.id);

        _proveedors[index] = _proveedor;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Proveedor Updated', life: 3000 });
      }
      else {
        _proveedor.id = createId();
        _proveedor.image = 'proveedor-placeholder.svg';
        _proveedors.push(_proveedor);
        serviceApp.addCliente(_proveedor);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Proveedor Created', life: 3000 });
      }

      setProveedors(_proveedors);
      setProveedorDialog(false);
      setProveedor(emptyProveedor);
    }
  }

  const editProveedor = (proveedor) => {
    setProveedor({ ...proveedor });
    setProveedorDialog(true);
  }

  const confirmDeleteProveedor = (proveedor) => {
    setProveedor(proveedor);
    setDeleteProveedorDialog(true);
  }

  const deleteProveedor = () => {
    let _proveedors = proveedors.filter(val => val.id !== proveedor.id);
    setProveedor(_proveedors);
    setDeleteProveedorDialog(false);
    setProveedor(emptyProveedor);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Proveedor Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < proveedors.length; i++) {
      if (proveedors[i].id === id) {
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
    setDeleteProveedorsDialog(true);
  }

  const deleteSelectedProveedors = () => {
    let _proveedors = proveedors.filter(val => !selectedProveedors.includes(val));
    setProveedors(_proveedors);
    setDeleteProveedorsDialog(false);
    setSelectedProveedors(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Proveedors Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _proveedor = { ...proveedor };
    _proveedor['category'] = e.value;
    setProveedor(_proveedor);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _proveedor = { ...proveedor };
    _proveedor[`${name}`] = val;

    setProveedor(_proveedor);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _proveedor = { ...proveedor };
    _proveedor[`${name}`] = val;

    setProveedor(_proveedor);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProveedors || !selectedProveedors.length} />
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
    return <span className={`proveedor-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProveedor(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProveedor(rowData)} />
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
  const proveedorDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProveedor} />
    </React.Fragment>
  );
  const deleteProveedorDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProveedorDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProveedor} />
    </React.Fragment>
  );
  const deleteProveedorsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProveedorsDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProveedors} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={proveedors} selection={selectedProveedors} onSelectionChange={(e) => setSelectedProveedors(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} proveedors"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="ruc" header="RUC/CEDULA" sortable filter></Column>
          <Column field="nombre" header="RAZÓN SOCIAL" filter sortable ></Column>
          <Column field="correo" header="EMAIL" sortable filter></Column>
          <Column field="identificacion_id" header="TIPO DE IDENTIFICACIÓN" sortable filter ></Column>
          <Column field="direccion" header="DIRECCIÓN" sortable filter></Column>
        
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={proveedorDialog} style={{ width: '450px' }} header="Detalles del Proveedor" modal className="p-fluid" footer={proveedorDialogFooter} onHide={hideDialog}>
        {proveedor.image && <img src={`showcase/demo/images/proveedor/${proveedor.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={proveedor.image} className="proveedor-image" />}
        
        <div className="p-field w-100">
          <label htmlFor="nombre">NOMBRE / RAZON SOCIAL</label>
          <InputText id="nombre" value={proveedor.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !proveedor.nombre })} />
          {submitted && !proveedor.nombre && <small className="p-error">Razon social es requerida</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="correo">EMAIL</label>
          <InputText id="correo" value={proveedor.correo} onChange={(e) => onInputChange(e, 'correo')} />
        </div>
        

        <div className="p-field w-50">
          <label htmlFor="identificacion_id w-50">TIPO DE IDENTIFICACIÓN</label><br/>
          <Dropdown id="identificacion_id" value={proveedor.identificacion_id}     onChange={(e) => onInputChange(e,'identificacion_id')} options={tipoIdOptions} optionLabel="nombre" optionValue="id"/>
        </div>
        
        <div className="p-field w-50">
          <label htmlFor="constribuyente_id">CLASE CONTRIBUYENTE</label><br/>
          <Dropdown id="constribuyente_id" value={proveedor.constribuyente_id} onChange={(e) => onInputChange(e,'constribuyente_id')} options={contribuyenteOptions} optionValue="id" optionLabel="nombre"/>
        </div>
        <div className="p-field w-100">
          <label htmlFor="ruc">RUC/CEDULA</label>
          <InputText id="ruc" value={proveedor.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !proveedor.ruc })} />
          {submitted && !proveedor.ruc && <small className="p-error">RUC o cedula es requerido</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="telefono">TELEFONO</label>
          <InputText id="telefono" value={proveedor.telefono} onChange={(e) => onInputChange(e, 'telefono')} required autoFocus className={classNames({ 'p-invalid': submitted && !proveedor.telefono })} />
          {submitted && !proveedor.telefono && <small className="p-error">Telefono es requerido</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="direccion">DIRECCIÓN</label>
          <InputTextarea id="direccion" value={proveedor.direccion} onChange={(e) => onInputChange(e, 'direccion')} required rows={3} cols={20} />
        </div>
        <div className="p-field w-100">
          <label htmlFor="observaciones">OBSERVACIONES</label>
          <InputTextarea id="observaciones" value={proveedor.observaciones} onChange={(e) => onInputChange(e, 'observaciones')} required rows={3} cols={20} />
        </div>
      </Dialog>

      <Dialog visible={deleteProveedorDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProveedorDialogFooter} onHide={hideDeleteProveedorDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {proveedor && <span>Esta seguro que desea eliminar <b>{proveedor.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteProveedorsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProveedorsDialogFooter} onHide={hideDeleteProveedorsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {proveedor && <span>Esta seguro que desea eliminar este proveedor?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default ProveedorsData