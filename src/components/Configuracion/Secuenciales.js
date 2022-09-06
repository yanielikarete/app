import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';

import { EmpresaService } from '../../service/EmpresaService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ServiceApp } from '../../service/ServiceApp';

import './common.css';

const Secuencialess = (props) => {

  let emptySecuenciales = {
    "facturas":{"secuencial":0},
    "notas_de_credito":{"secuencial":0},
    "notas_de_debito":{"secuencial":0},
    "guias_de_remision":{"secuencial":0},
    "retencion":{"secuencial":0},
};
  console.log(props)
  const [secuenciales, setSecuenciales] = useState(emptySecuenciales);
  const [changedsec, setChangedsec] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const secuencialesService = new EmpresaService();
  let serviceApp = ServiceApp.getInstance();
  let documentos = {
    "facturas":{"tipoDoc_id":0,"consecutivo":0},
    "notas_de_credito":{"tipoDoc_id":0,"consecutivo":0},
    "notas_de_debito":{"tipoDoc_id":0,"consecutivo":0},
    "guias_de_remision":{"tipoDoc_id":0,"consecutivo":0},
    "retencion":{"tipoDoc_id":0,"consecutivo":0}
  }

  useEffect(() => {
    serviceApp.getTipoDocumento().then(d=>{
      for(const doc of d){
        documentos[doc.nombre]["tipoDoc_id"]=doc.id
      }
      console.log(documentos,"SUPERDOCS")
      serviceApp.getSecuenciales().then(s=>{
        for(const sec of s){
          documentos[sec.tipo_documento.nombre]["consecutivo"] = sec.consecutivo
        }
        setSecuenciales(documentos)
        console.log(secuenciales);
      })
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps



  const saveSecuenciales = () => {
    for(const changed in changedsec ){
      serviceApp.saveSecuencial(changedsec[changed]);
    }
    setSubmitted(true);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Secuenciales Updated', life: 3000 });
  }



  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _secuenciales = { ...secuenciales };
    let _changedsec = { ...changedsec };
    _secuenciales[`${name}`].consecutivo = val;
    setSecuenciales(_secuenciales)
    _changedsec[`${name}`]=secuenciales[`${name}`];
    setChangedsec(_changedsec)
  }

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
            <div className="summary"><label htmlFor="factura">Facturas<span className="pull-right count">Último en usar: {secuenciales['facturas'].consecutivo} </span></label></div><br/>
            <InputText id="factura" value={secuenciales['facturas'].consecutivo} onChange={(e) => onInputChange(e, 'facturas')} required autoFocus />
          </div>
          <div className="p-field w-40">
          <div className="summary"><label htmlFor="notacredito">Nota de Credito<span className="pull-right count">Último en usar: {secuenciales['notas_de_credito'].consecutivo} </span></label></div><br/>
            <InputText id="notacredito" value={secuenciales['notas_de_credito'].consecutivo} onChange={(e) => onInputChange(e, 'notas_de_credito')} required />
          </div>
          <div className="p-field w-30">
          <div className="summary"><label htmlFor="notadebito">Nota de Debito<span className="pull-right count">Último en usar: {secuenciales['notas_de_debito'].consecutivo} </span></label></div>
            
            <br/>
            <InputText id="notadebito" value={secuenciales['notas_de_debito'].consecutivo} onChange={(e) => onInputChange(e, 'notas_de_debito')} required  />
          </div>

        </div>
        <div className="row">
          <div className="p-field w-50">
          <div className="summary"><label htmlFor="guia">Guia de Remisión <span className="pull-right count">Último en usar: {secuenciales['guias_de_remision'].consecutivo} </span></label></div><br/>
            <InputText id="guia" value={secuenciales['guias_de_remision'].consecutivo} onChange={(e) => onInputChange(e, 'guias_de_remision')} required />
          </div>
          <div className="p-field w-50">
          <div className="summary"><label htmlFor="comprobante">Comprobante de Retención<span className="pull-right count">Último en usar: {secuenciales['retencion'].consecutivo} </span></label></div><br/>
            <InputText id="comprobante" value={secuenciales['retencion'].consecutivo} onChange={(e) => onInputChange(e, 'retencion')} required />
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
