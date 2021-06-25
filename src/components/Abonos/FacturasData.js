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

import './common.css';
import { Panel } from 'primereact/panel';

const FacturasData = (props) => {

  let emptyPago = {
    forma:"",
    plazo:0,
    unidad_plazo:"",
    propina:0
  }
  let emptyProducto = {
    cantidad:0,
    producto:"",
    descuento:""
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
  console.log(props)
  const [facturas, setFacturas] = useState(null);
  const [clientes, setBeneficiarios] = useState(null);
  const [dropdownProductos,setDropdownProductos] = useState(null)
  const [selectedBeneficiarios, setSelectedBeneficiarios] = useState(null);
  const [pago,setPago ]=useState(emptyPago);
  const [facturaDialog, setFacturaDialog] = useState(false);
  const [deleteFacturaDialog, setDeleteFacturaDialog] = useState(false);
  const [deleteFacturasDialog, setDeleteFacturasDialog] = useState(false);
  const [factura, setFactura] = useState(emptyFactura);
  const [selectedFacturas, setSelectedFacturas] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [disableSave, setDisableSave] = useState(true);
  const [empresa,setEmpresa] = useState(null)

  const toast = useRef(null);
  const dt = useRef(null);
  const bancaService = new BancaService();
  const prestamoService = new PrestamoService();

  const tipoFacturaOptions = ['BIEN','MAL','REGULAR'];
  const porcentajeIvaOptions = ['OTROS','10-20','20-40'];
  const dropdownRegistra = ["DEBE","HABER"];
  const dropdownCuentas = ["--CUENTA-PRINCIPAL--","ACTIVOS","PASIVOS"];
  const dropdownFormas = ["Forma Pago 1", "Forma Pago 2", "Forma Pago 3"];
  const dropdownUnidadPlazo = ["Días", "Semanas", "Meses"];
  let serviceApp = ServiceApp.getInstance();

  useEffect(() => {
    bancaService.getFacturas().then(data => setFacturas(data));
    serviceApp.getClientes().then(data => setBeneficiarios(data));
    serviceApp.getAllProductos().then(data => setDropdownProductos(data));
    
    
    //esto si la api lo puede setear mejor
    serviceApp.getCurrentUser().then(data => {
      console.log(data);
      if(data.user!=undefined){
        if(data.user.empresa!=undefined&&data.user.empresa!=null){
          setEmpresa(data.user.empresa);
          console.log("datos de empresa",data.user.empresa)
        }

      }else{
        console.log("aun no entiende",data)
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

  const saveFactura = () => {
    setSubmitted(true);
    console.log("BENEFISIARIOS",selectedBeneficiarios);
     var _factura = factura
      _factura["formaPago_id"] = pago["forma"];
      _factura["unidadTiempo_id"] = pago["unidad_plazo"];
      _factura["propina"] = pago["propina"];
      _factura["plazos"] = pago["plazo"];
      _factura["cliente_id"] = selectedBeneficiarios.id
      _factura["productos"] = factura["productos"]
      _factura["empresa_id"] = empresa["id"]
      console.log(selectedBeneficiarios)
      console.log("MI FACTURA ",_factura)
      serviceApp.addFactura(_factura).then(d=>{
        console.log(d);
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
                      <Dropdown value={producto.producto} onChange={(e) => onInputProductoChange(e,'producto',i)} options={dropdownProductos}  placeholder="Seleccione que registra"   optionLabel="nombre" optionValue="id"/>
                      {/* <InputText id="ruc" value={factura.ruc} onChange={(e) => onInputChange(e, 'ruc')} required autoFocus className={classNames({ 'p-invalid': submitted && !factura.ruc })} />
                      {submitted && !factura.ruc && <small className="p-error">RUC es requerido.</small>} */}
                    </div>
                    <div className="p-field w-30">
            <label htmlFor="descuento">Descuento</label><br/>
            <InputText id="descuento" value={producto.descuento} onChange={(e) => onInputProductoChange(e, 'descuento',i)} required  className={classNames({ 'p-invalid': submitted && !producto.descuento })} />
            {submitted && !producto.descuento && <small className="p-error">Cantidad es requerida.</small>}
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
          <Dropdown value={pago.forma} onChange={(e) => onInputPagoChange(e,'forma')} options={dropdownFormas}  placeholder="Seleccione forma de pago"   itemTemplate={itemTemplate}/>
        </div>
        <div className="p-field w-30">
          <label htmlFor="plazo">Plazo</label>
          <InputText id="plazo" value={pago.plazo} onChange={(e) => onInputPagoChange(e, 'plazo')} required className={classNames({ 'p-invalid': submitted && !pago.plazo })} />
          {submitted && !pago.plazo && <small className="p-error">plazo es requerido</small>}
        </div>
        <div className="p-field w-20">
          <label htmlFor="unidad_plazo">Unidad de tiempo</label>
          <Dropdown value={pago.unidad_plazo} onChange={(e) => onInputPagoChange(e,'unidad_plazo')} options={dropdownUnidadPlazo}  placeholder="Seleccione forma de pago"   itemTemplate={itemTemplate}/>
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