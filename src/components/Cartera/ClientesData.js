import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
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

const ClientesData = (props) => {

  let emptyCliente = {
    id: null,
    ruc: '',
    nombre: '',
    direccion: '',
    correo: '',
    identificacion_id: "RUC",
    constribuyente_id: 0,
    observaciones:"",
    telefono:"",
    tipoCliente_id : 2
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
  const [tipoIdOptions, setTipoIdOptions] = useState(null);
  const [contribuyenteOptions, setContribuyenteOptions] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  let serviceApp = ServiceApp.getInstance();

  useEffect(() => {
    serviceApp.getClientes().then(data => {
      console.log("seteando data", data)
      setClientes(data)});
    serviceApp.getTiposIdentificacion().then(data => setTipoIdOptions(data));
    serviceApp.getClaseContribuyentes().then(data => setContribuyenteOptions(data));
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

    if (cliente.nombre.trim()) {
      let _clientes = [...clientes];
      let _cliente = { ...cliente };
      if (cliente.id) {
        const index = findIndexById(cliente.id);

        _clientes[index] = _cliente;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Cliente Updated', life: 3000 });
      }
      else {
        _cliente.id = createId();
        _clientes.push(_cliente);
        serviceApp.addCliente(_cliente)
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
    console.log(_cliente);
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
        <InputText type="Buscar" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
    </div>
  );
  const clienteDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveCliente} />
    </React.Fragment>
  );
  const deleteClienteDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClienteDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteCliente} />
    </React.Fragment>
  );
  const deleteClientesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteClientesDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedClientes} />
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
          <Column field="ruc" header="RUC/CEDULA" sortable filter></Column>
          <Column field="nombre" header="RAZÓN SOCIAL" filter sortable ></Column>
          <Column field="correo" header="correo" sortable filter></Column>
          <Column field="identificacion.nombre" header="TIPO DE IDENTIFICACIÓN" sortable filter ></Column>
          <Column field="direccion" header="DIRECCIÓN" sortable filter></Column>
        
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={clienteDialog} style={{ width: '450px' }} header="Detalles del Cliente" modal className="p-fluid" footer={clienteDialogFooter} onHide={hideDialog}>
        {cliente.image && <img src={`showcase/demo/images/cliente/${cliente.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={cliente.image} className="cliente-image" />}
        
        <div className="p-field w-100">
          <label htmlFor="nombre">NOMBRE / RAZON SOCIAL</label>
          <InputText id="nombre" value={cliente.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !cliente.nombre })} />
          {submitted && !cliente.nombre && <small className="p-error">Razon social es requerida</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="correo">correo</label>
          <InputText id="correo" value={cliente.correo} onChange={(e) => onInputChange(e, 'correo')} />
        </div>
        

        <div className="p-field w-50">
          <label htmlFor="identificacion_id w-50">TIPO DE IDENTIFICACIÓN</label><br/>
          <Dropdown id="identificacion_id" value={cliente.identificacion_id}     onChange={(e) => onInputChange(e,'identificacion_id')} options={tipoIdOptions} optionLabel="nombre" optionValue="id"/>
        </div>
        
        <div className="p-field w-50">
          <label htmlFor="constribuyente_id">CLASE CONTRIBUYENTE</label><br/>
          <Dropdown id="constribuyente_id" value={cliente.constribuyente_id} onChange={(e) => onInputChange(e,'constribuyente_id')} options={contribuyenteOptions} optionValue="id" optionLabel="nombre"/>
        </div>
        <div className="p-field w-100">
          <label htmlFor="ruc">RUC/CEDULA</label>
          <InputText id="ruc" value={cliente.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !cliente.ruc })} />
          {submitted && !cliente.ruc && <small className="p-error">RUC o cedula es requerido</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="telefono">TELEFONO</label>
          <InputText id="telefono" value={cliente.telefono} onChange={(e) => onInputChange(e, 'telefono')} required autoFocus className={classNames({ 'p-invalid': submitted && !cliente.telefono })} />
          {submitted && !cliente.telefono && <small className="p-error">Telefono es requerido</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="direccion">DIRECCIÓN</label>
          <InputTextarea id="direccion" value={cliente.direccion} onChange={(e) => onInputChange(e, 'direccion')} required rows={3} cols={20} />
        </div>
        <div className="p-field w-100">
          <label htmlFor="observaciones">OBSERVACIONES</label>
          <InputTextarea id="observaciones" value={cliente.observaciones} onChange={(e) => onInputChange(e, 'observaciones')} required rows={3} cols={20} />
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