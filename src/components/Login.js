import React, { useState,useRef } from 'react';
import { ServiceApp } from '../service/ServiceApp';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Login.css';
import Loader from "react-loader-spinner";
import { Toast } from 'primereact/toast';


// async function loginUser(credentials) {
//   // aqui iria la logica de la peteicion a la api por el login, supongo que llamando a algun service
//   return 'jsghdfuwebd785ss5545885253554454djsj';
// }


function Login({ setToken }) {
  // const username = useFormInput('');
  // const password = useFormInput('');
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const toast = useRef(null);
  const history = useHistory();
  // const [error, setError] = useState(null);
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
        history.push("/");
      }
      setLoading(false);
    });
  }





  return (
    <div className="container_login">
      
        
      <Toast ref={toast} />
         
            <div className=" p-col-7 p-ai-center p-jc-center login_backgroud">


              <div className="row"><div className="logo-login" style={{paddingTop: "20%"}}>
                {/* <img className="img-icon-logo" src="assets/images/icono-perfect-blanco.png"/> */}
                </div></div>
             
              <div className="row"> <div className="slogan-login">
                
                <img className="imagen-slogan" src="assets/images/perfect-byn.png" alt="imagen-slogan"/>

                </div></div>






            </div>


            <div className="p-col-5 p-d-flex p-ai-center p-jc-center login-form">


              <div className="p-fluid login_fields">
                <div className="p-field">
                  <label htmlFor="username">Nombre de Usuario</label>
                  <span className=" p-input-icon-left">
                    <i className="pi pi-user"></i>
                    <input id="username" type="text" className="p-inputtext p-component" placeholder="Username"  onChange={e => setUserName(e.target.value)} />

                  </span>
                </div>
                <div className="p-field">

                  <label htmlFor="password">Contrase&ntilde;a</label>
                  <span className="p-input-icon-left">

                    <i className="pi pi-lock-open"></i>
                    <input id="password" type="password"  className="p-inputtext p-component p-password-input" onChange={e => setPassword(e.target.value)} />


                  </span>
                </div>

                {/* {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br /> */}
                <div className="group-btn-auth">
                <button className="p-button p-component button-login" value={loading ? 'Accediendo...' : 'Entrar'} onClick={submitLogin} disabled={loading}>
                
                {loading && <Loader type="ThreeDots" color="#00BFFF" height={18} width={40}  />}
                                  <span className="p-button-label p-c">Entrar</span>
                </button>

                <button className="p-button p-component button-register">
                  <span className="p-button-label p-c">Registrarse</span>
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
// const useFormInput = initialValue => {
//   const [value, setValue] = useState(initialValue);

//   const handleChange = e => {
//     setValue(e.target.value);
//   }
//   return {
//     value,
//     onChange: handleChange
//   }
// }

export default Login;