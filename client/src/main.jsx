import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContetProvider } from './contextAPI/authContext.jsx'
createRoot(document.getElementById('root')).render(
    <AuthContetProvider>
        <BrowserRouter>
            <App />
            <ToastContainer />
        </BrowserRouter>
    </AuthContetProvider>

)
