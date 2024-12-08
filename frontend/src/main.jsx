import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'

//contexts
import { SidebarProvider } from "./contexts/SideBarContext";
import { RoleProvider } from "./contexts/RoleContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RoleProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </RoleProvider>
  </StrictMode>,
)
