import { useState } from 'react';
import { useEffect } from "react";
import { useRegisterModal } from '../hooks/registerModalHook';
import { useErrorMessage } from '../hooks/showErrorHook';
import { RegisterModal } from './RegisterModal';
import { ErrorMessage } from './ErrorMessage';

import PropTypes from 'prop-types'; //desestructurar objetos prop


const Login = ( { handleLogin, handleLocalRegister } ) => {

  //Estados de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  //Estados de error
  const { showError, setError, errorMessage } = useErrorMessage();

  //Estados de registro
  const {isRegisterModalOpen, openRegisterModal, closeRegisterModal,
         registerName, handleChangeRegisterName,
         registerEmail, handleChangeRegisterEmail,
         registerPassword, handleChangeRegisterPassword } = useRegisterModal();



  
  const handleSubmit = async () => {
    try {
      await handleLogin(email, password);
    } catch (error) {
      setError(error.message); // Manejamos el error aquí, localmente
    }
  };




  /* Sign in with google */

  useEffect(() => {
    const initializeGoogleLogin = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "TU_CLIENT_ID_AQUÍ", // Reemplázalo cuando tengas uno
          callback: (response) => console.log("ID Token de Google:", response.credential),
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-login-button"),
          { theme: "filled_black", size: "large", text: "signin_with", locale: "en" }
        );
      }
    };

    if (window.google) {
      initializeGoogleLogin();
    } else {
      window.addEventListener("load", initializeGoogleLogin);
      return () => window.removeEventListener("load", initializeGoogleLogin);
    }
  }, []);



  return (

      <div className='login flex flex-col rounded-xl shadow-lg py-4 md:py-12 lg:py-16 px-8 md:px-16 lg:px-20'>

          <h2 className='ubuntu-bold text-xl text-center mb-8'>Login:</h2>

          <form className='login-form flex flex-col' onSubmit={handleSubmit}>

              <div className='login-inputs mb-8 flex flex-col justify-center items-center'>

                  <div className='login-input flex mb-4 md:mb-6'>

                    <label htmlFor="email" className="ubuntu-regular text-regular p-0 md:p-2 ml-6 w-32 flex items-center">
                      <i className="ph ph-at mr-2 text-2xl"></i>
                      Email:
                    </label>

                    <input
                      className='flex-1 p-0 md:p-2 text-center border-1 rounded-lg'
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your Email"
                    />
                    
                  </div>

                  <div className='login-input flex'>

                    <label htmlFor="password" className="ubuntu-regular text-regular p-0 md:p-2 ml-6 w-32 flex items-center">
                      <i className="ph ph-password mr-2 text-2xl"></i>
                      Password:
                    
                    </label>

                    <input
                      className='flex-1 p-0 md:p-2 text-center border-1 rounded-lg'
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Your Password"
                    />

                  </div>

                  

                  {showError && <ErrorMessage message={errorMessage} />}

                  


              </div>

              <div className='login-btns flex flex-col'>

                  <div className='login-input flex justify-center items-center mb-4 md:mb-6'>
                    <button  className="login-btn p-4 border-2 rounded-xl  ubuntu-medium text-lg" type="submit">Login</button>
                  </div>


                  <div id="google-login-button" className="g_id_signin mb-4 md:mb-6"></div>



              </div>
            { /**
              <script>
                function handleCredentialResponse(response) {

                    console.log("ID Token de Google: " + response.credential)
                    // Aquí podrías manejar la respuesta más adelante en tu backend con Node.js
                }
              </script>
               */
            }

            
          </form>

            <h2 className='ubuntu-bold text-xl text-center mb-4 md:mb-6'>Or:</h2>


            <div className='login-input flex justify-center items-center mb-4 md:mb-6' type="button">
              <button className="register-btn p-4 border-2 rounded-xl  ubuntu-medium text-lg" onClick={openRegisterModal}>Register</button>
            </div>

            {/* Modal de registro, solo se muestra si isRegisterModalOpen es true */}
            {isRegisterModalOpen && (
              <RegisterModal
                  handleLocalRegister={handleLocalRegister}
                  closeRegisterModal={closeRegisterModal}
                  registerName={registerName}
                  handleChangeRegisterName={handleChangeRegisterName}        
                  registerEmail={registerEmail}
                  handleChangeRegisterEmail={handleChangeRegisterEmail}
                  registerPassword={registerPassword}
                  handleChangeRegisterPassword={handleChangeRegisterPassword}
                    />
            )} 
      </div>

  );
};

Login.propTypes = {

  handleLogin: PropTypes.func.isRequired,
  handleLocalRegister: PropTypes.func.isRequired,
  errorMessage: PropTypes.string
};

export default Login;