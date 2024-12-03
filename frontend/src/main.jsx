import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

//contexts
import { SidebarProvider } from "./contexts/SidebarContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </StrictMode>,
)
