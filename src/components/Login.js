import React, { useState,useRef } from 'react';
import { ServiceApp } from '../service/ServiceApp';

import PropTypes from 'prop-types';
import './Login.css';
import Loader from "react-loader-spinner";
import { Toast } from 'primereact/toast';


async function loginUser(credentials) {
  // aqui iria la logica de la peteicion a la api por el login, supongo que llamando a algun service
  return 'jsghdfuwebd785ss5545885253554454djsj';
}


function Login({ setToken }) {
  // const username = useFormInput('');
  // const password = useFormInput('');
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const toast = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  let serviceApp = ServiceApp.getInstance();

  // handle button click of login form
  const submitLogin = () => {
    setLoading(true);
    serviceApp.userLogin(
      username,
      password
    ).then(t=>{
      console.log(" INDEX OFF",t.indexOf("error"))
      if(t.indexOf("error")>=0){
        console.log("ERROR BIEN ENCONTRADO",t)
        toast.current.show({ severity: 'success', summary: 'No autorizado', detail: 'Error de usuario o contraseña', life: 3000 });

      }else{
        setToken(t);
      }
      setLoading(false);
    });
  }





  return (
    <div class="container_login">
      
        
      <Toast ref={toast} />
         
            <div class=" p-col-7 p-ai-center p-jc-center login_backgroud">


              <div class="row"><div class="logo-login">
                SGDE
                </div></div>
              <div class="row"><div class="img-login">
                
                </div></div>
              <div class="row"> <div class="slogan-login">
                <h1 class="titulo-slogan">Sistema de Facturación Electrónica <br/>La Solución Ideal Para Su Empresa</h1>
                <p class="subtitulo-slogan">Maneje todas sus cuentas de comercio electrónico en un solo lugar.</p>

                </div></div>






            </div>


            <div class="p-col-5 p-d-flex p-ai-center p-jc-center login-form">


              <div class="p-fluid login_fields">
                <div class="p-field">
                  <label for="username">Username</label>
                  <span class=" p-input-icon-left">
                    <i class="pi pi-user"></i>
                    <input id="username" type="text" class="p-inputtext p-component" placeholder="Username" {...username} onChange={e => setUserName(e.target.value)} />

                  </span>
                </div>
                <div class="p-field">

                  <label for="password">Password</label>
                  <span class="p-input-icon-left">

                    <i class="pi pi-lock-open"></i>
                    <input id="password" type="password" {...password} class="p-inputtext p-component p-password-input" onChange={e => setPassword(e.target.value)} />


                  </span>
                </div>

                {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
                <div class="group-btn-auth">
                <button class="p-button p-component button-login" value={loading ? 'Loading...' : 'Login'} onClick={submitLogin} disabled={loading}>
                
                {loading && <Loader type="ThreeDots" color="#00BFFF" height={18} width={40}  />}
                                  <span class="p-button-label p-c">Login</span>
                </button>

                <button class="p-button p-component button-register">
                  <span class="p-button-label p-c">Register</span>
                </button>
                </div>
              </div>


            </div>

         
        

      

    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;