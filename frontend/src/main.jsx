import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.jsx'
import '@fontsource/inter'; 
import '@fontsource/inter/100.css'; import '@fontsource/inter/200.css'; import '@fontsource/inter/300.css'; import '@fontsource/inter/500.css'; import '@fontsource/inter/600.css'; import '@fontsource/inter/800.css'; import '@fontsource/inter/900.css';


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
