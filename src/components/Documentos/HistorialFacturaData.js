import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { DocumentosService } from '../../service/DocumentosService';
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

const HistorialFacturasData = (props) => {

  let emptyHistorialFactura =  {
    id: null,
    nombre: "",
    codigo: "",
    codigo_aux: "",
    codigo_aux: "",
    porcentaje_iva: "",
    tipo_historialFactura: "",
    valor_unitario: 0
  };
  console.log(props)
  const [historialFacturas, setHistorialFacturas] = useState(null);
  const [historialFacturaDialog, setHistorialFacturaDialog] = useState(false);
  const [deleteHistorialFacturaDialog, setDeleteHistorialFacturaDialog] = useState(false);
  const [deleteHistorialFacturasDialog, setDeleteHistorialFacturasDialog] = useState(false);
  const [historialFactura, setHistorialFactura] = useState(emptyHistorialFactura);
  const [selectedHistorialFacturas, setSelectedHistorialFacturas] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const documentosService = new DocumentosService();
  const tipoHistorialFacturaOptions = ['BIEN','MAL','REGULAR'];
  const porcentajeIvaOptions = ['OTROS','10-20','20-40']

  useEffect(() => {
    documentosService.getHistorialFacturas().then(data => setHistorialFacturas(data));
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
    setHistorialFactura(emptyHistorialFactura);
    setSubmitted(false);
    setHistorialFacturaDialog(true);
  }

 

  const hideDialog = (e) => {
    setSubmitted(false);
    console.log("HIDE DIALOG");
  }





  const exportCSV = () => {
    dt.current.exportCSV();
  }

  const confirmDeleteSelected = () => {
    setDeleteHistorialFacturasDialog(true);
  }

  const deleteSelectedHistorialFacturas = () => {
    let _historialFacturas = historialFacturas.filter(val => !selectedHistorialFacturas.includes(val));
    setHistorialFacturas(_historialFacturas);
    setDeleteHistorialFacturasDialog(false);
    setSelectedHistorialFacturas(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'HistorialFacturas Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _historialFactura = { ...historialFactura };
    _historialFactura['category'] = e.value;
    setHistorialFactura(_historialFactura);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _historialFactura = { ...historialFactura };
    _historialFactura[`${name}`] = val;

    setHistorialFactura(_historialFactura);
  }

 

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedHistorialFacturas || !selectedHistorialFacturas.length} />
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
                <Button icon="pi pi-file-pdf" className="p-button-rounded p-button-success p-mr-2" onClick={() => confirmDeleteSelected(rowData)} />

        <Button icon="pi pi-file-excel" className="p-button-rounded p-button-success p-mr-2" onClick={() => confirmDeleteSelected(rowData)} />
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => confirmDeleteSelected(rowData)} />
        <Button icon="pi pi-eye" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteSelected(rowData)} />
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
 

  const deleteHistorialFacturasDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={deleteSelectedHistorialFacturas} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedHistorialFacturas} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={historialFacturas} selection={selectedHistorialFacturas} onSelectionChange={(e) => setSelectedHistorialFacturas(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} historialFacturas"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="ruc" header="RUC/CEDULA" sortable filter></Column>
          <Column field="razon_social" header="RAZON SOCIAL CLIENTE"  sortable filter ></Column>
          <Column field="numero_factura" header="NRO FACTURA" sortable filter></Column>
          <Column field="fecha_emision" header="VALOR UNITARIO" sortable filter ></Column>
          <Column field="estado" header="ESTADO" sortable  filter></Column>
        
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

     

      <Dialog visible={deleteHistorialFacturaDialog} style={{ width: '450px' }} header="Confirm" modal >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {historialFactura && <span>Esta seguro que desea eliminar <b>{historialFactura.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteHistorialFacturasDialog} style={{ width: '450px' }} header="Confirm" modal>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {historialFactura && <span>Esta seguro que desea eliminar este historialFactura?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default HistorialFacturasData