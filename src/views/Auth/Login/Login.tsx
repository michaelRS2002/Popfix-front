import React from "react";
import "./Login.scss";
import NavBar from '../../../components/NavBar'

const Login: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="app-container">
        <div className="left-section">
          <h1 className="title-logo">PopFix</h1>
          <img src="/static/img/film-icon.jpg" alt="PopFix logo" className="icon" />
        </div>

        <div className="right-section">
          <div className="login-box">
            <h2>Inicia Sesión</h2>
            <p>para acceder a tu biblioteca de películas</p>

            <form className="form">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="tu@gmail.com"
                className="input"
              />

              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="********"
                className="input"
              />

              <button type="submit" className="button">
                Iniciar Sesión
              </button>
            </form>

            <a href="#" className="forgot">
              ¿Olvidaste tu contraseña?
            </a>

            <p className="register-text">
              ¿No tienes cuenta?{" "}
              <a href="#" className="register-link">
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

