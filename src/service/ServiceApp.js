import axios from 'axios';
import { instances } from 'chart.js';
/*-------------------config-------------------*/
// const BASE_URL = 'http://localhost/';
const BASE_URL = 'http://sgde.perfect-solutions.com.ec/';
// const BASE_URL = 'http://sgde.com/';
const API = axios.create({
    baseURL: BASE_URL,
    validateStatus:(status)=>{
        console.log("VALIDATING STATUS",status);
        if(status === 401){
          ServiceApp.getInstance.logout()
        }
        return status;
    }
})
const headers = {
  // 'Content-Type': 'text/html'
};


/*-------------------config-------------------*/
/*-------------------Endpoints-------------------*/
/*Auntenticaciopn*/

const AUTH_ENDPOINTS = {
    // LOGIN:"login_check",
    LOGIN:"api/login_check",
    REGISTER:"register",
    CURRENT_USER : "api/current_user", 
    SET_EMP_USER :"api/v1/usuarios/"
}
const PUNTOS_EMISION = "api/v1/puntosemision";
 
const ESTABLECIMIENTOS = "api/v1/establecimientos";

const EMPRESA = "api/v1/empresas";

const PRODUCTOS = "api/v1/productos";

const FIRMA_DIGITAL = "api/v1/firmasdigital";

const UPLOAD_FILE = "api/v1/uploadfile";

const USUARIOS =  "api/v1/usuarios";

const CLIENTES = {
  // LOGIN:"login_check",
  LISTA:"api/v1/clientes",
  ALL_TIPOS:"api/v1/tipoclientes",
  ADD:"api/v1/clientes"
}

const TRANSPORTISTA = "api/v1/transportistas";
const FACTURA = "api/v1/facturas";
const TIPO_EMISION = "api/v1/tipoEmisiones";
const TIPO_AMBIENTE = "api/v1/tipoAmbientes";
const TIPO_DOCUMENTO = "api/v1/tipodocumentos";
const TIPO_IDENTIFIACION = "api/v1/tipoIdentificacion";
const CLASE_CONTRIBUYENTES = "api/v1/claseContribuyentes";
const TIPO_PRODUCTOS = "api/v1/tipoproductos";
const HISTORIAL_PRODUCTO = "api/v1/historialprod";
const TARIFA_IVA = "api/v1/tarifaiva";
const FORMA_PAGOS = "api/v1/formapagos";
const UNIDAD_TIEMPOS = "api/v1/unidadtiempos";
const SECUENCIALES_EMPRESA = "api/v1/secuenciales/empresa";
const SECUENCIALES = "api/v1/secuenciales";
/*-------------------Tokens-------------------*/

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken
}


/*-------------------Endpoints-------------------*/


export class ServiceApp
{
  static appInstance = null;
  _token = "";

//   API = axios.create({
//     baseURL: BASE_URL
// })

  /**
     * @returns {ServiceApp}
     */
  static getInstance(){
    if (ServiceApp.appInstance == null) {
      
      ServiceApp.appInstance = new ServiceApp();
      let token = getToken();
      API.defaults.headers.common.Authorization = "Bearer " + token;
      API.Authorization = token

  }
 

  return this.appInstance;
  }

  /* *********************Autenticacion****************************** */
    userLogin(username, password){
        
        return API.post(AUTH_ENDPOINTS.LOGIN, {'username': username,'password':password}, {headers})
        .then(res=>{
          console.log('respuesta de api', res)
          if (res.status === 200) {
            
            const token = res.data.token
            API.defaults.headers.common.Authorization = "Bearer " + token;
            API.Authorization = token
            console.log("entro a guardar token", API.defaults.headers.common.Authorization);
            return this.getCurrentUser().then(a=>{
                return token
            })
            

          }else{
            console.log(res);
            alert('Error autenticando');
          }
        }
        ).catch(function (error) {
          console.log(error);
          return "error al login";
        });
      }

     getCurrentUser(){
      return API.get(AUTH_ENDPOINTS.CURRENT_USER).then(
        res=>{
            console.log("respuesta de la api susseful CURRENT USER",res.data)
            sessionStorage.setItem('USER', JSON.stringify(res.data));
        }
      ).catch(function (error) {
       this.logout()
        if (error.response) {
          // Request made and server responded
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        };
     })}

     setEmpresaUser(userId, empresa){
      return API.patch(AUTH_ENDPOINTS.SET_EMP_USER + userId, empresa).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful set empresa user",res.data)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
     }
    /* *********************Establecimientos****************************** */
    getAllEstablecimientos(){
      return API.get(ESTABLECIMIENTOS).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful establecimientos",res.data)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    saveEstablecimiento(establecimiento){
      
      return API.post(ESTABLECIMIENTOS, establecimiento)
      .then(res=>{
        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    updateEstablecimiento(establecimiento,id){
      console.log("updating establecimiento", establecimiento)
      return API.put(ESTABLECIMIENTOS+"/"+id, establecimiento)
      .then(res=>{
        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }
/* *********************Puntos de Emision****************************** */
    savePuntoEmision(puntoEmision){
      
      return API.post(PUNTOS_EMISION, puntoEmision)
      .then(res=>{
        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    updatePuntoEmision(puntoEmision,id){
      console.log("updating punto emision", puntoEmision)
      return API.put(PUNTOS_EMISION+"/"+id, puntoEmision)
      .then(res=>{
        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    
    getAllPuntosEmision(){
      return API.get(PUNTOS_EMISION).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful bponstos de esmision",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    deletePuntoEmision(id){
      return API.delete(PUNTOS_EMISION+"/"+id).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful bponstos de esmision",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }
   
    /* *********************Productos****************************** */

    saveProducto(producto){
      
      return API.post(PRODUCTOS, producto)
      .then(res=>{
        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    updateProducto(producto,id){
      console.log("updating punto emision", producto)
      return API.put(PRODUCTOS+"/"+id, producto)
      .then(res=>{
        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    
    getAllProductos(){
      return API.get(PRODUCTOS).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful bponstos de esmision",res.data)
          
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    deleteProductoById(id){
      return API.delete(PRODUCTOS+"/"+id).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful bponstos de esmision",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }

    getProductoById(id){
      return API.get(PRODUCTOS+"/"+id).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful producto por id",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }

    deleteProductoByName(name){
      return API.delete(PRODUCTOS+"/"+name).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful bponstos de esmision",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }

    getHistorialProducto(id){

      return API.get(HISTORIAL_PRODUCTO+"/"+id).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful historial producto por id",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );

    }

     /* *********************EMPRESA****************************** */

     saveEmpresa(empresa){
      
      return API.post(EMPRESA, empresa)
      .then(res=>{

        if (res.status === 200) {
          
          return res.data;

        }else{
          console.log(res);
          return res.data;
        }
      }
      );
    }
    updateEmpresa(empresa){
      console.log("updating empresa", empresa)
      return API.put(EMPRESA+"/"+empresa.id, empresa)
      .then(res=>{
        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    /* *********************Firma Digital****************************** */

    saveFirma(firma){
      
      return API.post(FIRMA_DIGITAL, firma)
      .then(res=>{

        if (res.status === 200) {
          console.log("POR ALLA",res);

          return res;

        }else{
          console.log("POR AQUI",res);
          return res;
        }
      }
      );
    }
    getUser(){
      const tokenString = sessionStorage.getItem('USER');
      const userObj = JSON.parse(tokenString);
      if(userObj==null){
          this.logout();
      }
      return userObj.user;
    }
    getEmpresaId(){
      const tokenString = sessionStorage.getItem('USER');
      const userObj = JSON.parse(tokenString);
      if(userObj==null){
          this.logout();
      }
      return userObj.user.empresa.id;
    }
    logout(){
      // sessionStorage.removeItem('token')
          // document.location = "/";
    }
    /* *********************Secuencciales****************************** */
    getSecuenciales(){
      return API.get(SECUENCIALES_EMPRESA+"/"+this.getEmpresaId()).then(
        res=>{
          console.log("LOADING SECUENCIALES",res);
          return res.data;
        });
    }
    saveSecuencial(cliente){
      cliente["empresa_id"]=this.getEmpresaId()
      cliente["codigo"]="TEST"//@TODO EL CODIGO QUE ES
      return API.post(SECUENCIALES, cliente)
      .then(res=>{
        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }
  
    

     /* *********************Clientes****************************** */

     addCliente(cliente){
      
      return API.post(CLIENTES.ADD, cliente)
      .then(res=>{

        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    getAllClientes(){
      return API.get(CLIENTES.LISTA).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful bponstos de esmision",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    getProveedores(){
      let proveedores = [];
      return API.get(CLIENTES.LISTA).then(
        res=>{
          if (res.status === 200){
            let todos = res.data
            for (var indice in todos) {
              if(todos[indice].tipoCliente.nombre === "Proveedor"){
                proveedores.push(todos[indice]);
              }
            }

           return proveedores;
            // return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    getClientes(){
      let clientes = [];
      return API.get(CLIENTES.LISTA).then(
        res=>{
          if (res.status === 200){
            let todos = res.data
            for (var indice in todos) {
              if(todos[indice].tipoCliente.nombre === "Cliente"){
                clientes.push(todos[indice]);
              }
            }

           return clientes;
            // return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    /* *********************Transportista****************************** */

    getAllTransportistas(){
      return API.get(TRANSPORTISTA).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful bponstos de esmision",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    addTransporttista(transportista){
      
      return API.post(TRANSPORTISTA, transportista)
      .then(res=>{

        if (res.status === 200) {
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    /* *********************Usuarios****************************** */
    getAllUsuarios(){
      return API.get(USUARIOS).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful USUARIOS",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    /**********************Facturas****************************** */
    addFactura(factura){
      factura["empresa_id"]=this.getEmpresaId();
      return API.post(FACTURA, factura)
      .then(res=>{

        if (res.status === 200) {
          
          return res.data.data;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }
    procesarFactura(id){
      
      return API.post(FACTURA+"/procesar/"+id)
      .then(res=>{
        if (res.status === 200) {
          return res.data;
        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

    getFactura(id_factura){
      
      return API.get(FACTURA+'/'+id_factura).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful factura",res.data)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );

    }


        /**********************FIRMA DIGITAL****************************** */
        uploadFile(file,type){
          var formData = new FormData();
          formData.append("my_file", file);
          formData.append("type", type);
          return API.post(UPLOAD_FILE, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }}).then(res=>{
              console.log("RES DATA",res)
              return res.data;
          }
          );
        }

        /**********************NOMENCLADORES****************************** */

    getTipoEmisiones(){
      return API.get(TIPO_EMISION).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    getTipoAmbiente(){
      return API.get(TIPO_AMBIENTE).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 
    getTiposIdentificacion(){
      return API.get(TIPO_IDENTIFIACION).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    getClaseContribuyentes(){
      return API.get(CLASE_CONTRIBUYENTES).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    getTipoProductos(){
      return API.get(TIPO_PRODUCTOS).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }
    getTarifaIvas(){
      return API.get(TARIFA_IVA).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }
    getFormaPagos(){
      return API.get(FORMA_PAGOS).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }
    getUnidadTiempos(){
      return API.get(UNIDAD_TIEMPOS).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }
    getTipoDocumento(){
      return API.get(TIPO_DOCUMENTO).then(
        res=>{
          if (res.status === 200){
            console.log("respuesta de la api susseful TIPO_EMISION",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }
}
