import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PuntosEmisionService } from '../../service/PuntosEmisionService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

import './common.css';

const PuntosEmisionsData = (props) => {

  let emptyPuntosEmision = {
    id: null,
    name: '',
    image: null,
    establecimiento: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK'
  };
  console.log(props)
  const [puntosemisions, setPuntosEmisions] = useState(null);
  const [puntosemisionDialog, setPuntosEmisionDialog] = useState(false);
  const [deletePuntosEmisionDialog, setDeletePuntosEmisionDialog] = useState(false);
  const [deletePuntosEmisionsDialog, setDeletePuntosEmisionsDialog] = useState(false);
  const [puntosemision, setPuntosEmision] = useState(emptyPuntosEmision);
  const [selectedPuntosEmisions, setSelectedPuntosEmisions] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const puntosemisionService = new PuntosEmisionService();

  useEffect(() => {
    puntosemisionService.getPuntosEmisions().then(data => setPuntosEmisions(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  }
  const estadoOptions = ['Activo','Inactivo']
  const establecimientos = ['Cargar','Establecimientos','Desde','Service']


  const openNew = () => {
    setPuntosEmision(emptyPuntosEmision);
    setSubmitted(false);
    setPuntosEmisionDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setPuntosEmisionDialog(false);
  }

  const hideDeletePuntosEmisionDialog = () => {
    setDeletePuntosEmisionDialog(false);
  }

  const hideDeletePuntosEmisionsDialog = () => {
    setDeletePuntosEmisionsDialog(false);
  }

  const savePuntosEmision = () => {
    setSubmitted(true);

    if (puntosemision.nombre.trim()) {
      let _puntosemisions = [...puntosemisions];
      let _puntosemision = { ...puntosemision };
      if (puntosemision.id) {
        const index = findIndexById(puntosemision.id);

        _puntosemisions[index] = _puntosemision;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'PuntosEmision Updated', life: 3000 });
      }
      else {
        _puntosemision.id = createId();
        _puntosemision.image = 'puntosemision-placeholder.svg';
        _puntosemisions.push(_puntosemision);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'PuntosEmision Created', life: 3000 });
      }

      setPuntosEmisions(_puntosemisions);
      setPuntosEmisionDialog(false);
      setPuntosEmision(emptyPuntosEmision);
    }
  }

  const editPuntosEmision = (puntosemision) => {
    setPuntosEmision({ ...puntosemision });
    setPuntosEmisionDialog(true);
  }

  const confirmDeletePuntosEmision = (puntosemision) => {
    setPuntosEmision(puntosemision);
    setDeletePuntosEmisionDialog(true);
  }

  const deletePuntosEmision = () => {
    let _puntosemisions = puntosemisions.filter(val => val.id !== puntosemision.id);
    setPuntosEmision(_puntosemisions);
    setDeletePuntosEmisionDialog(false);
    setPuntosEmision(emptyPuntosEmision);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'PuntosEmision Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < puntosemisions.length; i++) {
      if (puntosemisions[i].id === id) {
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
    setDeletePuntosEmisionsDialog(true);
  }

  const deleteSelectedPuntosEmisions = () => {
    let _puntosemisions = puntosemisions.filter(val => !selectedPuntosEmisions.includes(val));
    setPuntosEmisions(_puntosemisions);
    setDeletePuntosEmisionsDialog(false);
    setSelectedPuntosEmisions(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'PuntosEmisions Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _puntosemision = { ...puntosemision };
    _puntosemision['category'] = e.value;
    setPuntosEmision(_puntosemision);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _puntosemision = { ...puntosemision };
    _puntosemision[`${name}`] = val;

    setPuntosEmision(_puntosemision);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _puntosemision = { ...puntosemision };
    _puntosemision[`${name}`] = val;

    setPuntosEmision(_puntosemision);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedPuntosEmisions || !selectedPuntosEmisions.length} />
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
  const itemTemplate = (option) => {
    return (
        <div className="country-item">
            <span>{option}</span>
        </div>
    );
  };


  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editPuntosEmision(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePuntosEmision(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">{props.header}</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const puntosemisionDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={savePuntosEmision} />
    </React.Fragment>
  );
  const deletePuntosEmisionDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePuntosEmisionDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePuntosEmision} />
    </React.Fragment>
  );
  const deletePuntosEmisionsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePuntosEmisionsDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPuntosEmisions} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={puntosemisions} selection={selectedPuntosEmisions} onSelectionChange={(e) => setSelectedPuntosEmisions(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} puntosemisions"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="nombre" header="Nombre" sortable></Column>
          <Column field="codigo" header="Codigo" sortable></Column>
          <Column field="establecimiento" header="Establecimiento" sortable></Column>
          <Column field="estado" header="Estado" sortable></Column>
          {/* <Column header="Image" body={imageBodyTemplate}></Column>
          <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column> */}
          {/* <Column field="category" header="Category" sortable></Column> */}

          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={puntosemisionDialog} style={{ width: '450px' }} header="PuntosEmision Details" modal className="p-fluid" footer={puntosemisionDialogFooter} onHide={hideDialog}>
        {puntosemision.image && <img src={`showcase/demo/images/puntosemision/${puntosemision.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={puntosemision.image} className="puntosemision-image" />}
        <div className="p-field w-100">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" value={puntosemision.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !puntosemision.nombre })} />
          {submitted && !puntosemision.nombre && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="codigo">codigo</label>
          <InputText id="codigo" value={puntosemision.codigo} onChange={(e) => onInputChange(e, 'codigo')} required autoFocus className={classNames({ 'p-invalid': submitted && !puntosemision.codigo })} />
          {submitted && !puntosemision.codigo && <small className="p-error">Codigo es requerido.</small>}
        </div>
        <div className="p-field w-100">
            <label htmlFor="estado">Estado</label><br/>
            <Dropdown id="estado" value={puntosemision.estado}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'estado')} options={estadoOptions}/>
          </div>
        <div className="p-field w-100 mb-40">
          <label htmlFor="establecimiento">Establecimiento</label>
          <Dropdown id="establecimiento" value={puntosemision.establecimiento} itemTemplate={itemTemplate} onChange={(e) => onInputChange(e, 'establecimiento')} required rows={3} cols={20} options={establecimientos} />
        </div>
       
      

        
      </Dialog>

      <Dialog visible={deletePuntosEmisionDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePuntosEmisionDialogFooter} onHide={hideDeletePuntosEmisionDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {puntosemision && <span>Are you sure you want to delete <b>{puntosemision.nombre}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deletePuntosEmisionsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePuntosEmisionsDialogFooter} onHide={hideDeletePuntosEmisionsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {puntosemision && <span>Are you sure you want to delete the selected puntosemisions?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default PuntosEmisionsData