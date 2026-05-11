import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ApiInjector } from './components/ApiInjector.jsx'
import router from './router/router.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ApiInjector>
        <RouterProvider router={router} />
      </ApiInjector>
    </AuthProvider>
  </StrictMode>,
)