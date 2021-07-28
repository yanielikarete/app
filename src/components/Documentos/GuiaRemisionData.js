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

const GuiaRemisionData = (props) => {
    // let { id_producto }= useParams()
    const history = useHistory();
    const toast = useRef(null);
    const crearRemision = false;
    const [producto, setProducto] = useState(emptyProducto);
    const [detallesProd, setDetallesProd] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
    const [tipoIdOptions, setTipoIdOptions] = useState(null);
    // const [loading, setLoading] = useState(true);
    let emptyProducto =  {
        id: null,
        nombre: "",
        codigo: "",
        codigoAux: "",
        tarifaIvaId: "",
        tipoProductoId: "",
        valorUnitario: 0
      };
    let serviceApp = ServiceApp.getInstance();

    useEffect(() => {
        // serviceApp.getProductoById(id_producto).then(data=> setProducto(data))
        serviceApp.getTiposIdentificacion().then(data => setTipoIdOptions(data));
      }, []); 

    const rightToolbarTemplate  = () => {
        return (
          <React.Fragment>
           
            <Button label={"BUSCAR TRANSPORTISTA" } icon="pi pi-search" className="p-button-success "  />
            
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
            <label>INFORMACIÓN DEL TRANSPORTISTA Y TRASLADO</label>
          </React.Fragment>
        )
      }

      const leftToolbarTemplateDestinatario = () => {
        return (
          <React.Fragment>
            <label>DATOS DEL DETISNATARIO</label>
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
    const actionTemplate = () => <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>;
    return (
        <>
        <h1>{props.title}</h1>   
        <Toast ref={toast} />
        <div className="p-col-12 w-100">

        <TabView>
                        <TabPanel header={'Crear Guia de Remisión'} className="tabDetalleProducto" >


     
    <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <div class="p-grid p-align-stretch vertical-container p-mb-4">
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Tipo de indentificación</span>
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
                        <span>Id. Transportista</span>
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

            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Razón Social (Transportista)</span>
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
        </div>

        <div class="p-grid p-align-stretch vertical-container p-mb-4">
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Fecha Inicio - Fin de Transporte</span>
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
                        <span>Placa</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                                
                            <InputText id="placa"  disable onChange={(e) => onInputChange(e, 'id_transportista')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                                {/* {submitted && !cliente.telefono && <small className="p-error">Telefono es requerido</small>} */}
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Email Transportista <b>* campo no obligatorio</b> </span>
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

        <div class="p-grid p-align-stretch vertical-container p-mb-4">
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Dirección de Partida</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                            <InputText id="direccion-partida"  disable onChange={(e) => onInputChange(e, 'id_transportista')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div class="p-col"></div>
            <div class="p-col"></div>
        </div>
   
    </div>


    <div className= "card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplateDestinatario} right={rightToolbarTemplateDestinatario}></Toolbar>
        <div class="p-grid p-align-stretch vertical-container p-mb-4">
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Tipo de indentificación</span>
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
                        <span>Id. Destinatario</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                                
                            <InputText id="id_destinatario"  onChange={(e) => onInputChange(e, 'id_destinatario')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                                {/* {submitted && !cliente.telefono && <small className="p-error">Telefono es requerido</small>} */}
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Razón Social (Destinatario)</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                            <InputText id="razon_social_destinatario"  onChange={(e) => onInputChange(e, 'razon_social_destinatario')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
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
                        <span>Cód. Establecimiento Destino</span>
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
                        <span>Documento Aduanero</span>
                    </legend>
                    <div id="pr_id_51_content" class="p-toggleable-content" role="region" aria-labelledby="pr_id_51_header">
                        <div class="p-fieldset-content">
                            <div className="p-field w-100">
                                
                                
                            <InputText id="placa"  disable onChange={(e) => onInputChange(e, 'id_transportista')} required autoFocus /*className={classNames({ 'p-invalid': submitted && !cliente.telefono })}*/ />
                                {/* {submitted && !cliente.telefono && <small className="p-error">Telefono es requerido</small>} */}
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>

            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Dirección Destino </span>
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

        <div class="p-grid p-align-stretch vertical-container p-mb-4">
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Tipo de Documento</span>
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
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Nro. de Autorizacion</span>
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
   
        <div class="p-grid p-align-stretch vertical-container p-mb-4">
           
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Motivo de Traslado </span>
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
            <div class="p-col">
                <fieldset class=" p-component p-fieldset-toggleable">
                    <legend class="p-fieldset-legend p-unselectable-text">
                        <span>Ruta de Traslado</span>
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
   

    <Button label= {'Facturar'} icon="pi pi-check" className="p-button-secondary w-15" />
                        </TabPanel>
                        <TabPanel header="Historial Guias de Remisión" className="tabDetalleProducto" >
                           
                        </TabPanel>
                       
                    </TabView>


                    
        </div>



        </> 
    )
}
export default GuiaRemisionData