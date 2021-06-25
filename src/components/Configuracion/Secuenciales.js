import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { EmpresaService } from '../../service/EmpresaService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import './common.css';

const Secuencialess = (props) => {

  let emptySecuenciales = {
    factura:"afc182",
    notacredito:"afc182",
    notadebito:"afc182",
    guia:"afc182",
    comprobante:"afc182"
    
};
  console.log(props)
  const [secuenciales, setSecuenciales] = useState(emptySecuenciales);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const secuencialesService = new EmpresaService();

  useEffect(() => {
    secuencialesService.getSecuenciales().then(data => {
        console.log(data)
      setSecuenciales(data);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  const saveSecuenciales = () => {
    setSubmitted(true);


        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Secuenciales Updated', life: 3000 });
     
      setSecuenciales(emptySecuenciales);
  
  }



  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _secuenciales = { ...secuenciales };
    _secuenciales[`${name}`] = val;

    setSecuenciales(_secuenciales);
  }

 


 console.log("EMPRESA",secuenciales)
  return (
      <>
      <h1>Configuración  de secuenciales</h1>

    <div className="">
      <Toast ref={toast} />
      <div className="card">
        
        <div className="row">
          <div className="bg-blue text-white w-100 p-10 p-field">
            <p> Nota: Usted puede editar cada uno de los secuenciales de los distintos comprobantes dejando en blanco
            el resto de los campos y solo completando el que requiere modificar. Ej: Para modificar el secuencial de facturas, elimine el contenido de los demás tipos de documentos, en este caso solo se alteraría el secuencial de las facturas...
            Importante: El nuevo secuencial siempre debe ser superior al anterior de lo contrario no tendra efecto la configuración
            </p>
          </div>
        </div>
        <div className="row">
          <div className="p-field w-30">
            <div className="summary"><label htmlFor="factura">Facturas<span className="pull-right count">Último en usar: 28 </span></label></div><br/>
            <InputText id="factura" value={secuenciales.factura} onChange={(e) => onInputChange(e, 'factura')} required autoFocus className={classNames({ 'p-invalid': submitted && !secuenciales.factura })} />
            {submitted && !secuenciales.factura && <small className="p-error">Facturas.</small>}
          </div>
          <div className="p-field w-40">
          <div className="summary"><label htmlFor="notacredito">Nota de Credito<span className="pull-right count">Último en usar: 10 </span></label></div><br/>
            <InputText id="notacredito" value={secuenciales.notacredito} onChange={(e) => onInputChange(e, 'notacredito')} required />
          </div>
          <div className="p-field w-30">
          <div className="summary"><label htmlFor="notadebito">Nota de Debito<span className="pull-right count">Último en usar: 20 </span></label></div>
            
            <br/>
            <InputText id="notadebito" value={secuenciales.notadebito} onChange={(e) => onInputChange(e, 'notadebito')} required  className={classNames({ 'p-invalid': submitted && !secuenciales.notaDebito })} />
            {submitted && !secuenciales.name && <small className="p-error">Nombre es requerido.</small>}
          </div>

        </div>
        <div className="row">
          <div className="p-field w-50">
          <div className="summary"><label htmlFor="guia">Guia de Remisión <span className="pull-right count">Último en usar: 28 </span></label></div><br/>
            <InputText id="guia" value={secuenciales.guia} onChange={(e) => onInputChange(e, 'guia')} required />
          </div>
          <div className="p-field w-50">
          <div className="summary"><label htmlFor="comprobante">Comprobante de Retención<span className="pull-right count">Último en usar: 28 </span></label></div><br/>
            <InputText id="comprobante" value={secuenciales.comprobante} onChange={(e) => onInputChange(e, 'comprobante')} required />
          </div>
        </div>

      

        <React.Fragment>
          <Button label="Guardar" icon="pi pi-check" className="p-button" onClick={saveSecuenciales} />
        </React.Fragment>
      </div>
    </div>
    </>
  );
}

export default Secuencialess
