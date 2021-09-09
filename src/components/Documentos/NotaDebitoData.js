import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductoService } from '../../service/ProductoService';
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
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import './common.css';
import {useParams} from 'react-router';
import {useHistory} from 'react-router-dom';
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from 'react';

const NotaDebitoData = (props) => {
    // let { id_producto }= useParams()
    let emptyPago = {
        forma:"",
        plazo:0,
        unidad_plazo:"",
        propina:0
      }
      let emptyCliente = {
          identificacion_id:"",
        forma:"",
        plazo:0,
        unidad_plazo:"",
        propina:0
      }

      let emptyProducto =  {
        id: null,
        nombre: "",
        codigo: "",
        codigoAux: "",
        tarifaIvaId: "",
        tipoProductoId: "",
        valorUnitario: 0
      };

      let emptyDetalle = {
        id: null,
        razon: "",
        valor: 0,
        impuesto_id: "",
        codigo_porcentaje: "" 
      }

      let emptyNotaDebito ={
          cliente: null,
          comprobante: null,
          pagos: null,
          detalles : []

      }

    const history = useHistory();
    const toast = useRef(null);
    const crearRemision = false;
    const [producto, setProducto] = useState(emptyProducto);
    const [detallesProd, setDetallesProd] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [tipoIdOptions, setTipoIdOptions] = useState(null);
    const [radioValue, setRadioValue] = useState(null);
    const [pago,setPago ]=useState(emptyPago);
    const [cliente,setCliente ]=useState(emptyCliente);
    const [documentId,setDocumentId ]=useState(null);
    const [dropdownFormas, setDropdownFormas] = useState(null);
    const [dropdownUnidadPlazo, setDropdownUnidadPlazo] = useState(null);
    const [dropdownTarifaIva,setDropdownTarifaIva] = useState(null);
    const [detalle, setDetalle]= useState(emptyDetalle);
    const [notaDebito, setNotaDebito]= useState(emptyNotaDebito);
    
    // const [loading, setLoading] = useState(true);
    
    let serviceApp = ServiceApp.getInstance();

    useEffect(() => {
        // serviceApp.getProductoById(id_producto).then(data=> setProducto(data))
        serviceApp.getTiposIdentificacion().then(data => setTipoIdOptions(data));
        serviceApp.getTarifaIvas().then(data => setDropdownTarifaIva(data));
        serviceApp.getFormaPagos().then(data => setDropdownFormas(data));
        serviceApp.getUnidadTiempos().then(data => setDropdownUnidadPlazo(data));
        serviceApp.getTipoDocumento().then(d=>{
            for(const doc of d){
                if(doc.nombre=="facturas"){
                setDocumentId(doc.id)
                }
            }
        });
      }, []); 

    const rightToolbarTemplate  = () => {
        return (
          <React.Fragment>
           
            <Button label={"BUSCAR CLIENTE" } icon="pi pi-search" className="p-button-success "  />
            
          </React.Fragment>
        )
      }
      const rightToolbarTemplateDestinatario  = () => {
        return (
          <React.Fragment>
           
            <Button label={"BUSCAR DESTINATARIO" } icon="pi pi-search" className="p-button-success "  />
            
          </React.Fragment>
        )
      }
      const goBack = () => {
        history.goBack()
      }

      const leftToolbarTemplate = () => {
        return (
          <React.Fragment>
            <label>DATOS DEL CLIENTE</label>
          </React.Fragment>
        )
      }

      const leftToolbarTemplateDestinatario = () => {
        return (
          <React.Fragment>
            <label>COMPROBANTE DE VENTA QUE SE MODIFICA</label>
          </React.Fragment>
        )
      }

      const leftToolbarTemplatePagos = () => {
        return (
          <React.Fragment>
            <label>PAGOS</label>
          </React.Fragment>
        )
      }

      const leftToolbarTemplateDetalles = () => {
        return (
          <React.Fragment>
            <label>DETALLES DE LA NOTA DE DÉBITO</label>
          </React.Fragment>
        )
      }

      const detallesHeader = (
        <div className="table-header">
            HISTORIAL
            
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Global Search" />
            </span>
        </div>
    );

    const bodyTemplate = (data, props) => {
        return (
            <>
                <span className="p-column-title">{props.header}</span>
                {data[props.field]}
            </>
        );
    };

    const countryBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Country</span>
                <img src="assets/demo/images/flags/flag_placeholder.png" alt={data.country.name} className={`flag flag-${data.country.code}`} width={30} height={20} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.country.name}</span>
            </>
        );
    };

    const representativeBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Representative</span>
                <img alt={data.representative.name} src={`assets/demo/images/avatar/${data.representative.image}`} width="32" style={{ verticalAlign: 'middle' }} />
                <span style={{ marginLeft: '.5em', verticalAlign: 'middle' }} className="image-text">{data.representative.name}</span>
            </>
        );
    };

    const statusBodyTemplate = (data) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <span className={`customer-badge status-${data.status}`}>{data.status}</span>
            </>
        )
    };

    const onInputPagoChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _pago = { ...pago };
        _pago[`${name}`] = val;
        setPago(_pago);
      }

      const onInputClienteChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _cliente = { ...cliente };
        _cliente[`${name}`] = val;
        setCliente(_cliente);
      }

    const setCrearRemision = (e, valor) => {
        crearRemision = valor;
    }

    const activityBody = (data) => {
        return (
            <>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={data.activity} showValue={false} />
            </>
        )
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
      }

      const headerTabGuiaRemision = () => {
        return (
            <React.Fragment>
              <Button label= {'Crear Guia de Remisión'} icon="pi pi-check" className="p-button-secondary w-15" onClick = {setCrearRemision} />
            </React.Fragment>
          )
      }

      const leftToolbarTemplateDetallesActions = () => {
        return (
          <React.Fragment>
            <Button label="Agregar" icon="pi pi-plus" className="p-button-secondary p-mr-2" onClick={addDetalle} />
            <Button label="Eliminar" icon="pi pi-trash" className="p-button-danger" onClick={removeDetalle} disabled={!notaDebito.detalles.length} />
          </React.Fragment>
        )
      }

      const addDetalle= () =>{
        let _notaDebito = { ...notaDebito };
        _notaDebito.detalles.push(emptyDetalle);
        setNotaDebito(_notaDebito); 

    
      }

      const removeDetalle = () =>{
        let _notaDebito = { ...notaDebito };
        _notaDebito.detalles.pop();
        setNotaDebito(_notaDebito);
      }

      const onInputDetalleChange = (e, name,i) => {
        const val = (e.target && e.target.value) || '';
         let _notaDebito = { ...notaDebito };
         _notaDebito['detalles'][i][`${name}`] = val;
         setNotaDebito(_notaDebito);
        
    }
    const actionTemplate = () => <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>;
    return (
        <>
        <h1>{props.title}</h1>   
        <Toast ref={toast} />
        <div className="p-col-12 w-100">

        <TabView>
                        <TabPanel header={'Crear nota de débito'}  className="tabDetalleProducto" >


     
                        <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <div class="p-grid p-align-stretch vertical-container p-mb-4">
        <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Tipo de Comprador</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                        
                           <div className="p-field-radiobutton">
                                <RadioButton inputId="option1" name="option" value="Chicago" checked={radioValue === 'Chicago'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option1">Consumidor Final</label>
                            
                            </div> 
                            
                            <div className="p-field-radiobutton">
                                <RadioButton inputId="option2" name="option" value="Los Angeles" checked={radioValue === 'Los Angeles'} onChange={(e) => setRadioValue(e.value)} />
                                <label htmlFor="option2">Datos</label>
                                
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Tipo de ID Comprador</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                                <Dropdown id="identificacion_id"  onChange={(e) => onInputChange(e,'identificacion_id')} options={tipoIdOptions} optionLabel="nombre" optionValue="id"/>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Id. Comprador</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                                
                            <InputText id="id_transportista"  onChange={(e) => onInputChange(e, 'id_transportista')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                                {/* {submitted && !cliente.telefono && <small className="p-error">Telefono es requerido</small>} */}
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            
             </div>

        <div class="p-grid p-align-stretch vertical-container p-mb-4">

            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Razón Social (Comprador)</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                            <InputText id="razon_social"  onChange={(e) => onInputChange(e, 'id_transportista')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
      
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Dirección Comprador</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                            <InputText id="rango-fecha"  disable onChange={(e) => onInputChange(e, 'id_transportista')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            
           

<div class="p-col">
    <fieldset class=" p-component p-fieldset-toggleable">
        <legend class="p-fieldset-legend p-unselectable-text">
            <span>Email Comprador <b>* campo no obligatorio</b> </span>
        </legend>
        <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
            <div class="p-fieldset-content">
                <div className="p-field w-100">
                    
                <InputText id="email-transportista"  onChange={(e) => onInputChange(e, 'id_transportista')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                </div>
            </div>
        </div>
    </fieldset>
</div>

            
       
        </div>
   
    </div>


    <div className= "card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplateDestinatario}></Toolbar>
      
        <div class="p-grid p-align-stretch vertical-container p-mb-4">
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Tipo de Documento</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                            <Dropdown id="identificacion_id" value={cliente.identificacion_id} onChange={(e) => onInputChange(e,'identificacion_id')} options={tipoIdOptions} optionLabel="nombre" optionValue="id"/>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Nro. Comprobante </span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100 flex">
                                
                            <InputText id="email-transportista"  onChange={(e) => onInputChange(e, 'id_transportista')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                            <Button icon="pi pi-search" className="p-button-success w-30"  />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
   
        
    </div>
    <div className= "card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplatePagos}></Toolbar>
      
        <div class="p-grid p-align-stretch vertical-container p-mb-4">
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Forma de pago</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                            <Dropdown value={pago.formapago_id} onChange={(e) => onInputPagoChange(e,'formapago_id')} options={dropdownFormas}  placeholder="Seleccione forma de pago" optionLabel="nombre" optionValue="id"/>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Plazo </span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100 flex">
                                
                            <InputText id="plazo" value={pago.plazo} onChange={(e) => onInputPagoChange(e, 'plazo')} required  />
                            
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Unidad de tiempo</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                            <Dropdown value={pago.unidadtiempo_id} onChange={(e) => onInputPagoChange(e,'unidadtiempo_id')} options={dropdownUnidadPlazo}  placeholder="Seleccione forma de pago"  optionLabel="nombre" optionValue="id"/>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
   
        
    </div>


    <div className= "card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplateDetalles}></Toolbar>
        { notaDebito.detalles.map(function(detalle,i){
            return ( 

        <div class="p-grid p-align-stretch vertical-container p-mb-4">
            
            <div class="p-col ">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span><i className="pi pi-minus" style={{color: '#ff0000'}}></i>{" Detalle " + (i+1)}</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                        <div className="p-field w-30">
                                <label htmlFor="razon">Razón de la modificación</label><br/>
                                <InputText id="razon" value={detalle.razon} onChange={(e) => onInputDetalleChange(e, 'razon')} required  />
                                </div>
                            <div className="p-field w-30">
                            <label htmlFor="valor">Valor de la modificación</label><br/>
                            <InputText id="valor" value={detalle.valor} onChange={(e) => onInputDetalleChange(e, 'valor')} required  />
                            </div>
                            <div className="p-field w-20">
                            <label htmlFor="impuesto_id">Tipo de impuesto</label><br/>
                            <Dropdown value={detalle.impuesto_id} onChange={(e) => onInputDetalleChange(e,'impuesto_id',i)} options={dropdownTarifaIva}  placeholder="IVA (default)"   optionLabel="nombre" optionValue="id"/>
                            </div>
                            <div className="p-field w-20">
                            <label htmlFor="codigo_porcentaje">Códigp de porcentaje</label><br/>
                            <Dropdown value={detalle.codigo_porcentaje} onChange={(e) => onInputDetalleChange(e,'codigo_porcentaje',i)} options={dropdownTarifaIva}  placeholder="14% (default)"   optionLabel="nombre" optionValue="id"/>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
           
        </div>
    )
          })}
                <Toolbar left={leftToolbarTemplateDetallesActions}></Toolbar>  
        
    </div>


    <Button label= {'Totales'} icon="pi pi-eye" className="p-button-primary p-mr-2" />
    <Button label= {'Pre-Factura'} icon="pi pi-check" className="p-button-success " />
                        </TabPanel>
                        <TabPanel header="Historial notas de débito" className="tabDetalleProducto" >
                           
                        </TabPanel>
                       
                    </TabView>


                    
        </div>



        </> 
    )
}
export default NotaDebitoData