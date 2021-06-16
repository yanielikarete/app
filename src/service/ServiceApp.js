import axios from 'axios';
import { instances } from 'chart.js';
/*-------------------config-------------------*/
// const BASE_URL = 'https://localhost/api/';
// const BASE_URL = 'http://sgde.perfect-solutions.com.ec/api/';
const BASE_URL = 'http://localhost/';
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
    REGISTER:"register"
}
const PUNTOS_EMISION = "api/v1/puntosemision";
 
const ESTABLECIMIENTOS = "api/v1/establecimientos";

const EMPRESA = "api/v1/empresas";

const CURRENT_USER = "api/current_user";

const PRODUCTOS = "api/v1/productos";



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
            return token;

          }else{
            console.log(res);
            alert('Error autenticando');
          }
        }
        );
      }

     getCurrentUser(){
      return API.get(CURRENT_USER).then(
        res=>{
          if (res.statusText === "OK"){
            console.log("respuesta de la api susseful CURRENT USER",res.data)
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
            console.log("respuesta de la api susseful bponstos de esmision",res)
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
}