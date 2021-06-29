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
import {useHistory,useLocation} from 'react-router-dom';
import {useParams} from 'react-router';
// import FacturasData from './FacturasData.js'
import './common.css';
import { Panel } from 'primereact/panel';
const PrefacturaData = (props) => {

  let { id_factura }= useParams()
  let emptyPago = {
    forma:"",
    plazo:0,
    unidad_plazo:"",
    propina:0
  }
  let emptyProducto = {
    cantidad:0,
    producto_id:"",
    descuento:"",
    precio_unitario: 0,
    descuento: 0,
    tarifaiva_id:""
  };
  let emptyPrefactura =  {
    id: null,
    registra:"",
    monto_asiento:0,
    cuenta:"",
    titulo:"",
    comentarios:"",
    productos:[]
  };

  let datosFactura = null;
  const location = useLocation();

  const [prefacturas, setPrefacturas] = useState(null);
  const [clientes, setBeneficiarios] = useState(null);
  const [dropdownProductos,setDropdownProductos] = useState(null)
  const [dropdownTarifaIva,setDropdownTarifaIva] = useState(null)
  const [selectedBeneficiarios, setSelectedBeneficiarios] = useState(null);
  const [pago,setPago ]=useState(emptyPago);
  const [facturaDialog, setPrefacturaDialog] = useState(false);
  const [deletePrefacturaDialog, setDeletePrefacturaDialog] = useState(false);
  const [deletePrefacturasDialog, setDeletePrefacturasDialog] = useState(false);
  const [prefactura, setPrefactura] = useState(emptyPrefactura);
  const [selectedPrefacturas, setSelectedPrefacturas] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dropdownFormas, setDropdownFormas] = useState(null);
  const [dropdownUnidadPlazo, setDropdownUnidadPlazo] = useState(null);
  const [disableSave, setDisableSave] = useState(true);
  const [empresa,setEmpresa] = useState(null)

  const [productos, setProductos] = useState(null);
  const [selectedProductos, setSelectedProductos] = useState(null);

  const toast = useRef(null);
  const dt = useRef(null);
  const bancaService = new BancaService();
  const prestamoService = new PrestamoService();

  const tipoPrefacturaOptions = ['BIEN','MAL','REGULAR'];
  const porcentajeIvaOptions = ['OTROS','10-20','20-40'];
  const dropdownRegistra = ["DEBE","HABER"];
  const dropdownCuentas = ["--CUENTA-PRINCIPAL--","ACTIVOS","PASIVOS"];

  let serviceApp = ServiceApp.getInstance();

  const totales = [
    'SUBTOTAL 12%',
    'SUBTOTAL 14%' ,
    'SUBTOTAL 0%'  ,
    'SUBTOTAL 12%',
    'SUBTOTAL 14%' ,
    'SUBTOTAL 0%' ,
    'SUBTOTAL 12%' ,
    'SUBTOTAL 14%' ,
    'SUBTOTAL 0%' ,
    ,'SUBTOTAL 12%',
    'SUBTOTAL 14%' ,
    'SUBTOTAL 0%'

  ]

    

  
  useEffect(() => {
    // bancaService.getPrefacturas().then(data => setPrefacturas(data));
    // serviceApp.getClientes().then(data => setBeneficiarios(data));
    // serviceApp.getAllProductos().then(data => setDropdownProductos(data));
    // serviceApp.getTarifaIvas().then(data => setDropdownTarifaIva(data));
    // serviceApp.getFormaPagos().then(data => setDropdownFormas(data));
    // serviceApp.getUnidadTiempos().then(data => setDropdownUnidadPlazo(data));
    // serviceApp.getFactura(id_factura).then(data=> setPrefactura(data))
    console.log("STATES",location);
    const tokenString = sessionStorage.getItem('USER');
    const userObj = JSON.parse(tokenString);
    console.log("EMPRESA =>",userObj.user.empresa);
    if(userObj.user.empresa!=undefined)
      setEmpresa(userObj.user.empresa);

    serviceApp.getFactura(id_factura).then(d=>{
        console.log("datos prefactura", d)
        setPrefactura(d);
      })
    //esto si la api lo puede setear mejor
   
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
    let _factura = { ...prefactura };
    _factura.productos.pop();
    setPrefactura(_factura);
  }
  const addProducto = () =>{
    let _factura = { ...prefactura };
    _factura.productos.push(emptyProducto);
    setPrefactura(_factura);

  }
  const openNew = () => {
    setPrefactura(emptyPrefactura);
    setSubmitted(false);
    setPrefacturaDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setPrefacturaDialog(false);
  }

  const hideDeletePrefacturaDialog = () => {
    setDeletePrefacturaDialog(false);
  }

  const hideDeletePrefacturasDialog = () => {
    setDeletePrefacturasDialog(false);
  }
  const history = useHistory();
  
  const savePrefactura = () => {
    setSubmitted(true);
    console.log("BENEFISIARIOS",selectedBeneficiarios);
    const userString = sessionStorage.getItem('USER');
    const userOBJ = JSON.parse(userString);
    console.log(userOBJ);
     var _factura = prefactura
      _factura["formapago_id"] = pago["formapago_id"];
      _factura["empresa_id"] = empresa.id;
      _factura["unidadtiempo_id"] = pago["unidadtiempo_id"];
      _factura["propina"] = pago["propina"];
      _factura["tipodocumento_id"] = 1;//FACTURA
      _factura["plazos"] = pago["plazo"];
      _factura["cliente_id"] = selectedBeneficiarios.id
      _factura["productos"] = prefactura["productos"]
      console.log(selectedBeneficiarios)
      console.log("MI FACTURA ",_factura)
      serviceApp.addPrefactura(_factura).then(d=>{
        console.log(d);
      })
      
        
    
  }
 console.log("props", props)
  const editPrefactura = (prefactura) => {
    setPrefactura({ ...prefactura });
    setPrefacturaDialog(true);
  }

  const confirmDeletePrefactura = (prefactura) => {
    setPrefactura(prefactura);
    setDeletePrefacturaDialog(true);
  }
  const selectBeneficiario = (e) =>{
    setDisableSave(false)
    setSelectedBeneficiarios(e.value)

  }
  const deletePrefactura = () => {
    let _facturas = prefacturas.filter(val => val.id !== prefactura.id);
    setPrefactura(_facturas);
    setDeletePrefacturaDialog(false);
    setPrefactura(emptyPrefactura);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Prefactura Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < prefacturas.length; i++) {
      if (prefacturas[i].id === id) {
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
    setDeletePrefacturasDialog(true);
  }

  const deleteSelectedPrefacturas = () => {
    let _facturas = prefacturas.filter(val => !selectedPrefacturas.includes(val));
    setPrefacturas(_facturas);
    setDeletePrefacturasDialog(false);
    setSelectedPrefacturas(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Prefacturas Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _factura = { ...prefactura };
    _factura['category'] = e.value;
    setPrefactura(_factura);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _factura = { ...prefactura };
    _factura[`${name}`] = val;

    setPrefactura(_factura);
  }
  const onInputProductoChange = (e, name,i) => {
    const val = (e.target && e.target.value) || '';
    let _factura = { ...prefactura };
    _factura['productos'][i][`${name}`] = val;
    setPrefactura(_factura);
  }

  const onInputPagoChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _pago = { ...pago };
    _pago[`${name}`] = val;
    setPago(_pago);
  }
  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _factura = { ...prefactura };
    _factura[`${name}`] = val;

    setPrefactura(_factura);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Agregar" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={addProducto} />
        <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={removeProducto} disabled={!prefactura.productos.length} />
      </React.Fragment>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
                        <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={savePrefactura} />

      </React.Fragment>
    )
  }



  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  }

  const statusBodyTemplate = (rowData) => {
    return <span className={`prefactura-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editPrefactura(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePrefactura(rowData)} />
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
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={savePrefactura} />
    </React.Fragment>
  );
  const deletePrefacturaDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePrefacturaDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deletePrefactura} />
    </React.Fragment>
  );
  const deletePrefacturasDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePrefacturasDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedPrefacturas} />
    </React.Fragment>
  );





  return (
      <>
          
<div class="p-d-flex p-jc-between">
<div class="card w-60">
<div >
    <div class="p-d-flex p-jc-between">
    <button class="p-button p-component p-button-rounded p-button-secondary p-mr-2 p-mb-2" onClick={() => history.goBack()}>
          <span class="pi pi-arrow-circle-left p-c p-button-icon-left"></span>
          <span class="p-button-label p-c">Atrás</span></button>

          <button class="p-button p-component p-button-rounded p-button-success p-mr-2 p-mb-2">
              <span class="pi p-c p-button-icon-left pi-check"></span>
              <span class="p-button-label p-c">Facturar</span>
              </button>
      </div>

      <h1>{props.title}</h1>

      <div class="p-d-flex p-jc-between">
          <div>Razón Social / Nombre y Apellidos: </div>
          <div>Identificació: <span>{id_factura}</span></div>
         

      </div>
      <div>Fecha de emisión: {}</div>
</div>


<div >
        <h2>Resumen de Productos</h2>

        <DataTable ref={dt} value={prefactura.productos} selection={selectedProductos} onSelectionChange={(e) => setSelectedProductos(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} productos"
          globalFilter={globalFilter}
          header={header}>

          {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column> */}
          
          <Column field="producto.codigo" header="CODIGO"  sortable ></Column>
          <Column field="producto.codigoAux" header="CODIGO AUXILIAR" sortable ></Column>
          <Column field="cantidad" header="CANTIDAD" sortable ></Column>
          <Column field="producto.nombre" header="DESCRIPCIÓN" sortable ></Column>
          <Column field="precioUnitario" header="VALOR UNITARIO" sortable  ></Column>
          <Column field="descuento" header="VALOR UNITARIO" sortable  ></Column>
          <Column field="totalConImpuesto" header="PRECIO TOTAL" sortable  ></Column>
        
          {/* <Column body={actionBodyTemplate}></Column> */}
        </DataTable>
    </div>

  </div> 

<div class="card w-40 card-totales" >

    <h2>Totales</h2>
       
    </div>

      
    

</div>

   
   
    </>
  );
}

export default PrefacturaData