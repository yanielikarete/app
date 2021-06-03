import axios from 'axios';
/*-------------------config-------------------*/
const BASE_URL = 'https://localhost/api/';
const API = axios.create({
    baseURL = BASE_URL
})
/*-------------------config-------------------*/
/*-------------------Endpoints-------------------*/
/*Auntenticaciopn*/

const AUTH_ENDPOINTS = {
    LOGIN:"login_check",
    REGISTER:"register"
}
/*-------------------Endpoints-------------------*/


export class ServiceApp
{
 
    userLogin(username, password){
        
        return API.post(AUTH_ENDPOINTS.LOGIN, {'username': username,'password':password})
        .then(res=>{
            responseData = res.data
          if (responseData.status == 'success') {
            const token = responseData.token
            axios.defaults.headers.common.Authorization = token;
            API.Authorization = token
            return token;

          }else{
            alert('Error autenticando')
          }
        }
        );
    }
   
}