import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ClienteService } from '../../service/ClienteService';
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

const ClientesData = (props) => {

  let emptyCliente = {
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
  const [clientes, setClientes] = useState(null);
  const [clienteDialog, setClienteDialog] = useState(false);
  const [deleteClienteDialog, setDeleteClienteDialog] = useState(false);
  const [deleteClientesDialog, setDeleteClientesDialog] = useState(false);
  const [cliente, setCliente] = useState(emptyCliente);
  const [selectedClientes, setSelectedClientes] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const clienteService = new ClienteService();
  const tipoIdOptions = ['RUC','IDENTIFICACION'];
  const contribuyenteOptions = ['OTROS','RESPONSABLE']

  useEffect(() => {
    clienteService.getClientes().then(data => setClientes(data));
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
    setCliente(emptyCliente);
    setSubmitted(false);
    setClienteDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setClienteDialog(false);
  }

  const hideDeleteClienteDialog = () => {
    setDeleteClienteDialog(false);
  }

  const hideDeleteClientesDialog = () => {
    setDeleteClientesDialog(false);
  }

  const saveCliente = () => {
    setSubmitted(true);

    if (cliente.razon_social.trim()) {
      let _clientes = [...clientes];
      let _cliente = { ...cliente };
      if (cliente.id) {
        const index = findIndexById(cliente.id);

        _clientes[index] = _cliente;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Updated', life: 3000 });
      }
      else {
        _cliente.id = createId();
        _cliente.image = 'cliente-placeholder.svg';
        _clientes.push(_cliente);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Created', life: 3000 });
      }

      setClientes(_clientes);
      setClienteDialog(false);
      setCliente(emptyCliente);
    }
  }

  const editCliente = (cliente) => {
    setCliente({ ...cliente });
    setClienteDialog(true);
  }

  const confirmDeleteCliente = (cliente) => {
    setCliente(cliente);
    setDeleteClienteDialog(true);
  }

  const deleteCliente = () => {
    let _clientes = clientes.filter(val => val.id !== cliente.id);
    setCliente(_clientes);
    setDeleteClienteDialog(false);
    setCliente(emptyCliente);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].id === id) {
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
    setDeleteClientesDialog(true);
  }

  const deleteSelectedClientes = () => {
    let _clientes = clientes.filter(val => !selectedClientes.includes(val));
    setClientes(_clientes);
    setDeleteClientesDialog(false);
    setSelectedClientes(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Clientes Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _cliente = { ...cliente };
    _cliente['category'] = e.value;
    setCliente(_cliente);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _cliente = { ...cliente };
    _cliente[`${name}`] = val;

    setCliente(_cliente);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _cliente = { ...cliente };
    _cliente[`${name}`] = val;

    setCliente(_cliente);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedClientes || !selectedClientes.length} />
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
    return <span className={`cliente-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editCliente(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCliente(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">{props.header}</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
    </div>
  );
  const clienteDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveCliente} />
    </React.Fragment>
  );
  const deleteClienteDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClienteDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteCliente} />
    </React.Fragment>
  );
  const deleteClientesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClientesDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedClientes} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={clientes} selection={selectedClientes} onSelectionChange={(e) => setSelectedClientes(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clientes"
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

      <Dialog visible={clienteDialog} style={{ width: '450px' }} header="Detalles del Cliente" modal className="p-fluid" footer={clienteDialogFooter} onHide={hideDialog}>
        {cliente.image && <img src={`showcase/demo/images/cliente/${cliente.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={cliente.image} className="cliente-image" />}
        
        <div className="p-field w-100">
          <label htmlFor="razon_social">NOMBRE / RAZON SOCIAL</label>
          <InputText id="razon_social" value={cliente.razon_social} onChange={(e) => onInputChange(e, 'razon_social')} required className={classNames({ 'p-invalid': submitted && !cliente.razon_social })} />
          {submitted && !cliente.razon_social && <small className="p-error">Razon social es requerida</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="email">EMAIL</label>
          <InputText id="email" value={cliente.email} onChange={(e) => onInputChange(e, 'email')} />
        </div>
        

        <div className="p-field w-50">
          <label htmlFor="tipo_id w-50">TIPO DE IDENTIFICACIÓN</label><br/>
          <Dropdown id="tipo_id" value={cliente.tipo_id}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'tipo_id')} options={tipoIdOptions}/>
        </div>
        
        <div className="p-field w-50">
          <label htmlFor="clase_contribuyente">CLASE CONTRIBUYENTE</label><br/>
          <Dropdown id="clase_contribuyente" value={cliente.clase_contribuyente}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'clase_contribuyente')} options={contribuyenteOptions}/>
        </div>
        <div className="p-field w-100">
          <label htmlFor="ruc_cedula">RUC/CEDULA</label>
          <InputText id="ruc_cedula" value={cliente.ruc_cedula} onChange={(e) => onInputChange(e, 'ruc_cedula')} required autoFocus className={classNames({ 'p-invalid': submitted && !cliente.ruc_cedula })} />
          {submitted && !cliente.ruc_cedula && <small className="p-error">RUC o cedula es requerido</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="direccion">DIRECCIÓN</label>
          <InputTextarea id="direccion" value={cliente.direccion} onChange={(e) => onInputChange(e, 'direccion')} required rows={3} cols={20} />
        </div>
      </Dialog>

      <Dialog visible={deleteClienteDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteClienteDialogFooter} onHide={hideDeleteClienteDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {cliente && <span>Esta seguro que desea eliminar <b>{cliente.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteClientesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteClientesDialogFooter} onHide={hideDeleteClientesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {cliente && <span>Esta seguro que desea eliminar este cliente?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default ClientesData