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

const ProductosDetailData = (props) => {
    let { id_producto }= useParams()
    const history = useHistory();
    const toast = useRef(null);
    const [producto, setProducto] = useState(null);
    const [detallesProd, setDetallesProd] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(false);
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
        serviceApp.getProductoById(id_producto).then(data=> setProducto(data));
        serviceApp.getHistorialProducto(id_producto).then(data=> setDetallesProd(data));
      }, []); 

    const rightToolbarTemplate  = () => {
        return (
          <React.Fragment>
            <Button label={"Atras" } icon="pi pi-arrow-left" className="p-button-secondary p-mr-2" onClick={goBack} />
            <Button label={"Agregar" } icon="pi pi-plus" className="p-button-success p-mr-2"  />
            <Button label={"Eliminar" } icon="pi pi-minus" className="p-button-danger"   />
          </React.Fragment>
        )
      }

      const goBack = () => {
        history.goBack()
      }

      const leftToolbarTemplate = () => {
        return (
          <React.Fragment>
            <label>Detalles del Producto</label>
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

    const operacionBodyTemplate = (data) => {

        if (data){
            return (
                <>
    
                { data.incremente ? '[INC]' : '[DEC]'}
    
                </>
            );
        }
        
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

    const activityBody = (data) => {
        return (
            <>
                <span className="p-column-title">Activity</span>
                <ProgressBar value={data.activity} showValue={false} />
            </>
        )
    };

    const actionTemplate = () => <Button type="button" icon="pi pi-cog" className="p-button-secondary"></Button>;
    return (
        <>
        <h1>{props.title}</h1>   
        <Toast ref={toast} />
        <div className="p-col-12 card w-100">

        <TabView>
                        <TabPanel header="Listado de Productos" >

    <div className="datatable-crud-demo">
     
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
</div>
<div className= "card">
    <DataTable value={producto}>

          
          <Column field="nombre" header="NOMBRE"  ></Column>
          <Column field="codigo" header="CODIGO"   ></Column>
          <Column field="codigoAux" header="CODIGO AUXILIAR"  ></Column>
          <Column field="valor_unitario" header="VALOR UNITARIO"   ></Column>
          <Column field="valor_unitario" header="CANT. EXISTENTE (ALMACÉN)"   ></Column>
        
        </DataTable>
      </div>

      <div className="card">
                    
                    
                    <DataTable value={detallesProd} paginator className="p-datatable-customers" 
                        rows={10} dataKey="id" rowHover 
                        globalFilter={globalFilter} 
                        emptyMessage="Producto sin historial." 
                        loading={loading} 
                        header={detallesHeader}>
                       
                        <Column field="id" header="NO." sortable ></Column>
                        <Column field="incremente" header="Operación" sortable body={ operacionBodyTemplate}></Column>
                        <Column field="razon" header="Razón" sortable></Column>
                        <Column field="cantidad" header="Cantidad" sortable></Column>
                        <Column field="cantidadExistente" header="Cantidad (Antes de modificar)" sortable ></Column>
                        <Column field="createdAt.date" header="Fecha" sortable ></Column>
                       
                        {/* <Column headerStyle={{ width: '8rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible', justifyContent: 'center' }} body={actionTemplate}></Column> */}
                    </DataTable>
                </div>
    </div>

                        </TabPanel>
                        <TabPanel header="Reporte de Productos" className="tabDetalleProducto" >
                           
                        </TabPanel>
                       
                    </TabView>

        </div>


        </> 
    )
}
export default ProductosDetailData