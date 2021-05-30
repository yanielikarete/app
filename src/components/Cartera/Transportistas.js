import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TransportistaService } from '../../service/TransportistaService';
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

const TransportistasData = (props) => {

  let emptyTransportista = {
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
  const [transportistas, setTransportistas] = useState(null);
  const [transportistaDialog, setTransportistaDialog] = useState(false);
  const [deleteTransportistaDialog, setDeleteTransportistaDialog] = useState(false);
  const [deleteTransportistasDialog, setDeleteTransportistasDialog] = useState(false);
  const [transportista, setTransportista] = useState(emptyTransportista);
  const [selectedTransportistas, setSelectedTransportistas] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const transportistaService = new TransportistaService();
  const tipoIdOptions = ['RUC','IDENTIFICACION'];
  const contribuyenteOptions = ['OTROS','RESPONSABLE']

  useEffect(() => {
    transportistaService.getTransportistas().then(data => setTransportistas(data));
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
    setTransportista(emptyTransportista);
    setSubmitted(false);
    setTransportistaDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setTransportistaDialog(false);
  }

  const hideDeleteTransportistaDialog = () => {
    setDeleteTransportistaDialog(false);
  }

  const hideDeleteTransportistasDialog = () => {
    setDeleteTransportistasDialog(false);
  }

  const saveTransportista = () => {
    setSubmitted(true);

    if (transportista.razon_social.trim()) {
      let _transportistas = [...transportistas];
      let _transportista = { ...transportista };
      if (transportista.id) {
        const index = findIndexById(transportista.id);

        _transportistas[index] = _transportista;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Transportista Updated', life: 3000 });
      }
      else {
        _transportista.id = createId();
        _transportista.image = 'transportista-placeholder.svg';
        _transportistas.push(_transportista);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Transportista Created', life: 3000 });
      }

      setTransportistas(_transportistas);
      setTransportistaDialog(false);
      setTransportista(emptyTransportista);
    }
  }

  const editTransportista = (transportista) => {
    setTransportista({ ...transportista });
    setTransportistaDialog(true);
  }

  const confirmDeleteTransportista = (transportista) => {
    setTransportista(transportista);
    setDeleteTransportistaDialog(true);
  }

  const deleteTransportista = () => {
    let _transportistas = transportistas.filter(val => val.id !== transportista.id);
    setTransportista(_transportistas);
    setDeleteTransportistaDialog(false);
    setTransportista(emptyTransportista);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Transportista Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < transportistas.length; i++) {
      if (transportistas[i].id === id) {
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
    setDeleteTransportistasDialog(true);
  }

  const deleteSelectedTransportistas = () => {
    let _transportistas = transportistas.filter(val => !selectedTransportistas.includes(val));
    setTransportistas(_transportistas);
    setDeleteTransportistasDialog(false);
    setSelectedTransportistas(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Transportistas Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _transportista = { ...transportista };
    _transportista['category'] = e.value;
    setTransportista(_transportista);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _transportista = { ...transportista };
    _transportista[`${name}`] = val;

    setTransportista(_transportista);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _transportista = { ...transportista };
    _transportista[`${name}`] = val;

    setTransportista(_transportista);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedTransportistas || !selectedTransportistas.length} />
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
    return <span className={`transportista-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editTransportista(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTransportista(rowData)} />
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
  const transportistaDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveTransportista} />
    </React.Fragment>
  );
  const deleteTransportistaDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTransportistaDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteTransportista} />
    </React.Fragment>
  );
  const deleteTransportistasDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTransportistasDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedTransportistas} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={transportistas} selection={selectedTransportistas} onSelectionChange={(e) => setSelectedTransportistas(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} transportistas"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="nombre" header="NOMBRE" sortable filter></Column>
          <Column field="tipo_id" header="IDENTIFICACIÓN" sortable filter ></Column>

          <Column field="ruc_cedula" header="RUC/CEDULA" sortable filter></Column>
          {/* <Column field="razon_social" header="RAZÓN SOCIAL" filter sortable ></Column> */}
          <Column field="email" header="EMAIL" sortable filter></Column>
          <Column field="placa" header="PLACA" sortable filter></Column>
        
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={transportistaDialog} style={{ width: '450px' }} header="Detalles del Transportista" modal className="p-fluid" footer={transportistaDialogFooter} onHide={hideDialog}>
        {transportista.image && <img src={`showcase/demo/images/transportista/${transportista.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={transportista.image} className="transportista-image" />}
        
        <div className="p-field w-100">
          <label htmlFor="razon_social">NOMBRE / RAZON SOCIAL</label>
          <InputText id="razon_social" value={transportista.razon_social} onChange={(e) => onInputChange(e, 'razon_social')} required className={classNames({ 'p-invalid': submitted && !transportista.razon_social })} />
          {submitted && !transportista.razon_social && <small className="p-error">Razon social es requerida</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="email">EMAIL</label>
          <InputText id="email" value={transportista.email} onChange={(e) => onInputChange(e, 'email')} />
        </div>
        

        <div className="p-field w-50">
          <label htmlFor="tipo_id w-50">TIPO DE IDENTIFICACIÓN</label><br/>
          <Dropdown id="tipo_id" value={transportista.tipo_id}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'tipo_id')} options={tipoIdOptions}/>
        </div>
        
        <div className="p-field w-50">
          <label htmlFor="clase_contribuyente">CLASE CONTRIBUYENTE</label><br/>
          <Dropdown id="clase_contribuyente" value={transportista.clase_contribuyente}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'clase_contribuyente')} options={contribuyenteOptions}/>
        </div>
        <div className="p-field w-100">
          <label htmlFor="ruc_cedula">RUC/CEDULA</label>
          <InputText id="ruc_cedula" value={transportista.ruc_cedula} onChange={(e) => onInputChange(e, 'ruc_cedula')} required autoFocus className={classNames({ 'p-invalid': submitted && !transportista.ruc_cedula })} />
          {submitted && !transportista.ruc_cedula && <small className="p-error">RUC o cedula es requerido</small>}
        </div>
        <div className="p-field w-50">
          <label htmlFor="placa">PLACA</label>
          <InputText id="placa" value={transportista.placa} onChange={(e) => onInputChange(e, 'placa')} required autoFocus className={classNames({ 'p-invalid': submitted && !transportista.placa })} />
          {submitted && !transportista.placa && <small className="p-error">La placa es requerida</small>}
        </div>
        <div className="p-field w-50">
          <label htmlFor="rise">RISE</label><br/>
          <Dropdown id="rise" value={transportista.rise}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'rise')} options={contribuyenteOptions}/>
        </div>
        <div className="p-field w-100">
          <label htmlFor="direccion">DIRECCIÓN</label>
          <InputTextarea id="direccion" value={transportista.direccion} onChange={(e) => onInputChange(e, 'direccion')} required rows={3} cols={20} />
        </div>
      </Dialog>

      <Dialog visible={deleteTransportistaDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTransportistaDialogFooter} onHide={hideDeleteTransportistaDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {transportista && <span>Esta seguro que desea eliminar <b>{transportista.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteTransportistasDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTransportistasDialogFooter} onHide={hideDeleteTransportistasDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {transportista && <span>Esta seguro que desea eliminar este transportista?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default TransportistasData