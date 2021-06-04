import axios from 'axios';
/*-------------------config-------------------*/
// const BASE_URL = 'https://localhost/api/';
const BASE_URL = 'assets/demo/data/';
const API = axios.create({
    baseURL: BASE_URL
})
/*-------------------config-------------------*/
/*-------------------Endpoints-------------------*/
/*Auntenticaciopn*/

const AUTH_ENDPOINTS = {
    // LOGIN:"login_check",
    LOGIN:"login.json",
    REGISTER:"register"
}
/*-------------------Endpoints-------------------*/


export class ServiceApp
{
 
    userLogin(username, password){
        
        return API.post(AUTH_ENDPOINTS.LOGIN, {'username': username,'password':password})
        .then(res=>{
          if (res.status === 'success') {
            console.log(res.data)
            const token = res.data.token
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