import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RootApp from './App.jsx'
import './index.css'
import { AuthProvider } from './service/AuthProvider.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <RootApp />
    </StrictMode>,
  </AuthProvider>
)