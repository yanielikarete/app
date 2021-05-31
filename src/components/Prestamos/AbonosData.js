import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { PrestamoService } from '../../service/PrestamoService';
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
import { OverlayPanel } from 'primereact/overlaypanel';

import './common.css';

const AbonosData = (props) => {

  let emptyAbono = {
      cantidd:0,
      tipo_abono:'',
      descripcion_abono:'',
      descripcion:''
  };
    let emptyPrestamo = {
      id: null,
      comprobante: "0",
      ruc_cedula: "0",
      cliente: "",
      plazo: "0 días",
      pagado:0,
      total:0,
      fecha_limite:""
  };
  let abonoSearch = {
    realizado:"No",
    fecha:"",
    criterio:""
  }
  let emptyAbonoRemover = {
    cantidad:0,
    descripcion:""
  };

  const [prestamos, setPrestamos] = useState(null);
  const [abonos, setAbonos] = useState(null);
  const [abonoDialog, setAbonoDialog] = useState(false);
  const [eliminarAbonoDialog, setDeleteAbonoDialog] = useState(false);
  const [eliminarAbonosDialog, setDeleteAbonosDialog] = useState(false);
  const [abono, setAbono] = useState(emptyAbono);
  const [abonoRemover, setAbonoRemover] = useState(emptyAbonoRemover);
  const [selectedAbono, setSelectedAbono] = useState(null);
  const [selectedPrestamo, setSelectedPrestamo] = useState(emptyPrestamo);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [informacion_adicional, setInformacionAdicional] = useState("");
  const toast = useRef(null);
  const dt = useRef(null);
  const op2 = useRef(null);
  const prestamoService = new PrestamoService();
  const tipoAbonoOptions = ['BIEN','MAL','REGULAR'];
  const porcentajeIvaOptions = ['OTROS','10-20','20-40']

  useEffect(() => {
    prestamoService.getPrestamos().then(data => setPrestamos(data));
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
  const agregarAbono = () => {
    setAbono(emptyAbono);
    setSubmitted(false);
    setAbonoDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setAbonoDialog(false);
  }

  const hideDeleteAbonoDialog = () => {
    setDeleteAbonoDialog(false);
  }

  const hideDeleteAbonosDialog = () => {
    setDeleteAbonosDialog(false);
  }

  const deleteAbono = () =>{
    setDeleteAbonoDialog(false);

  }
  const saveAbono = () => {
    setSubmitted(true);

    if (abono.codigo.trim()) {
      let _prestamos = [...prestamos];
      let _abono = { ...abono };
      if (abono.id) {
        const index = findIndexById(abono.id);

        _prestamos[index] = _abono;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Abono Updated', life: 3000 });
      }
      else {
        _abono.id = createId();
        _abono.image = 'abono-placeholder.svg';
        _prestamos.push(_abono);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Abono Created', life: 3000 });
      }

      setPrestamos(_prestamos);
      setAbonoDialog(false);
      setAbono(emptyAbono);
    }
  }

  const editAbono = (abono) => {
    setAbono({ ...abono });
    setAbonoDialog(true);
  }

  

  const eliminarAbono = (abono) => {
    setAbono(abono);
    setDeleteAbonoDialog(true);
  }


  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < prestamos.length; i++) {
      if (prestamos[i].id === id) {
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
    setDeleteAbonosDialog(true);
  }

  const onRealizadoChange = (e) => {
      console.log("cambiado si-no",e);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _abono = { ...abono };
    _abono[`${name}`] = val;

    setAbono(_abono);
  }
  const onRemoverInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _abonoRemover = { ...abonoRemover };
    _abonoRemover[`${name}`] = val;

    setAbonoRemover(_abonoRemover);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _abono = { ...abono };
    _abono[`${name}`] = val;

    setAbono(_abono);
  }



  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-dollar" className="p-button-rounded p-button-success p-mr-2" onClick={() => agregarAbono(rowData)} tooltip="Agregar abono"/>
        <Button icon="pi pi-dollar" className="p-button-rounded p-button-danger p-mr-2" onClick={() => eliminarAbono(rowData)} tooltip="Eliminar abono"/>
        <Button icon="pi pi-eye" className="p-button-rounded p-button-info p-mr-2" onClick={(e) => toggleDataTable(e,rowData)} />
        <Button icon="pi pi-file-excel" className="p-button-rounded p-button-warning" onClick={() => eliminarAbono(rowData)} />
      </React.Fragment>
    );
  }

  const toggleDataTable = (e,rowData) => {
    prestamoService.getAbonos(rowData).then(data => setAbonos(data));
    setInformacionAdicional(rowData.informacion_adicional)
    op2.current.toggle(e);
};

  const header = (
    <div className="table-header">
      <h3>Abonos realizados</h3>
      <div className="p-field-radiobutton">
              <RadioButton inputId="si" name="realizado" value="Si" onChange={onRealizadoChange} checked={abonoSearch.category === 'Si'} />
              <label htmlFor="si">Si</label>
            </div>
            <div className="p-field-radiobutton">
              <RadioButton inputId="no" name="realizado" value="No" onChange={onRealizadoChange} checked={abonoSearch.category === 'No'} />
              <label htmlFor="no">No</label>
      </div>
      <span className="p-input-icon-left  w-30">
        <i className="pi pi-search" />
        <InputText type="Buscar" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Intervalo..." className="w-100"  />
      </span>
      <span className="p-input-icon-left w-30">
        <i className="pi pi-search" />
        <InputText type="Buscar" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..."  className="w-100"/>
      </span>
      
    </div>
  );
  const abonoDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveAbono} />
    </React.Fragment>
  );
  const eliminarAbonoDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDeleteAbonoDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={deleteAbono} />
    </React.Fragment>
  );


  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">

        <DataTable ref={dt} value={prestamos} selection={selectedAbono} onSelectionChange={(e) => setSelectedAbono(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} prestamos"
          globalFilter={globalFilter}
          header={header}>

          <Column field="comprobante" header="No. comprobante" sortable ></Column>
          <Column field="ruc_cedula" header="RUC"  sortable ></Column>
          <Column field="cliente" header="CLIENTE" sortable ></Column>
          <Column field="plazo" header="PLAZO" sortable  ></Column>
          <Column field="pagado" header="PAGADO" sortable  ></Column>
          <Column field="total" header="TOTAL" sortable  ></Column>
          <Column field="fecha_limite" header="FECHA LIMITE" sortable  ></Column>
        
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={abonoDialog} style={{ width: '450px' }} header="Agregar Abono" modal className="p-fluid" footer={abonoDialogFooter} onHide={hideDialog}>
        {abono.image && <img src={`showcase/demo/images/abono/${abono.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={abono.image} className="abono-image" />}
        <div className="p-field w-100">
          <label htmlFor="cantidad">Cantidad a abonar</label>
          <InputText id="cantidad" value={abono.cantidad} onChange={(e) => onInputChange(e, 'cantidad')} required className={classNames({ 'p-invalid': submitted && !abono.cantidad })} />
          {submitted && !abono.cantidad && <small className="p-error">Cantidad del abono requerido</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="tipo_abono">Forma de pago</label><br/>
          <Dropdown id="tipo_abono" value={abono.tipo_abono}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'tipo_abono')} options={tipoAbonoOptions}/>
        </div>
        <div className="p-field w-100">
          <label htmlFor="descripcion_abono">Descripción de forma de pago</label>
          <InputText id="descripcion_abono" value={abono.descripcion_abono} onChange={(e) => onInputChange(e, 'descripcion_abono')} />
        </div>
        <div className="p-field w-100">
          <label htmlFor="descripcion">Descripción</label>
          <InputTextarea id="descripcion" value={abono.descripcion} onChange={(e) => onInputChange(e, 'descripcion')} required rows={3} cols={20} />
        </div>
      </Dialog>

      <Dialog visible={eliminarAbonoDialog} style={{ width: '450px' }} header="Eliminar prestamos" modal footer={eliminarAbonoDialogFooter} onHide={hideDeleteAbonoDialog}>
      <div className="p-field w-100">
          <label htmlFor="cantidad">Cantidad a eliminar</label>
          <InputText id="cantidad" value={abonoRemover.cantidad} onChange={(e) => onRemoverInputChange(e, 'cantidad')} required className={classNames({ 'p-invalid': submitted && !abonoRemover.cantidad })} />
          {submitted && !abonoRemover.cantidad && <small className="p-error">Cantidad a eliminar requerido</small>}
        </div>
        <div className="p-field w-100">
          <label htmlFor="descripcion">Descripción</label>
          <InputTextarea id="descripcion" value={abonoRemover.descripcion} onChange={(e) => onRemoverInputChange(e, 'descripcion')} required rows={3} cols={20} />
        </div>
      </Dialog>

      <OverlayPanel  ref={op2} appendTo={document.body} showCloseIcon id="overlay_panel" style={{ width: '650px' }}>
        <div>
          {informacion_adicional}
        </div>
                                    <DataTable value={abonos}
                                        paginator rows={5}>
                                        <Column field="fecha_pago" header="Fecha de Pago" sortable></Column>
                                        <Column field="forma_pago" header="Image" ></Column>
                                        <Column field="descripcion_pago" header="Descripción de pago" ></Column>
                                        <Column field="descripcion" header="Descripción" ></Column>
                                        <Column field="cantidad" header="Cantidad" ></Column>
                                        <Column field="cantidad_exedente" header="Cantidad Exedente" ></Column>
                                    </DataTable>
                                </OverlayPanel>
    
    </div>
    </>
  );
}

export default AbonosData