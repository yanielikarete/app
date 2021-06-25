import axios from 'axios';
import { instances } from 'chart.js';
/*-------------------config-------------------*/
// const BASE_URL = 'https://localhost/api/';
const BASE_URL = 'http://sgde.perfect-solutions.com.ec/';
// const BASE_URL = 'http://sgde.com/';
const API = axios.create({
    baseURL: BASE_URL
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

const UPLOAD_FILE = "api/uploadfile";

const USUARIOS =  "api/v1/usuarios";

const CLIENTES = {
  // LOGIN:"login_check",
  LISTA:"api/v1/clientes",
  ALL_TIPOS:"api/v1/tipoclientes",
  ADD:"api/v1/clientes"
}

const TRANSPORTISTA = "api/v1/transportistas";
const FACTURA = "api/v1/facturas";

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
          if (res.status === 200) {
            
            const token = res.data.token
            API.defaults.headers.common.Authorization = "Bearer " + token;
            API.Authorization = token
            console.log("entro a guardar token", API.defaults.headers.common.Authorization);
            // API.getCurrentUser()
            return token;

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
          if (res.statusText === "OK"){
            console.log("respuesta de la api susseful CURRENT USER",res.data)
            sessionStorage.setItem('USER', JSON.stringify(res.data));

            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      ).catch(function (error) {
        sessionStorage.removeItem('token')
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
          if (res.statusText === "OK"){
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
          if (res.statusText === "OK"){
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
          if (res.statusText === "OK"){
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
          if (res.statusText === "OK"){
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
          if (res.statusText === "OK"){
            console.log("respuesta de la api susseful bponstos de esmision",res.data)
          
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    } 

    getProductoById(id){
      return API.delete(PRODUCTOS+"/"+id).then(
        res=>{
          if (res.statusText === "OK"){
            console.log("respuesta de la api susseful bponstos de esmision",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }

    getProductoByName(name){
      return API.delete(PRODUCTOS+"/"+name).then(
        res=>{
          if (res.statusText === "OK"){
            console.log("respuesta de la api susseful bponstos de esmision",res)
            return res.data;
          }else{

            console.log("respuesta de la api failed",res.status);
          }
        }
      );
    }

     /* *********************Productos****************************** */

     saveEmpresa(empresa){
      
      return API.post(EMPRESA, empresa)
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
          
          return res.success;

        }else{
          console.log(res);
          return res.success;
        }
      }
      );
    }

     /* *********************Upload File****************************** */

     uploadFile(file){
      
      return API.post(UPLOAD_FILE, file)
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
          if (res.statusText === "OK"){
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
          if (res.statusText === "OK"){
            let todos = res.data
            for (var indice in todos) {
              if(todos[indice].tipoCliente.id == 1){
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
          if (res.statusText === "OK"){
            let todos = res.data
            for (var indice in todos) {
              if(todos[indice].tipoCliente.id == 2){
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
          if (res.statusText === "OK"){
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
          if (res.statusText === "OK"){
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
      
      return API.post(FACTURA, factura)
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
}
