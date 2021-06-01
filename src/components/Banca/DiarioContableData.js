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

const DiarioContablesData = (props) => {

  let emptyDiarioContable =  {
    id: null,
    nombre: "",
    codigo: "",
    codigo_aux: "",
    codigo_aux: "",
    porcentaje_iva: "",
    tipo_cuenta: "",
    valor_unitario: 0
  };
  console.log(props)
  const [cuentas, setDiarioContables] = useState(null);
  const [cuentaDialog, setDiarioContableDialog] = useState(false);
  const [deleteDiarioContableDialog, setDeleteDiarioContableDialog] = useState(false);
  const [deleteDiarioContablesDialog, setDeleteDiarioContablesDialog] = useState(false);
  const [cuenta, setDiarioContable] = useState(emptyDiarioContable);
  const [selectedDiarioContables, setSelectedDiarioContables] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const bancaService = new BancaService();
  const tipoDiarioContableOptions = ['BIEN','MAL','REGULAR'];
  const porcentajeIvaOptions = ['OTROS','10-20','20-40']

  useEffect(() => {
    bancaService.getDiarioContable().then(data => setDiarioContables(data));
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
    setDiarioContable(emptyDiarioContable);
    setSubmitted(false);
    setDiarioContableDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setDiarioContableDialog(false);
  }

  const hideDeleteDiarioContableDialog = () => {
    setDeleteDiarioContableDialog(false);
  }

  const hideDeleteDiarioContablesDialog = () => {
    setDeleteDiarioContablesDialog(false);
  }

  const saveDiarioContable = () => {
    setSubmitted(true);

    if (cuenta.codigo.trim()) {
      let _cuentas = [...cuentas];
      let _cuenta = { ...cuenta };
      if (cuenta.id) {
        const index = findIndexById(cuenta.id);

        _cuentas[index] = _cuenta;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'DiarioContable Updated', life: 3000 });
      }
      else {
        _cuenta.id = createId();
        _cuenta.image = 'cuenta-placeholder.svg';
        _cuentas.push(_cuenta);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'DiarioContable Created', life: 3000 });
      }

      setDiarioContables(_cuentas);
      setDiarioContableDialog(false);
      setDiarioContable(emptyDiarioContable);
    }
  }

  const editDiarioContable = (cuenta) => {
    setDiarioContable({ ...cuenta });
    setDiarioContableDialog(true);
  }

  const confirmDeleteDiarioContable = (cuenta) => {
    setDiarioContable(cuenta);
    setDeleteDiarioContableDialog(true);
  }

  const deleteDiarioContable = () => {
    let _cuentas = cuentas.filter(val => val.id !== cuenta.id);
    setDiarioContable(_cuentas);
    setDeleteDiarioContableDialog(false);
    setDiarioContable(emptyDiarioContable);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'DiarioContable Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < cuentas.length; i++) {
      if (cuentas[i].id === id) {
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
    setDeleteDiarioContablesDialog(true);
  }

  const deleteSelectedDiarioContables = () => {
    let _cuentas = cuentas.filter(val => !selectedDiarioContables.includes(val));
    setDiarioContables(_cuentas);
    setDeleteDiarioContablesDialog(false);
    setSelectedDiarioContables(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'DiarioContables Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _cuenta = { ...cuenta };
    _cuenta['category'] = e.value;
    setDiarioContable(_cuenta);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _cuenta = { ...cuenta };
    _cuenta[`${name}`] = val;

    setDiarioContable(_cuenta);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _cuenta = { ...cuenta };
    _cuenta[`${name}`] = val;

    setDiarioContable(_cuenta);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedDiarioContables || !selectedDiarioContables.length} />
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
    return <span className={`cuenta-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editDiarioContable(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteDiarioContable(rowData)} />
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
  const cuentaDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveDiarioContable} />
    </React.Fragment>
  );
  const deleteDiarioContableDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDiarioContableDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteDiarioContable} />
    </React.Fragment>
  );
  const deleteDiarioContablesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteDiarioContablesDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedDiarioContables} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={cuentas} selection={selectedDiarioContables} onSelectionChange={(e) => setSelectedDiarioContables(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} cuentas"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="fecha" header="FECHA"  sortable ></Column>
          <Column field="cuenta" header="CUENTA" sortable ></Column>
          <Column field="asiento" header="ASIENTO" sortable ></Column>
          <Column field="debe" header="DEBE" sortable  ></Column>
          <Column field="haber" header="HABER" sortable  ></Column>
          <Column field="descripcion" header="DESCRIPCION" sortable  ></Column>
          {/* <Column body={actionBodyTemplate}></Column> */}
        </DataTable>
      </div>

      <Dialog visible={cuentaDialog} style={{ width: '450px' }} header="Detalles del DiarioContable" modal className="p-fluid" footer={cuentaDialogFooter} onHide={hideDialog}>
        {cuenta.image && <img src={`showcase/demo/images/cuenta/${cuenta.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={cuenta.image} className="cuenta-image" />}
        <div className="p-field w-100">
          <label htmlFor="nombre">Nombre del cuenta</label>
          <InputText id="nombre" value={cuenta.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !cuenta.nombre })} />
          {submitted && !cuenta.nombre && <small className="p-error">Nombre del cuenta requerido</small>}
        </div>
        <div className="p-field w-50">
          <label htmlFor="codigo">Código</label>
          <InputText id="codigo" value={cuenta.codigo} onChange={(e) => onInputChange(e, 'codigo')} required className={classNames({ 'p-invalid': submitted && !cuenta.codigo })} />
          {submitted && !cuenta.codigo && <small className="p-error">Código es requerido</small>}
        </div>
        <div className="p-field w-50">
          <label htmlFor="codigo_aux">Código Auxiliar</label>
          <InputText id="codigo_aux" value={cuenta.codigo_aux} onChange={(e) => onInputChange(e, 'codigo_aux')} />
        </div>
       

        <div className="p-field w-100">
          <label htmlFor="valor_unitario w-50">Valor Unitario</label><br/>
          <InputText id="valor_unitario" value={cuenta.valor_unitario}   onChange={(e) => onInputChange(e,'valor_unitario')} />
        </div>
        <div className="p-field w-50">
          <label htmlFor="tipo_cuenta w-50">Tipo de DiarioContable</label><br/>
          <Dropdown id="tipo_cuenta" value={cuenta.tipo_cuenta}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'tipo_cuenta')} options={tipoDiarioContableOptions}/>
        </div>
        
        <div className="p-field w-50">
          <label htmlFor="porcentaje_iva">Porcentaje IVA</label><br/>
          <Dropdown id="porcentaje_iva" value={cuenta.porcentaje_iva}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'porcentaje_iva')} options={porcentajeIvaOptions}/>
        </div>
        
        
      </Dialog>

      <Dialog visible={deleteDiarioContableDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDiarioContableDialogFooter} onHide={hideDeleteDiarioContableDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {cuenta && <span>Esta seguro que desea eliminar <b>{cuenta.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteDiarioContablesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteDiarioContablesDialogFooter} onHide={hideDeleteDiarioContablesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {cuenta && <span>Esta seguro que desea eliminar este cuenta?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default DiarioContablesData