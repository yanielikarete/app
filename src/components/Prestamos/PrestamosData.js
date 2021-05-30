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
import { Panel } from 'primereact/panel';

import './common.css';

const PrestamoData = (props) => {

  let emptyBeneficiario = {
    id: null,
    ruc_cedula: '',
    razon_social: '',
    direccion: '',
    email: '',
    tipo_id: "RUC",
  };
  let datosPrestamo = {
    beneficiario:emptyBeneficiario,
    monto_prestamo: 0 ,
    plazo_devolucion: 0,
    informacion_adicional:""
  }
  console.log(props)
  const [clientes, setBeneficiarios] = useState(null);
  const [clienteDialog, setBeneficiarioDialog] = useState(false);
  const [deleteBeneficiarioDialog, setDeleteBeneficiarioDialog] = useState(false);
  const [deleteBeneficiariosDialog, setDeleteBeneficiariosDialog] = useState(false);
  const [cliente, setBeneficiario] = useState(emptyBeneficiario);
  const [selectedBeneficiarios, setSelectedBeneficiarios] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const prestamoService = new PrestamoService();
  const tipoIdOptions = ['RUC','IDENTIFICACION'];
  const contribuyenteOptions = ['OTROS','RESPONSABLE'];

  useEffect(() => {
    prestamoService.getBeneficiarios().then(data => setBeneficiarios(data));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  const savePrestamo = () => {
      setSubmitted(true);
      prestamoService.savePrestamo(datosPrestamo)
      toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Prestamo Creado', life: 3000 });
  }






  const exportCSV = () => {
    dt.current.exportCSV();
  }

  const confirmDeleteSelected = () => {
    setDeleteBeneficiariosDialog(true);
  }

  const deleteSelectedBeneficiarios = () => {
    let _clientes = clientes.filter(val => !selectedBeneficiarios.includes(val));
    setBeneficiarios(_clientes);
    setDeleteBeneficiariosDialog(false);
    setSelectedBeneficiarios(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Beneficiarios Deleted', life: 3000 });
  }

  const selectBeneficiario = (e) =>{
    setDisableSave(false)
    setSelectedBeneficiarios(e.value)

  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _cliente = { ...cliente };
    _cliente[`${name}`] = val;

    setBeneficiario(_cliente);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _cliente = { ...cliente };
    _cliente[`${name}`] = val;

    setBeneficiario(_cliente);
  }






  const header = (
    <div className="table-header ">
      <span className="p-input-icon-left w-100">
        <i className="pi pi-search" />
        <InputText type="Buscar" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar beneficiario..." className="w-100" />
      </span>
    </div>
  );




  return (
      <>
      <h1>Nuevo Prestamo</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <Panel header="Datos del beneficiario" toggleable>
        <DataTable ref={dt} value={clientes} selection={selectedBeneficiarios} onSelectionChange={(e) => selectBeneficiario(e)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clientes"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
          <Column field="ruc_cedula" header="RUC/CEDULA/ID" sortable filter></Column>
          <Column field="razon_social" header="NOMBRE/RAZÓN SOCIAL" filter sortable ></Column>
          {/* <Column field="email" header="EMAIL" sortable filter></Column> */}
          <Column field="direccion" header="DIRECCIÓN" sortable filter></Column>
        </DataTable>
      </Panel>

      <Panel header="Datos del prestamo" toggleable>
          <div className="p-field w-40">
            <label htmlFor="monto_prestamo">Monto Prestamo</label><br/>
            <InputText id="monto_prestamo" value={datosPrestamo.monto_prestamo} onChange={(e) => onInputChange(e, 'monto_prestamo')} required  className={classNames({ 'p-invalid': submitted && !datosPrestamo.monto_prestamo })} />
            {submitted && !datosPrestamo.monto_prestamo && <small className="p-error">Monto requerido</small>}

          </div>
          <div className="p-field w-40">
            <label htmlFor="plazo_devolucion">Plazo para la devolución (en días)</label><br/>
            <InputText id="plazo_devolucion" value={datosPrestamo.plazo_devolucion} onChange={(e) => onInputNumberChange(e, 'plazo_devolucion')} required  className={classNames({ 'p-invalid': submitted && !datosPrestamo.plazo_devolucion })} />
            {submitted && !datosPrestamo.plazo_devolucion && <small className="p-error">Plazo requerido</small>}
          </div>
          <div className="p-field w-100">
          <label htmlFor="informacion_adicional">Información Adicional</label>
          <InputTextarea id="informacion_adicional" value={cliente.informacion_adicional} onChange={(e) => onInputChange(e, 'informacion_adicional')} required rows={3} cols={20} />
        </div>
        <React.Fragment>
          <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={savePrestamo} disabled={disableSave} />
        </React.Fragment>
        </Panel>

    

      

      
    </div>
    </>
  );
}

export default PrestamoData