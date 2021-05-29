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

import './common.css';

const ProductosData = (props) => {

  let emptyProducto =  {
    id: null,
    nombre: "",
    codigo: "",
    codigo_aux: "",
    codigo_aux: "",
    porcentaje_iva: "",
    tipo_producto: "",
    valor_unitario: 0
  };
  console.log(props)
  const [productos, setProductos] = useState(null);
  const [productoDialog, setProductoDialog] = useState(false);
  const [deleteProductoDialog, setDeleteProductoDialog] = useState(false);
  const [deleteProductosDialog, setDeleteProductosDialog] = useState(false);
  const [producto, setProducto] = useState(emptyProducto);
  const [selectedProductos, setSelectedProductos] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const productoService = new ProductoService();
  const tipoProductoOptions = ['BIEN','MAL','REGULAR'];
  const porcentajeIvaOptions = ['OTROS','10-20','20-40']

  useEffect(() => {
    productoService.getProductos().then(data => setProductos(data));
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
    setProducto(emptyProducto);
    setSubmitted(false);
    setProductoDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setProductoDialog(false);
  }

  const hideDeleteProductoDialog = () => {
    setDeleteProductoDialog(false);
  }

  const hideDeleteProductosDialog = () => {
    setDeleteProductosDialog(false);
  }

  const saveProducto = () => {
    setSubmitted(true);

    if (producto.codigo.trim()) {
      let _productos = [...productos];
      let _producto = { ...producto };
      if (producto.id) {
        const index = findIndexById(producto.id);

        _productos[index] = _producto;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Producto Updated', life: 3000 });
      }
      else {
        _producto.id = createId();
        _producto.image = 'producto-placeholder.svg';
        _productos.push(_producto);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Producto Created', life: 3000 });
      }

      setProductos(_productos);
      setProductoDialog(false);
      setProducto(emptyProducto);
    }
  }

  const editProducto = (producto) => {
    setProducto({ ...producto });
    setProductoDialog(true);
  }

  const confirmDeleteProducto = (producto) => {
    setProducto(producto);
    setDeleteProductoDialog(true);
  }

  const deleteProducto = () => {
    let _productos = productos.filter(val => val.id !== producto.id);
    setProducto(_productos);
    setDeleteProductoDialog(false);
    setProducto(emptyProducto);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Producto Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id === id) {
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
    setDeleteProductosDialog(true);
  }

  const deleteSelectedProductos = () => {
    let _productos = productos.filter(val => !selectedProductos.includes(val));
    setProductos(_productos);
    setDeleteProductosDialog(false);
    setSelectedProductos(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Productos Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _producto = { ...producto };
    _producto['category'] = e.value;
    setProducto(_producto);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _producto = { ...producto };
    _producto[`${name}`] = val;

    setProducto(_producto);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _producto = { ...producto };
    _producto[`${name}`] = val;

    setProducto(_producto);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProductos || !selectedProductos.length} />
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
    return <span className={`producto-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProducto(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProducto(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">{props.header}</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
    </div>
  );
  const productoDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProducto} />
    </React.Fragment>
  );
  const deleteProductoDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductoDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProducto} />
    </React.Fragment>
  );
  const deleteProductosDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductosDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProductos} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={productos} selection={selectedProductos} onSelectionChange={(e) => setSelectedProductos(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} productos"
          globalFilter={globalFilter}
          header={header}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="nombre" header="NOMBRE" sortable ></Column>
          <Column field="codigo" header="CODIGO"  sortable ></Column>
          <Column field="codigo_aux" header="CODIGO AUXILIAR" sortable ></Column>
          <Column field="valor_unitario" header="VALOR UNITARIO" sortable  ></Column>
        
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={productoDialog} style={{ width: '450px' }} header="Detalles del Producto" modal className="p-fluid" footer={productoDialogFooter} onHide={hideDialog}>
        {producto.image && <img src={`showcase/demo/images/producto/${producto.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={producto.image} className="producto-image" />}
        <div className="p-field w-100">
          <label htmlFor="nombre">Nombre del producto</label>
          <InputText id="nombre" value={producto.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={classNames({ 'p-invalid': submitted && !producto.nombre })} />
          {submitted && !producto.nombre && <small className="p-error">Nombre del producto requerido</small>}
        </div>
        <div className="p-field w-50">
          <label htmlFor="codigo">Código</label>
          <InputText id="codigo" value={producto.codigo} onChange={(e) => onInputChange(e, 'codigo')} required className={classNames({ 'p-invalid': submitted && !producto.codigo })} />
          {submitted && !producto.codigo && <small className="p-error">Código es requerido</small>}
        </div>
        <div className="p-field w-50">
          <label htmlFor="codigo_aux">Código Auxiliar</label>
          <InputText id="codigo_aux" value={producto.codigo_aux} onChange={(e) => onInputChange(e, 'codigo_aux')} />
        </div>
       

        <div className="p-field w-100">
          <label htmlFor="valor_unitario w-50">Valor Unitario</label><br/>
          <InputText id="valor_unitario" value={producto.valor_unitario}   onChange={(e) => onInputChange(e,'valor_unitario')} />
        </div>
        <div className="p-field w-50">
          <label htmlFor="tipo_producto w-50">Tipo de Producto</label><br/>
          <Dropdown id="tipo_producto" value={producto.tipo_producto}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'tipo_producto')} options={tipoProductoOptions}/>
        </div>
        
        <div className="p-field w-50">
          <label htmlFor="porcentaje_iva">Porcentaje IVA</label><br/>
          <Dropdown id="porcentaje_iva" value={producto.porcentaje_iva}   itemTemplate={itemTemplate}  onChange={(e) => onInputChange(e,'porcentaje_iva')} options={porcentajeIvaOptions}/>
        </div>
        
        
      </Dialog>

      <Dialog visible={deleteProductoDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductoDialogFooter} onHide={hideDeleteProductoDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {producto && <span>Esta seguro que desea eliminar <b>{producto.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteProductosDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductosDialogFooter} onHide={hideDeleteProductosDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {producto && <span>Esta seguro que desea eliminar este producto?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default ProductosData