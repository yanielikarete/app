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

import './common.css';

const ProveedorsData = (props) => {

  let emptyProveedor = {
    id: null,
    ruc_cedula: '',
    razon_social: '',
    direccion: '',
    email: '',
    tipo_id: "RUC",
    clase_contribuyente: 0,
    quantity:0,
    rating: 0,
    inventoryStatus: 'INSTOCK'
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
  const proveedorService = new ProveedorService();
  const tipoIdOptions = ['RUC','IDENTIFICACION'];
  const contribuyenteOptions = ['OTROS','RESPONSABLE']

  useEffect(() => {
    proveedorService.getProveedors().then(data => setProveedors(data));
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

    if (proveedor.razon_social.trim()) {
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
          <Column field="ruc_cedula" header="RUC/CEDULA" sortable filter></Column>
          <Column field="razon_social" header="RAZÓN SOCIAL" filter sortable ></Column>
          <Column field="email" header="EMAIL" sortable filter></Column>
          <Column field="tipo_id" header="TIPO DE IDENTIFICACIÓN" sortable filter ></Column>
          <Column field="direccion" header="DIRECCIÓN" sortable filter></Column>
        
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={proveedorDialog} style={{ width: '450px' }} header="Detalles del Proveedor" modal className="p-fluid" footer={proveedorDialogFooter} onHide={hideDialog}>
        {proveedor.image && <img src={`showcase/demo/images/proveedor/${proveedor.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={proveedor.image} className="proveedor-image" />}
        
        <div className="p-field w-100">
          <label htmlFor="razon_social">NOMBRE / RAZON SOCIAL</label>
          <InputText id="razon_social" value={proveedor.razon_social} onChange={(e) => onInputChange(e, 'razon_social')} required className={classNames({ 'p-invalid': submitted && !proveedor.razon_social })} />
          {submitted && !proveedor.razon_social && <small className="p-error">Razon social es requerida</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="email">EMAIL</label>
          <InputText id="email" value={proveedor.email} onChange={(e) => onInputChange(e, 'email')} />
        </div>
        

        <div className="p-field w-50">
          <label htmlFor="tipo_id w-50">TIPO DE IDENTIFICACIÓN</label><br/>
          <Dropdown id="tipo_id" value={proveedor.tipo_id}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'tipo_id')} options={tipoIdOptions}/>
        </div>
        
        <div className="p-field w-50">
          <label htmlFor="clase_contribuyente">CLASE CONTRIBUYENTE</label><br/>
          <Dropdown id="clase_contribuyente" value={proveedor.clase_contribuyente}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'clase_contribuyente')} options={contribuyenteOptions}/>
        </div>
        <div className="p-field w-100">
          <label htmlFor="ruc_cedula">RUC/CEDULA</label>
          <InputText id="ruc_cedula" value={proveedor.ruc_cedula} onChange={(e) => onInputChange(e, 'ruc_cedula')} required autoFocus className={classNames({ 'p-invalid': submitted && !proveedor.ruc_cedula })} />
          {submitted && !proveedor.ruc_cedula && <small className="p-error">RUC o cedula es requerido</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="direccion">DIRECCIÓN</label>
          <InputTextarea id="direccion" value={proveedor.direccion} onChange={(e) => onInputChange(e, 'direccion')} required rows={3} cols={20} />
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