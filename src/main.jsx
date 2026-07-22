import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'aos/dist/aos.css' // Importa los estilos de AOS
import AOS from 'aos' // Importa la librería AOS
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider } from './context/ThemeContext'
import './normalize.css'
import './index.css'
import App from './App.jsx'

AOS.init({
  duration: 800,
  once: true,
  offset: 300,
  easing: 'ease-out-quad'
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <ToastContainer
        position="top-right"
        autoClose={3500}
        theme="colored"
      />
    </ThemeProvider>
  </StrictMode>,
)