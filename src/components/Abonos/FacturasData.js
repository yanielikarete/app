import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { BancaService } from '../../service/BancaService';
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
import { ServiceApp } from '../../service/ServiceApp';
import {useHistory} from 'react-router-dom';
// import PrefacturaData from './PrefacturaData.js'
import './common.css';
import { Panel } from 'primereact/panel';
// import Component from '@fullcalendar/core/component/Component';

const FacturasData = (props) => {

  let datosFactura = null
  let emptyPago = {
    forma:"",
    plazo:0,
    unidad_plazo:"",
    propina:0
  }
  let emptyProducto = {
    cantidad:0,
    producto_id:"",
    // descuento:"",
    precio_unitario: 0,
    descuento: 0,
    tarifaiva_id:""
  };
  let emptyFactura =  {
    id: null,
    registra:"",
    monto_asiento:0,
    cuenta:"",
    titulo:"",
    comentarios:"",
    productos:[]
  };
  console.log(props,"props")
  const [result, setResult] = useState(null);
  const [facturas, setFacturas] = useState(null);
  const [clientes, setBeneficiarios] = useState(null);
  const [dropdownProductos,setDropdownProductos] = useState(null)
  const [dropdownTarifaIva,setDropdownTarifaIva] = useState(null)
  const [selectedBeneficiarios, setSelectedBeneficiarios] = useState(null);
  const [pago,setPago ]=useState(emptyPago);
  const [documentId,setDocumentId ]=useState(null);
  const [facturaDialog, setFacturaDialog] = useState(false);
  const [deleteFacturaDialog, setDeleteFacturaDialog] = useState(false);
  const [deleteFacturasDialog, setDeleteFacturasDialog] = useState(false);
  const [factura, setFactura] = useState(emptyFactura);
  const [selectedFacturas, setSelectedFacturas] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dropdownFormas, setDropdownFormas] = useState(null);
  const [dropdownUnidadPlazo, setDropdownUnidadPlazo] = useState(null);
  const [disableSave, setDisableSave] = useState(true);

  const toast = useRef(null);
  const dt = useRef(null);
  const bancaService = new BancaService();
  const prestamoService = new PrestamoService();

  const tipoFacturaOptions = ['BIEN','MAL','REGULAR'];
  const porcentajeIvaOptions = ['OTROS','10-20','20-40'];
  const dropdownRegistra = ["DEBE","HABER"];
  const dropdownCuentas = ["--CUENTA-PRINCIPAL--","ACTIVOS","PASIVOS"];

  let serviceApp = ServiceApp.getInstance();

  useEffect(() => {
    bancaService.getFacturas().then(data => setFacturas(data));
    serviceApp.getClientes().then(data => setBeneficiarios(data));
    serviceApp.getAllProductos().then(data => setDropdownProductos(data));
    serviceApp.getTarifaIvas().then(data => setDropdownTarifaIva(data));
    serviceApp.getFormaPagos().then(data => setDropdownFormas(data));
    serviceApp.getUnidadTiempos().then(data => setDropdownUnidadPlazo(data));
    serviceApp.getTipoDocumento().then(d=>{
      for(const doc of d){
          if(doc.nombre==="facturas"){
              setDocumentId(doc.id)
          }
      }
    });
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
  const removeProducto = () =>{
    let _factura = { ...factura };
    _factura.productos.pop();
    setFactura(_factura);
  }
  const addProducto = () =>{
    let _factura = { ...factura };
    _factura.productos.push(emptyProducto);
    setFactura(_factura);

  }
  const openNew = () => {
    setFactura(emptyFactura);
    setSubmitted(false);
    setFacturaDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setFacturaDialog(false);
  }

  const hideDeleteFacturaDialog = () => {
    setDeleteFacturaDialog(false);
  }

  const hideDeleteFacturasDialog = () => {
    setDeleteFacturasDialog(false);
  }
  const history = useHistory();
  const saveFactura = () => {
    setSubmitted(true);
    console.log("BENEFISIARIOS",selectedBeneficiarios);
    const userString = sessionStorage.getItem('USER');
    const userOBJ = JSON.parse(userString);
    console.log(userOBJ);
     var _factura = factura
      _factura["formapago_id"] = pago["formapago_id"];
     
      _factura["unidadtiempo_id"] = pago["unidadtiempo_id"];
      _factura["propina"] = pago["propina"];
      _factura["tipodocumento_id"] =documentId;//FACTURA
      _factura["plazos"] = pago["plazo"];
      _factura["cliente_id"] = selectedBeneficiarios.id
      _factura["productos"] = factura["productos"]
      console.log(selectedBeneficiarios)
      console.log("MI FACTURA ",_factura)
      serviceApp.addFactura(_factura).then(data=>{
        // setResult(data)
        // console.log("result", result)
        console.log("respuesta de la api ", data);
        // datosFactura = data
        serviceApp.procesarFactura(data.id);
        history.push({pathname:"/prefacturas/" + data.id ,state: { detail: data}});
      })
      
    
      
      
    
  }

  const editFactura = (factura) => {
    setFactura({ ...factura });
    setFacturaDialog(true);
  }

  const confirmDeleteFactura = (factura) => {
    setFactura(factura);
    setDeleteFacturaDialog(true);
  }
  const selectBeneficiario = (e) =>{
    setDisableSave(false)
    setSelectedBeneficiarios(e.value)

  }
  const deleteFactura = () => {
    let _facturas = facturas.filter(val => val.id !== factura.id);
    setFactura(_facturas);
    setDeleteFacturaDialog(false);
    setFactura(emptyFactura);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Factura Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < facturas.length; i++) {
      if (facturas[i].id === id) {
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
    setDeleteFacturasDialog(true);
  }

  const deleteSelectedFacturas = () => {
    let _facturas = facturas.filter(val => !selectedFacturas.includes(val));
    setFacturas(_facturas);
    setDeleteFacturasDialog(false);
    setSelectedFacturas(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Facturas Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _factura = { ...factura };
    _factura['category'] = e.value;
    setFactura(_factura);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _factura = { ...factura };
    _factura[`${name}`] = val;

    setFactura(_factura);
  }
  const onInputProductoChange = (e, name,i) => {
    const val = (e.target && e.target.value) || '';
    let _factura = { ...factura };
    _factura['productos'][i][`${name}`] = val;
    setFactura(_factura);
  }

  const onInputPagoChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _pago = { ...pago };
    _pago[`${name}`] = val;
    setPago(_pago);
  }
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _factura = { ...factura };
    _factura[`${name}`] = val;

    setFactura(_factura);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Agregar" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={addProducto} />
        <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={removeProducto} disabled={!factura.productos.length} />
      </React.Fragment>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
                        <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveFactura} />

      </React.Fragment>
    )
  }




  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  }

  const statusBodyTemplate = (rowData) => {
    return <span className={`factura-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editFactura(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteFactura(rowData)} />
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
  const facturaDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveFactura} />
    </React.Fragment>
  );
  const deleteFacturaDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteFacturaDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteFactura} />
    </React.Fragment>
  );
  const deleteFacturasDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteFacturasDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedFacturas} />
    </React.Fragment>
  );





  return (
      <>
      <h1>{props.title}</h1>  
      
    <div>
      <div className="datatable-crud-demo"> 
        <Toast ref={toast} />

        <Panel header="Datos del cliente" toggleable>
        <DataTable ref={dt} value={clientes} selection={selectedBeneficiarios} onSelectionChange={(e) => selectBeneficiario(e)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clientes"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="single" headerStyle={{ width: '3rem' }}></Column>
          <Column field="ruc" header="RUC/CEDULA" sortable filter></Column>
          <Column field="nombre" header="RAZÓN SOCIAL" filter sortable ></Column>
          <Column field="correo" header="correo" sortable filter></Column>
          <Column field="direccion" header="DIRECCIÓN" sortable filter></Column>

        </DataTable>
      </Panel>


    
         
        <Panel header="PRODUCTOS" toggleable>
        {factura.productos.map(function(producto,i){
              return (
                <Panel header={"Producto "+(i+1)} >
                <h3></h3>
                <div className="row">
                <div className="p-field w-30">
            <label htmlFor="cantidad">Cantidad</label><br/>
            <InputText id="cantidad" value={producto.cantidad} onChange={(e) => onInputProductoChange(e, 'cantidad',i)} required  className={classNames({ 'p-invalid': submitted && !producto.cantidad })} />
            {submitted && !producto.cantidad && <small className="p-error">Cantidad es requerida.</small>}
          </div>
                   <div className="p-field w-20">

                      <label htmlFor="registra">Producto </label><br/>
                      <Dropdown value={producto.producto_id} onChange={(e) => onInputProductoChange(e,'producto_id',i)} options={dropdownProductos}  placeholder="Seleccione que registra"   optionLabel="nombre" optionValue="id"/>
                      {/* <InputText id="ruc" value={factura.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !factura.ruc })} />
                      {submitted && !factura.ruc && <small className="p-error">RUC es requerido.</small>} */}
                    </div>
                    <div className="p-field w-30">
            <label htmlFor="descuento">Descuento</label><br/>
            <InputText id="descuento" value={producto.descuento} onChange={(e) => onInputProductoChange(e, 'descuento',i)} required  className={classNames({ 'p-invalid': submitted && !producto.descuento })} />
            {submitted && !producto.descuento && <small className="p-error">Cantidad es requerida.</small>}
          </div>

          <div className="p-field w-20">

<label htmlFor="tarifa">Tarifa IVA </label><br/>
<Dropdown value={producto.tarifaiva_id} onChange={(e) => onInputProductoChange(e,'tarifaiva_id',i)} options={dropdownTarifaIva}  placeholder="Seleccione tarifa iva"   optionLabel="nombre" optionValue="id"/>
{/* <InputText id="ruc" value={factura.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !factura.ruc })} />
{submitted && !factura.ruc && <small className="p-error">RUC es requerido.</small>} */}
</div>
<div className="p-field w-30">
<label htmlFor="precio_unitario">Precio Unitario</label><br/>
<InputText id="precio_unitario" value={producto.precio_unitario} onChange={(e) => onInputProductoChange(e, 'precio_unitario',i)} required  className={classNames({ 'p-invalid': submitted && !producto.precio_unitario })} />
{submitted && !producto.precio_unitario && <small className="p-error">Cantidad es requerida.</small>}
</div>

                </div>
                </Panel>
              )
          })}
                  <Toolbar className="p-mb-4" left={leftToolbarTemplate} ></Toolbar>

        </Panel>
        
    <Panel header="PAGOS" toggleable>
      <div className="row">
        <div className="p-field w-20">
          <label htmlFor="forma">Forma de pago</label>
          <Dropdown value={pago.formapago_id} onChange={(e) => onInputPagoChange(e,'formapago_id')} options={dropdownFormas}  placeholder="Seleccione forma de pago" optionLabel="nombre" optionValue="id"/>
        </div>
        <div className="p-field w-30">
          <label htmlFor="plazo">Plazo</label>
          <InputText id="plazo" value={pago.plazo} onChange={(e) => onInputPagoChange(e, 'plazo')} required className={classNames({ 'p-invalid': submitted && !pago.plazo })} />
          {submitted && !pago.plazo && <small className="p-error">plazo es requerido</small>}
        </div>
        <div className="p-field w-20">
          <label htmlFor="unidadtiempo_id">Unidad de tiempo</label>
          <Dropdown value={pago.unidadtiempo_id} onChange={(e) => onInputPagoChange(e,'unidadtiempo_id')} options={dropdownUnidadPlazo}  placeholder="Seleccione forma de pago"  optionLabel="nombre" optionValue="id"/>
        </div>
        <div className="p-field w-30">
          <label htmlFor="propina">Propina</label>
          <InputText id="propina" value={pago.propina} onChange={(e) => onInputPagoChange(e, 'propina')} />
        </div>
        </div>
    </Panel>

    <Button label="Totales" icon="pi pi-eye" className="p-button p-component p-button-success p-mr-2" onClick={saveFactura} />
    <Button label="Prefactura" icon="pi pi-check" className="p-button" onClick={saveFactura} />

    </div>
    </div>
    </>
  );
}

export default FacturasData