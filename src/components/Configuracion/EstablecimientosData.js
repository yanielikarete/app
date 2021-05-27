import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { EstablecimientoService } from '../../service/EstablecimientoService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './common.css';

const EstablecimientosData = (props) => {

  let emptyEstablecimiento = {
    id: null,
    name: '',
    image: null,
    direccion: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK'
  };
  console.log(props)
  const [establecimientos, setEstablecimientos] = useState(null);
  const [establecimientoDialog, setEstablecimientoDialog] = useState(false);
  const [deleteEstablecimientoDialog, setDeleteEstablecimientoDialog] = useState(false);
  const [deleteEstablecimientosDialog, setDeleteEstablecimientosDialog] = useState(false);
  const [establecimiento, setEstablecimiento] = useState(emptyEstablecimiento);
  const [selectedEstablecimientos, setSelectedEstablecimientos] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const establecimientoService = new EstablecimientoService();

  useEffect(() => {
    establecimientoService.getEstablecimientos().then(data => setEstablecimientos(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  const openNew = () => {
    setEstablecimiento(emptyEstablecimiento);
    setSubmitted(false);
    setEstablecimientoDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setEstablecimientoDialog(false);
  }

  const hideDeleteEstablecimientoDialog = () => {
    setDeleteEstablecimientoDialog(false);
  }

  const hideDeleteEstablecimientosDialog = () => {
    setDeleteEstablecimientosDialog(false);
  }

  const saveEstablecimiento = () => {
    setSubmitted(true);

    if (establecimiento.nombre.trim()) {
      let _establecimientos = [...establecimientos];
      let _establecimiento = { ...establecimiento };
      if (establecimiento.id) {
        const index = findIndexById(establecimiento.id);

        _establecimientos[index] = _establecimiento;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Establecimiento Updated', life: 3000 });
      }
      else {
        _establecimiento.id = createId();
        _establecimiento.image = 'establecimiento-placeholder.svg';
        _establecimientos.push(_establecimiento);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Establecimiento Created', life: 3000 });
      }

      setEstablecimientos(_establecimientos);
      setEstablecimientoDialog(false);
      setEstablecimiento(emptyEstablecimiento);
    }
  }

  const editEstablecimiento = (establecimiento) => {
    setEstablecimiento({ ...establecimiento });
    setEstablecimientoDialog(true);
  }

  const confirmDeleteEstablecimiento = (establecimiento) => {
    setEstablecimiento(establecimiento);
    setDeleteEstablecimientoDialog(true);
  }

  const deleteEstablecimiento = () => {
    let _establecimientos = establecimientos.filter(val => val.id !== establecimiento.id);
    setEstablecimiento(_establecimientos);
    setDeleteEstablecimientoDialog(false);
    setEstablecimiento(emptyEstablecimiento);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Establecimiento Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < establecimientos.length; i++) {
      if (establecimientos[i].id === id) {
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
    setDeleteEstablecimientosDialog(true);
  }

  const deleteSelectedEstablecimientos = () => {
    let _establecimientos = establecimientos.filter(val => !selectedEstablecimientos.includes(val));
    setEstablecimientos(_establecimientos);
    setDeleteEstablecimientosDialog(false);
    setSelectedEstablecimientos(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Establecimientos Deleted', life: 3000 });
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _establecimiento = { ...establecimiento };
    _establecimiento[`${name}`] = val;

    setEstablecimiento(_establecimiento);
  }



  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedEstablecimientos || !selectedEstablecimientos.length} />
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

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editEstablecimiento(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteEstablecimiento(rowData)} />
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
  const establecimientoDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveEstablecimiento} />
    </React.Fragment>
  );
  const deleteEstablecimientoDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEstablecimientoDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteEstablecimiento} />
    </React.Fragment>
  );
  const deleteEstablecimientosDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteEstablecimientosDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedEstablecimientos} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={establecimientos} selection={selectedEstablecimientos} onSelectionChange={(e) => setSelectedEstablecimientos(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} establecimientos"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="nombre" header="Nombre" sortable></Column>
          <Column field="codigo" header="Codigo" sortable></Column>
          <Column field="direccion" header="Direccion" sortable></Column>
          {/* <Column header="Image" body={imageBodyTemplate}></Column>
          <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column> */}
          {/* <Column field="category" header="Category" sortable></Column> */}

          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={establecimientoDialog} style={{ width: '450px' }} header="Establecimiento Details" modal className="p-fluid" footer={establecimientoDialogFooter} onHide={hideDialog}>
        {establecimiento.image && <img src={`showcase/demo/images/establecimiento/${establecimiento.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={establecimiento.image} className="establecimiento-image" />}
        <div className="p-field w-100">
          <label htmlFor="nombre">Nombre</label>
          <InputText id="nombre" value={establecimiento.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !establecimiento.nombre })} />
          {submitted && !establecimiento.nombre && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="codigo">codigo</label>
          <InputText id="codigo" value={establecimiento.codigo} onChange={(e) => onInputChange(e, 'codigo')} required autoFocus className={classNames({ 'p-invalid': submitted && !establecimiento.codigo })} />
          {submitted && !establecimiento.codigo && <small className="p-error">Codigo es requerido.</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="direccion">Direccion</label>
          <InputTextarea id="direccion" value={establecimiento.direccion} onChange={(e) => onInputChange(e, 'direccion')} required rows={3} cols={20} />
        </div>

      

        
      </Dialog>

      <Dialog visible={deleteEstablecimientoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEstablecimientoDialogFooter} onHide={hideDeleteEstablecimientoDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {establecimiento && <span>Are you sure you want to delete <b>{establecimiento.nombre}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteEstablecimientosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteEstablecimientosDialogFooter} onHide={hideDeleteEstablecimientosDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {establecimiento && <span>Are you sure you want to delete the selected establecimientos?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default EstablecimientosData