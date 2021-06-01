import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Login.css';


async function loginUser(credentials) {
  // aqui iria la logica de la peteicion a la api por el login, supongo que llamando a algun service
  return 'jsghdfuwebd785ss5545885253554454djsj';
 }


function Login({ setToken }) {
  // const username = useFormInput('');
  // const password = useFormInput('');
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // handle button click of login form
  const submitLogin = () => {
    const token = loginUser({
      username,
      password
    });
    setToken(token);



  }

  return (
<div class="container_login">
    <div class="p-col-12">
      <div class="card">
      
        <div class="p-grid">
          <div class="p-col-5 p-ai-center p-jc-center login_bacgroud">
          
          </div>

          {/* <div class="p-col-1"> */}
            <div class="p-divider p-component p-divider-vertical p-divider-solid p-divider-center"
              role="separator">
              {/* <div class="p-divider-content"><b>OR</b></div> */}
            </div>
          {/* </div> */}

          <div class="p-col-6 p-d-flex p-ai-center p-jc-center">


            <div class="p-fluid login_fields">
              <div class="p-field">
                <label for="username">Username</label>
                <span class=" p-input-icon-left">
                  <i class="pi pi-user"></i>
                  <input id="username" type="text" class="p-inputtext p-component" placeholder="Username" {...username} onChange={e => setUserName(e.target.value)}/>

                </span>
              </div>
              <div class="p-field">

                <label for="password">Password</label>
                <span class="p-input-icon-left">

                  <i class="pi pi-lock-open"></i>
                  <input id="password" type="password" {...password} class="p-inputtext p-component p-password-input"  onChange={e => setPassword(e.target.value)} />


                </span>
              </div>

              {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
              <button class="p-button p-component button-login" value={loading ? 'Loading...' : 'Login'} onClick={submitLogin} disabled={loading}>
                <span class="p-button-label p-c">Login</span>
              </button>
            </div>


          </div>

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