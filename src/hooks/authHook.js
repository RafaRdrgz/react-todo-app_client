import { useState, useEffect } from 'react';
import { loginService, logoutService, refreshTokenService } from '../services/authService';
import { googleService } from '../services/googleService';
import { registerLocalService } from '../services/registerService';
import { getAccessToken, getRefreshToken, decodeToken, setAccessToken } from '../../utils/tokenFuncs';



// Función para verificar si el JWT ha expirado
const isExpired = (exp) => {
    const currentTime = Date.now() / 1000; // Convertimos a segundos
    return exp < currentTime; // El token ha expirado si su tiempo es menor que el actual
};



// Hook para gestionar estados de ususrio, login, logout y la verificación del token JWT
export const useAuth = () => {
    

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sessionAccessToken, setSessionAccessToken] = useState(null);


  useEffect(() => { 

    document.title = 'React To-Do App';

    const authTry = async () => { await onLoadLogin();}

    authTry();
    
  }, []);



  //Intenta loguear al usuario al cargar la aplicación
  const onLoadLogin = async () => {

      // Verificamos si el token está en el localStorage al cargar la aplicación
      const storedAccessToken = getAccessToken();
      const storedRefreshToken = getRefreshToken();

      if (storedAccessToken) {

        const decodedToken = decodeToken(storedAccessToken);

        if (!isExpired(decodedToken.exp)) {

          setSessionAccessToken(storedAccessToken);
          setIsLoggedIn(true);
        }

      } else if (storedRefreshToken) {

        const newAccessToken = await refreshTokenService(storedRefreshToken);

        setAccessToken(newAccessToken);
        setSessionAccessToken(newAccessToken);
        setIsLoggedIn(true);
      }



  }



  // Función para manejar el login
  const handleLogin = async (email, password) => {

      const newAccessToken = await loginService(email, password);

      setSessionAccessToken(newAccessToken);
      setIsLoggedIn(true);

  };


  // Función para manejar el registro
  const handleLocalRegister = async (name, email, password) => {

      const newAccessToken = await registerLocalService(name, email, password, null, "local");

      console.log(newAccessToken);
      setSessionAccessToken(newAccessToken);
      setIsLoggedIn(true);

  };




  const handleGoogle = async (googleToken) => {
      const accessToken = await googleService(googleToken);
      setSessionAccessToken(accessToken);
      setIsLoggedIn(true);
  };
  

  // Función para manejar el logout
  const handleLogout = async () => {

      await logoutService(sessionAccessToken);
      setSessionAccessToken(null)
      setIsLoggedIn(false);

  };


  return { isLoggedIn, sessionAccessToken, handleLogin, handleGoogle, handleLocalRegister, handleLogout };

} 